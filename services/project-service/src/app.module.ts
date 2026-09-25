import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt.guard';
import { ProjectsController } from './projects.controller';
import { HealthController } from './health.controller';

@Module({ imports: [JwtModule.register({})], controllers: [ProjectsController, HealthController], providers: [JwtAuthGuard] })
export class AppModule {}
