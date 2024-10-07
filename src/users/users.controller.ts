import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from '@src/guards';
import { GetUser } from '@src/decorators';
import { JwtValidationResultPayload } from '@src/auth/strategy/jwt.dto';
import { UpdateUserDto, updateUserSchema } from './dto';
import { Actions } from '@src/decorators/actions.decorator';
import { ActionsGuard } from '@src/guards/actions.guard';
import { ACTION_USER_READ } from '@src/permissions/actions';
import { ZodValidate } from '@src/pipes/zod-validation-pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@GetUser() user: JwtValidationResultPayload) {
    return user;
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  @ZodValidate(updateUserSchema)
  updateUser(
    @GetUser() userData: JwtValidationResultPayload,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(userData.user.id, dto);
  }

  @UseGuards(JwtGuard, ActionsGuard)
  @Actions([ACTION_USER_READ.name])
  @Get('admin')
  getDataWithPermission() {
    return 'Success!';
  }
}
