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
import { ZodValidationPipe } from '@src/pipes/zod-validation-pipe';

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

  @Post('get-token')
  @UsePipes(new ZodValidationPipe(tokenInformationSchema))
  getTokenByRefreshToken(@Body() tokenInformation: TokenInformation) {
    return this.authService.getTokenByRefreshToken(tokenInformation);
  }
}
