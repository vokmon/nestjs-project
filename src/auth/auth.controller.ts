import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from '@src/pipes/zod-validation-pipe';
import {
  UserSigninSchema,
  userSigninSchema,
  UserSignupSchema,
  userSignupSchema,
} from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UsePipes(new ZodValidationPipe(userSignupSchema))
  signup(@Body() userSignupSchema: UserSignupSchema) {
    console.log(userSignupSchema);
    return this.authService.signup();
  }

  @Post('signin')
  @UsePipes(new ZodValidationPipe(userSigninSchema))
  signin(@Body() userSignInSchema: UserSigninSchema) {
    console.log(userSignInSchema);
    return this.authService.signin();
  }
}
