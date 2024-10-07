import { Module } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { BookmarksController } from './bookmarks.controller';
import { DatasourceModule } from '@src/datasource/datasource.module';
import { JwtModule } from '@nestjs/jwt';
import { AdminBookmarksController } from './bookmards-admin.controller';

@Module({
  imports: [DatasourceModule, JwtModule.register({})],
  controllers: [BookmarksController, AdminBookmarksController],
  providers: [BookmarksService],
})
export class BookmarksModule {}
