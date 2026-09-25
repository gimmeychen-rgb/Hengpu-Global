import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { db } from './database';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const token = String(req.headers.authorization || '').replace('Bearer ', '');
    if (!token) throw new UnauthorizedException('Missing bearer token');
    try {
      if (!process.env.JWT_SECRET) throw new UnauthorizedException('JWT secret is not configured');
      const payload = await this.jwt.verifyAsync(token, { secret: process.env.JWT_SECRET });
      const user = await db.query('SELECT id, name, email, role, trust_score FROM users WHERE id = $1', [payload.sub]);
      if (!user.rowCount) throw new UnauthorizedException('User not found');
      req.user = user.rows[0];
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
