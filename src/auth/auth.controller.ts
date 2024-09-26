import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import {
  UserSigninDto,
  userSigninSchema,
  UserSignupDto,
  userSignupSchema,
} from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UsePipes(new ZodValidationPipe(userSignupSchema))
  signup(@Body() userSignupDto: UserSignupDto) {
    return this.authService.signup(userSignupDto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(userSigninSchema))
  signin(@Body() userSigninDto: UserSigninDto) {
    return this.authService.signin(userSigninDto);
  }
}
