import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth } from './auth';
import { AuthController } from './auth.controller';
import { DatasourceModule } from '@src/datasource/datasource.module';
@Module({
  imports: [DatasourceModule],
  providers: [AuthService, Auth],
  controllers: [AuthController],
})
export class AuthModule {}
