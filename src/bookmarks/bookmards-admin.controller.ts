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
import { Actions } from '@src/decorators/actions.decorator';
import { ACTION_BOOKMARK_READ_ALL } from '@src/permissions/actions';
import { JwtValidationResultPayload } from '@src/auth/strategy/jwt.dto';
import { GetUser } from '@src/decorators';

@Controller('admin/bookmarks')
@UseGuards(JwtGuard)
export class AdminBookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Get()
  @UseGuards(ActionsGuard)
  @Actions([ACTION_BOOKMARK_READ_ALL.name])
  findAll() {
    return this.bookmarksService.findAll();
  }

  @Get(':id')
  @UseGuards(ActionsGuard)
  @Actions([ACTION_BOOKMARK_READ_ALL.name])
  findOne(@Param('id') id: string) {
    return this.bookmarksService.findOne(id);
  }

  @Post()
  create(
    @GetUser() userData: JwtValidationResultPayload,
    @Body() createBookmarkDto: CreateBookmarkDto,
  ) {
    return this.bookmarksService.create(createBookmarkDto, userData.user.id);
  }

  @Patch(':id')
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
