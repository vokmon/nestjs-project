import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from '@src/auth/guards';
import { GetUser } from '@src/decorators';
import { JwtValidationResultPayload } from '@src/auth/strategy/jwt.dto';
import { UpdateUserDto } from './dto';

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
  updateUser(
    @GetUser() userData: JwtValidationResultPayload,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(userData.user.id, dto);
  }
}
