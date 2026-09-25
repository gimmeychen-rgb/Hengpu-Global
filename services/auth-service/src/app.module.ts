import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';
import { RolesGuard } from './roles.guard';
import { HealthController } from './health.controller';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController, HealthController],
  providers: [AuthService, JwtAuthGuard, RolesGuard]
})
export class AppModule {}
