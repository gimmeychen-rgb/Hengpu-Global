import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { db } from './database';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const header = request.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    if (!token) {
      throw new UnauthorizedException('Missing bearer token');
    }

    try {
      if (!process.env.JWT_SECRET) {
        throw new UnauthorizedException('JWT secret is not configured');
      }
      const payload = await this.jwt.verifyAsync(token, {
        secret: process.env.JWT_SECRET
      });
      const result = await db.query(
        'SELECT id, name, email, role, trust_score, created_at FROM users WHERE id = $1',
        [payload.sub]
      );
      if (!result.rowCount) {
        throw new UnauthorizedException('User not found');
      }
      request.user = result.rows[0];
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
