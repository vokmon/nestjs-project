import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserDto } from './auth.dto';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class Auth {
  constructor(
    private config: ConfigService,
    private jwtService: JwtService,
  ) {}

  getSecretBufferValue = () => {
    return Buffer.from(this.config.get<string>('AUTH_SECRET'), 'utf-8');
  };

  async signToken(userDto: UserDto, jwtSignOptions: JwtSignOptions) {
    // See what can be included in jwt https://www.iana.org/assignments/jwt/jwt.xhtml
    const payload = {
      sub: userDto.id,
      email: userDto.email,
      name: userDto.firstName,
      family_name: userDto.lastName,
    };

    return this.jwtService.signAsync(payload, jwtSignOptions);
  }
}
