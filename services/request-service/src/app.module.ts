import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt.guard';
import { RequestsController } from './requests.controller';
import { HealthController } from './health.controller';

@Module({ imports: [JwtModule.register({})], controllers: [RequestsController, HealthController], providers: [JwtAuthGuard] })
export class AppModule {}
