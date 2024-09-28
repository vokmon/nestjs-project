import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { DatasourceModule } from '@src/datasource/datasource.module';
import { AuthService } from './auth.service';
import { Auth } from './auth';
import { JwtStrategy } from './strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [DatasourceModule, ConfigModule, JwtModule.register({})],
  providers: [AuthService, Auth, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
