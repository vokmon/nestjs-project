import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth } from './auth';
import { AuthController } from './auth.controller';

@Module({
  providers: [AuthService, Auth],
  controllers: [AuthController],
})
export class AuthModule {}
