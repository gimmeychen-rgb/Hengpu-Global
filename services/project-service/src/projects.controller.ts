import { Body, Controller, Get, NotFoundException, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { db } from './database';
import { JwtAuthGuard } from './jwt.guard';
import { CreateProjectDto, UpdateProjectStatusDto } from './projects.dto';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  @Post('create')
  async create(@Body() dto: CreateProjectDto) {
    const result = await db.query(
      'INSERT INTO projects (request_id, buyer_id, supplier_id) VALUES ($1, $2, $3) RETURNING *',
      [dto.request_id, dto.buyer_id, dto.supplier_id]
    );
    return result.rows[0];
  }

  @Get()
  async list() {
    const result = await db.query(
      `SELECT p.*, r.title, b.company_name AS buyer_company, s.company_name AS supplier_company
       FROM projects p
       JOIN requests r ON r.id = p.request_id
       JOIN buyers b ON b.id = p.buyer_id
       JOIN suppliers s ON s.id = p.supplier_id
       ORDER BY p.created_at DESC`
    );
    return result.rows;
  }

  @Patch(':id/status')
  async updateStatus(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateProjectStatusDto) {
    const project = await db.query(
      `UPDATE projects SET status = $2 WHERE id = $1 RETURNING *`,
      [id, dto.status]
    );
    const updated = project.rows[0];
    if (!updated) throw new NotFoundException('Project not found');

    if (dto.status === 'closed' && dto.outcome === 'success') {
      await db.query(
        `UPDATE users SET trust_score = LEAST(trust_score + 20, 200)
         WHERE id IN (
           SELECT user_id FROM buyers WHERE id = $1
           UNION
           SELECT user_id FROM suppliers WHERE id = $2
         )`,
        [updated.buyer_id, updated.supplier_id]
      );
    }

    if (dto.status === 'closed' && dto.outcome === 'failed') {
      await db.query(
        `UPDATE users SET trust_score = GREATEST(trust_score - 15, 0)
         WHERE id IN (
           SELECT user_id FROM buyers WHERE id = $1
           UNION
           SELECT user_id FROM suppliers WHERE id = $2
         )`,
        [updated.buyer_id, updated.supplier_id]
      );
    }

    return updated;
  }
}
