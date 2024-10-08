import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto, UpdateBookmarkDto } from './dto';
import { JwtGuard } from '@src/guards';
import { ActionsGuard } from '@src/guards/actions.guard';
import { ActionPermissions } from '@src/decorators/actions-permissions.decorator';
import { ACTION_BOOKMARK_READ_ALL, ACTION_BOOKMARK_WRITE_ALL } from '@src/permissions/actions';
import { JwtValidationResultPayload } from '@src/auth/strategy/jwt.dto';
import { GetUser } from '@src/decorators';

@Controller('admin/bookmarks')
@UseGuards(JwtGuard, ActionsGuard)
export class AdminBookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Get()
  @ActionPermissions([ACTION_BOOKMARK_READ_ALL.name])
  findAll() {
    return this.bookmarksService.findAll();
  }

  @Get(':id')
  @ActionPermissions([ACTION_BOOKMARK_READ_ALL.name])
  findOne(@Param('id') id: string) {
    return this.bookmarksService.findOne(id);
  }

  @Post()
  @ActionPermissions([ACTION_BOOKMARK_WRITE_ALL.name])
  create(
    @GetUser() userData: JwtValidationResultPayload,
    @Body() createBookmarkDto: CreateBookmarkDto,
  ) {
    return this.bookmarksService.create(createBookmarkDto, userData.user.id);
  }

  @Patch(':id')
  @ActionPermissions([ACTION_BOOKMARK_WRITE_ALL.name])
  update(
    @GetUser() userData: JwtValidationResultPayload,
    @Param('id') id: string,
    @Body() updateBookmarkDto: UpdateBookmarkDto,
  ) {
    return this.bookmarksService.update(
      id,
      updateBookmarkDto,
      userData.user.id,
    );
  }
}
