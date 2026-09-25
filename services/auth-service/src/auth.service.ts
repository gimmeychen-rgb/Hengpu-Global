import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { db } from './database';
import { LoginDto, RegisterDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}

  async register(dto: RegisterDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const client = await db.connect();

    try {
      await client.query('BEGIN');
      const existing = await client.query('SELECT id FROM users WHERE email = $1', [dto.email]);
      if (existing.rowCount) {
        throw new BadRequestException('Email already registered');
      }

      const trustScore = dto.company_name && dto.country ? 60 : 50;
      const userResult = await client.query(
        'INSERT INTO users (name, email, password_hash, role, trust_score) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, trust_score, created_at',
        [dto.name, dto.email, passwordHash, dto.role, trustScore]
      );
      const user = userResult.rows[0];

      if (dto.role === 'buyer' && dto.company_name && dto.country) {
        await client.query('INSERT INTO buyers (user_id, company_name, country) VALUES ($1, $2, $3)', [
          user.id,
          dto.company_name,
          dto.country
        ]);
      }
      if (dto.role === 'supplier' && dto.company_name && dto.country) {
        await client.query(
          'INSERT INTO suppliers (user_id, company_name, country, product_categories) VALUES ($1, $2, $3, $4)',
          [user.id, dto.company_name, dto.country, []]
        );
      }

      await client.query('COMMIT');
      return { user, token: await this.sign(user) };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async login(dto: LoginDto) {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [dto.email]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(dto.password, user.password_hash))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const profile = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      trust_score: user.trust_score,
      created_at: user.created_at
    };
    return { user: profile, token: await this.sign(profile) };
  }

  private async sign(user: { id: string; email: string; role: string }) {
    if (!process.env.JWT_SECRET) {
      throw new Error('Missing required environment variable: JWT_SECRET');
    }
    return this.jwt.signAsync(
      { sub: user.id, email: user.email, role: user.role },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '1d'
      }
    );
  }
}
