import { Controller, Get, NotFoundException, Param, ParseUUIDPipe } from '@nestjs/common';
import { db } from './database';

@Controller()
export class MatchingController {
  @Get('requests/:id/matches')
  async requestMatches(@Param('id', ParseUUIDPipe) id: string) {
    return this.calculateMatches(id);
  }

  @Get('matches/request/:id')
  async matches(@Param('id', ParseUUIDPipe) id: string) {
    return this.calculateMatches(id);
  }

  private async calculateMatches(requestId: string) {
    const requestResult = await db.query('SELECT * FROM requests WHERE id = $1', [requestId]);
    const request = requestResult.rows[0];
    if (!request) {
      throw new NotFoundException('Request not found');
    }

    const suppliers = await db.query(
      `SELECT s.id, s.country, s.product_categories, u.trust_score
       FROM suppliers s
       JOIN users u ON u.id = s.user_id`
    );

    const scored = suppliers.rows
      .map((supplier) => {
        const categoryMatch = supplier.product_categories?.includes(request.category) ? 1 : 0;
        const countryMatch = supplier.country === request.country_target ? 1 : 0;
        const trustScore = Number(supplier.trust_score || 0) / 100;
        const historyMatch = 0;
        const score = Math.round(categoryMatch * 40 + countryMatch * 30 + trustScore * 20 + historyMatch * 10);
        return { supplier_id: supplier.id, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    for (const match of scored) {
      await db.query(
        `INSERT INTO matches (request_id, supplier_id, score)
         VALUES ($1, $2, $3)
         ON CONFLICT (request_id, supplier_id)
         DO UPDATE SET score = EXCLUDED.score
         RETURNING id`,
        [requestId, match.supplier_id, match.score]
      );
    }

    return { request_id: requestId, matches: scored };
  }
}
