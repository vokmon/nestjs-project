import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth } from './auth';
import { AuthController } from './auth.controller';
import { DatasourceModule } from '@src/datasource/datasource.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [DatasourceModule, ConfigModule],
  providers: [AuthService, Auth],
  controllers: [AuthController],
})
export class AuthModule {}
