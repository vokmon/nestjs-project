import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatasourceService } from '@src/datasource/datasource.service';
import { CreateBookmarkDto, UpdateBookmarkDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BookmarksService {
  constructor(private datasourceService: DatasourceService) {}

  // Admin methods
  async findAll() {
    return await this.datasourceService.bookmark.findMany({
      include: { createdBy: false, updatedBy: false },
    });
  }

  async findOne(id: string) {
    const bookmark = await this.datasourceService.bookmark.findUnique({
      where: { id },
      include: { createdBy: false, updatedBy: false },
    });
    if (!bookmark)
      throw new NotFoundException(`Bookmark with ID ${id} not found`);
    return bookmark;
  }

  async create(createBookmarkDto: CreateBookmarkDto, userId: string) {
    try {
      return await this.datasourceService.bookmark.create({
        data: {
          name: createBookmarkDto.name,
          link: createBookmarkDto.link,
          description: createBookmarkDto.description,
          createdById: userId,
          updatedById: userId,
        },
        select: {
          id: true,
          name: true,
          link: true,
          description: true,
        },
      });
    } catch (e) {
      this.handleDatabaseError(e);
    }
  }

  async update(
    id: string,
    updateBookmarkDto: UpdateBookmarkDto,
    userId: string,
  ) {
    try {
      return await this.datasourceService.bookmark.update({
        where: { id },
        data: { ...updateBookmarkDto, updatedById: userId },
      });
    } catch (e) {
      this.handleDatabaseError(e);
    }
  }

  private handleDatabaseError(e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // https://www.prisma.io/docs/orm/reference/error-reference
      if (e.code === 'P2002') {
        throw new ConflictException('The name is already taken.');
      }
    }
    throw e;
  }

  // User methods
  async findAllForUser(userId: string) {
    return this.datasourceService.bookmark.findMany({
      where: { createdById: userId },
    });
  }

  async findOneForUser(userId: string, bookmarkId: string) {
    const bookmark = await this.datasourceService.bookmark.findFirst({
      where: { id: bookmarkId, createdById: userId },
    });
    if (!bookmark)
      throw new NotFoundException(
        `Bookmark not found or you don't have access`,
      );
    return bookmark;
  }

  async createForUser(userId: string, createBookmarkDto: CreateBookmarkDto) {
    return this.create(createBookmarkDto, userId);
  }

  async updateForUser(
    userId: string,
    bookmarkId: string,
    updateBookmarkDto: UpdateBookmarkDto,
  ) {
    return this.update(bookmarkId, updateBookmarkDto, userId);
  }
}
