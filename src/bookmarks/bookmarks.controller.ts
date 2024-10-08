import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { JwtGuard } from '@src/guards';
import { GetUser } from '@src/decorators';
import { JwtValidationResultPayload } from '@src/auth/strategy/jwt.dto';
import { ZodValidate } from '@src/pipes/zod-validation-pipe';
import {
  CreateBookmarkDto,
  createBookmarkSchema,
  UpdateBookmarkDto,
  updateBookmarkSchema,
} from './dto';
import { ActionsGuard } from '@src/guards/actions.guard';
import { ActionPermissions } from '@src/decorators/actions-permissions.decorator';
import { ACTION_BOOKMARK_READ, ACTION_BOOKMARK_WRITE } from '@src/permissions/actions';

@UseGuards(JwtGuard, ActionsGuard)
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Get()
  @ActionPermissions([ACTION_BOOKMARK_READ.name])
  findAll(@GetUser() userData: JwtValidationResultPayload) {
    return this.bookmarksService.findAllForUser(userData.user.id);
  }

  @Get(':id')
  @ActionPermissions([ACTION_BOOKMARK_READ.name])
  findOne(
    @Param('id') id: string,
    @GetUser() userData: JwtValidationResultPayload,
  ) {
    return this.bookmarksService.findOneForUser(userData.user.id, id);
  }

  @Post()
  @ZodValidate(createBookmarkSchema)
  @ActionPermissions([ACTION_BOOKMARK_WRITE.name])
  create(
    @GetUser() userData: JwtValidationResultPayload,
    @Body() createBookmarkDto: CreateBookmarkDto,
  ) {
    return this.bookmarksService.createForUser(
      userData.user.id,
      createBookmarkDto,
    );
  }

  @Patch(':id')
  @ZodValidate(updateBookmarkSchema)
  @ActionPermissions([ACTION_BOOKMARK_WRITE.name])
  update(
    @GetUser() userData: JwtValidationResultPayload,
    @Param('id') id: string,
    @Body() updateBookmarkDto: UpdateBookmarkDto,
  ) {
    return this.bookmarksService.updateForUser(
      userData.user.id,
      id,
      updateBookmarkDto,
    );
  }
}
