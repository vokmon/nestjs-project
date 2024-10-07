import { Test, TestingModule } from '@nestjs/testing';
import { BookmarksService } from '@src/bookmarks/bookmarks.service';
import { DatasourceService } from '@src/datasource/datasource.service';

describe('BookmarksService', () => {
  let service: BookmarksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookmarksService, DatasourceService],
    }).compile();

    service = module.get<BookmarksService>(BookmarksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
