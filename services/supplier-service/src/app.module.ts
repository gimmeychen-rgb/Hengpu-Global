import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt.guard';
import { SuppliersController } from './suppliers.controller';
import { HealthController } from './health.controller';

@Module({ imports: [JwtModule.register({})], controllers: [SuppliersController, HealthController], providers: [JwtAuthGuard] })
export class AppModule {}
