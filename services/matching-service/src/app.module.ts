import { Module } from '@nestjs/common';
import { MatchingController } from './matching.controller';
import { HealthController } from './health.controller';

@Module({ controllers: [MatchingController, HealthController] })
export class AppModule {}
