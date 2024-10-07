import { Test, TestingModule } from '@nestjs/testing';
import { BookmarksController } from '@src/bookmarks/bookmarks.controller';
import { BookmarksService } from '@src/bookmarks/bookmarks.service';
import { DatasourceModule } from '@src/datasource/datasource.module';
import { DatasourceService } from '@src/datasource/datasource.service';
import datasourceMockService from '../mock/db/datasource-mock';

describe('BookmarksController', () => {
  let controller: BookmarksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatasourceModule],
      controllers: [BookmarksController],
      providers: [
        BookmarksService,
        {
          provide: DatasourceService,
          useValue: datasourceMockService,
        },
      ],
    }).compile();

    controller = module.get<BookmarksController>(BookmarksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
