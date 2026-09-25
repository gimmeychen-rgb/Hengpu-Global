import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersController } from './users.controller';
import { JwtAuthGuard } from './jwt.guard';
import { HealthController } from './health.controller';

@Module({ imports: [JwtModule.register({})], controllers: [UsersController, HealthController], providers: [JwtAuthGuard] })
export class AppModule {}
