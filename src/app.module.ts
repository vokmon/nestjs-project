import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatasourceModule } from './datasource/datasource.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, DatasourceModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
