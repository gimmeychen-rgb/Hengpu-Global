import { Body, Controller, ForbiddenException, Get, NotFoundException, Param, ParseUUIDPipe, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { db } from './database';
import { JwtAuthGuard } from './jwt.guard';
import { UpdateUserDto } from './users.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  @Get()
  async list(@Query('role') role?: string) {
    const result = role
      ? await db.query('SELECT id, name, email, role, trust_score, created_at FROM users WHERE role = $1 ORDER BY created_at DESC', [role])
      : await db.query('SELECT id, name, email, role, trust_score, created_at FROM users ORDER BY created_at DESC');
    return result.rows;
  }

  @Get(':id')
  async get(@Param('id', ParseUUIDPipe) id: string) {
    const result = await db.query('SELECT id, name, email, role, trust_score, created_at FROM users WHERE id = $1', [id]);
    if (!result.rowCount) throw new NotFoundException('User not found');
    return result.rows[0];
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUserDto, @Req() req: { user: { role: string; id: string } }) {
    const allowedColumns = new Set(['name', 'role', 'trust_score']);
    const fields = Object.entries(dto).filter(([key, value]) => allowedColumns.has(key) && value !== undefined);
    if (!fields.length) return this.get(id);
    const allowed = req.user.role === 'admin' || req.user.id === id;
    if (!allowed) throw new ForbiddenException('Forbidden');
    const sets = fields.map(([key], index) => `${key} = $${index + 2}`).join(', ');
    const values = fields.map(([, value]) => value);
    const result = await db.query(
      `UPDATE users SET ${sets} WHERE id = $1 RETURNING id, name, email, role, trust_score, created_at`,
      [id, ...values]
    );
    if (!result.rowCount) throw new NotFoundException('User not found');
    return result.rows[0];
  }
}
