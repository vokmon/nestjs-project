import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth } from './auth';
import { AuthController } from './auth.controller';
import { DatasourceModule } from '@src/datasource/datasource.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy, RefreshJwtStrategy } from './strategy';
@Module({
  imports: [DatasourceModule, ConfigModule, JwtModule.register({})],
  providers: [AuthService, Auth, JwtStrategy, RefreshJwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
