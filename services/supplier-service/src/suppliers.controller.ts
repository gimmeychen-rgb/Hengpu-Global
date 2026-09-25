import { Body, Controller, Get, NotFoundException, Param, ParseUUIDPipe, Post, Req, UseGuards } from '@nestjs/common';
import { db } from './database';
import { JwtAuthGuard } from './jwt.guard';
import { CreateSupplierDto } from './suppliers.dto';

@Controller('suppliers')
export class SuppliersController {
  @Post('create')
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateSupplierDto, @Req() req: { user: { id: string; role: string } }) {
    const result = await db.query(
      'INSERT INTO suppliers (user_id, company_name, country, product_categories, verified) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, dto.company_name, dto.country, dto.product_categories, Boolean(dto.verified)]
    );
    if (dto.company_name && dto.country) {
      await db.query('UPDATE users SET trust_score = LEAST(trust_score + 10, 200) WHERE id = $1', [req.user.id]);
    }
    if (dto.verified) {
      await db.query('UPDATE users SET trust_score = LEAST(trust_score + 20, 200) WHERE id = $1', [req.user.id]);
    }
    return result.rows[0];
  }

  @Get()
  async list() {
    const result = await db.query(
      'SELECT s.*, u.name, u.email, u.trust_score FROM suppliers s JOIN users u ON u.id = s.user_id ORDER BY s.company_name'
    );
    return result.rows;
  }

  @Get(':id')
  async get(@Param('id', ParseUUIDPipe) id: string) {
    const result = await db.query(
      'SELECT s.*, u.name, u.email, u.trust_score FROM suppliers s JOIN users u ON u.id = s.user_id WHERE s.id = $1',
      [id]
    );
    if (!result.rowCount) throw new NotFoundException('Supplier not found');
    return result.rows[0];
  }
}
