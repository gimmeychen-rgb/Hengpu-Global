import { BadRequestException, Body, Controller, ForbiddenException, Get, NotFoundException, Param, ParseUUIDPipe, Post, Req, UseGuards } from '@nestjs/common';
import { db } from './database';
import { JwtAuthGuard } from './jwt.guard';
import { CreateRequestDto } from './requests.dto';

@Controller('requests')
export class RequestsController {
  @Post('create')
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateRequestDto, @Req() req: { user: { id: string; role: string } }) {
    if (req.user.role !== 'buyer') {
      throw new ForbiddenException('Only buyers can create requests');
    }
    if (dto.budget_max < dto.budget_min) {
      throw new BadRequestException('budget_max must be greater than or equal to budget_min');
    }

    let buyer = await db.query('SELECT id FROM buyers WHERE user_id = $1', [req.user.id]);
    if (!buyer.rowCount) {
      buyer = await db.query(
        'INSERT INTO buyers (user_id, company_name, country) VALUES ($1, $2, $3) RETURNING id',
        [req.user.id, 'Buyer Company', dto.country_target]
      );
      await db.query('UPDATE users SET trust_score = LEAST(trust_score + 10, 200) WHERE id = $1', [req.user.id]);
    }

    const result = await db.query(
      'INSERT INTO requests (buyer_id, title, description, category, budget_min, budget_max, country_target) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [buyer.rows[0].id, dto.title, dto.description, dto.category, dto.budget_min, dto.budget_max, dto.country_target]
    );
    return result.rows[0];
  }

  @Get()
  async list() {
    const result = await db.query(
      'SELECT r.*, b.company_name AS buyer_company, b.country AS buyer_country FROM requests r JOIN buyers b ON b.id = r.buyer_id ORDER BY r.id DESC'
    );
    return result.rows;
  }

  @Get(':id')
  async get(@Param('id', ParseUUIDPipe) id: string) {
    const result = await db.query(
      'SELECT r.*, b.company_name AS buyer_company, b.country AS buyer_country FROM requests r JOIN buyers b ON b.id = r.buyer_id WHERE r.id = $1',
      [id]
    );
    if (!result.rowCount) throw new NotFoundException('Request not found');
    return result.rows[0];
  }
}
