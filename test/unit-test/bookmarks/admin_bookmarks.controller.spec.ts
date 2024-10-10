import { Test, TestingModule } from '@nestjs/testing';
import { BookmarksService } from '@src/bookmarks/bookmarks.service';
import { DatasourceModule } from '@src/datasource/datasource.module';
import { DatasourceService } from '@src/datasource/datasource.service';
import datasourceMockService from '../mock/db/datasource-mock';
import { JwtValidationResultPayload } from '@src/auth/strategy/jwt.dto';
import { userWithNormalRole } from '../mock/users';
import { bookmarks } from '../mock/bookmarks';
import { expect } from 'vitest';
import { Prisma } from '@prisma/client';
import { AdminBookmarksController } from '@src/bookmarks/bookmards-admin.controller';

describe('AdminBookmarksController', () => {
  let controller: AdminBookmarksController;
  const userData: JwtValidationResultPayload = {
    user: userWithNormalRole,
    actions: [],
  }; // Mock user data

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatasourceModule],
      controllers: [AdminBookmarksController],
      providers: [
        BookmarksService,
        {
          provide: DatasourceService,
          useValue: datasourceMockService,
        },
      ],
    }).compile();

    controller = module.get<AdminBookmarksController>(AdminBookmarksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return bookmarks', async () => {
    await controller.findAll();
    expect(datasourceMockService.bookmark.findMany).toHaveBeenCalledOnce();
  });

  it('should return the specific bookmark', async () => {
    datasourceMockService.bookmark.findUnique.mockResolvedValue(bookmarks[0]);
    const result = await controller.findOne('1');
    expect(result).toBeDefined();
  });

  it('should return an error when the specific bookmark is not found', async () => {
    const userData: JwtValidationResultPayload = {
      user: userWithNormalRole,
      actions: [],
    }; // Mock user data
    datasourceMockService.bookmark.findFirst.mockResolvedValue(null);
    expect(async () => {
      await controller.findOne('1');
    }).rejects.toThrowError(`Bookmark with ID 1 not found`);
  });

  it('should successfully add a new bookmark', async () => {
    const userData: JwtValidationResultPayload = {
      user: userWithNormalRole,
      actions: [],
    }; // Mock user data

    const bookmark = {
      name: 'hotmail',
      description: 'Hotmail link',
      link: 'http://www.hotmail.com',
    };

    controller.create(userData, bookmark);
    expect(datasourceMockService.bookmark.create).toHaveBeenCalledOnce(); // Assert service call
  });

  it('should not be able to add a new bookmark because the name is duplicated', async () => {
    const userData: JwtValidationResultPayload = {
      user: userWithNormalRole,
      actions: [],
    }; // Mock user data

    const bookmark = {
      name: 'hotmail',
      description: 'Hotmail link',
      link: 'http://www.hotmail.com',
    };

    datasourceMockService.bookmark.create.mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError('The name is already taken.', {
        code: 'P2002',
        clientVersion: '1',
      }),
    );
    expect(async () => {
      await controller.create(userData, bookmark);
    }).rejects.toThrowError(`The name is already taken.`);
  });

  it('should successfully update an existing bookmark', async () => {
    const userData: JwtValidationResultPayload = {
      user: userWithNormalRole,
      actions: [],
    }; // Mock user data

    const bookmark = {
      name: 'hotmail',
      description: 'Hotmail link',
      link: 'http://www.hotmail.com',
    };
    datasourceMockService.bookmark.findUnique.mockResolvedValue(bookmarks[0]);
    controller.update(userData, '1', bookmark);
    expect(datasourceMockService.bookmark.update).toHaveBeenCalledOnce();
  });

  it('should not be able to update an existing bookmark because the name is duplicated', async () => {
    const userData: JwtValidationResultPayload = {
      user: userWithNormalRole,
      actions: [],
    }; // Mock user data

    const bookmark = {
      name: 'hotmail',
      description: 'Hotmail link',
      link: 'http://www.hotmail.com',
    };

    datasourceMockService.bookmark.update.mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError('The name is already taken.', {
        code: 'P2002',
        clientVersion: '1',
      }),
    );
    expect(async () => {
      await controller.update(userData, "1", bookmark);
    }).rejects.toThrowError(`The name is already taken.`);
  });
});
