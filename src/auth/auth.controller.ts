import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common';
import {
  TokenInformation,
  tokenInformationSchema,
  UserSigninDto,
  userSigninSchema,
  UserSignupDto,
  userSignupSchema,
} from './auth.dto';
import { AuthService } from './auth.service';
import { ZodValidate, ZodValidationPipe } from '@src/pipes/zod-validation-pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ZodValidate(userSignupSchema)
  signup(@Body() userSignupDto: UserSignupDto) {
    return this.authService.signup(userSignupDto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ZodValidate(userSigninSchema)
  signin(@Body() userSigninDto: UserSigninDto) {
    return this.authService.signin(userSigninDto);
  }

  @Post('get-token')
  @HttpCode(HttpStatus.OK)
  @ZodValidate(tokenInformationSchema)
  getTokenByRefreshToken(@Body() tokenInformation: TokenInformation) {
    return this.authService.getTokenByRefreshToken(tokenInformation);
  }
}
