import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthPayload, TokenInformation, UserDto } from './auth.dto';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class Auth {
  constructor(
    private config: ConfigService,
    private jwtService: JwtService,
  ) {}

  getSecretBufferValue = () => {
    return Buffer.from(this.config.get<string>('AUTH_SECRET')!, 'utf-8');
  };

  getAuthSecretToken = () => {
    return this.config.get<string>('ACCESS_JWT_TOKEN_SECRET');
  };

  getRefreshSecretToken = () => {
    return this.config.get<string>('REFRESH_JWT_TOKEN_SECRET');
  };

  async signToken(userDto: UserDto, jwtSignOptions: JwtSignOptions) {
    // See what can be included in jwt https://www.iana.org/assignments/jwt/jwt.xhtml
    const payload: AuthPayload = {
      sub: userDto.id,
      email: userDto.email,
      name: userDto.firstName,
      family_name: userDto.lastName,
      role: userDto.role.id,
    };

    return this.jwtService.signAsync(payload, jwtSignOptions);
  }

  verifyTokenInformation(tokenInformation: TokenInformation): AuthPayload {
    const { access_token, refresh_token } = tokenInformation;

    let accessTokenData;
    try {
      // decode access token
      accessTokenData = this.jwtService.decode(access_token, {
        complete: true,
        json: true,
      });
    } catch (e) {
      console.error('Invalid access token', e);
      throw new UnauthorizedException('Invalid access token');
    }

    const payload: AuthPayload = accessTokenData.payload;

    try {
      this.jwtService.verify(refresh_token, {
        secret: this.getRefreshSecretToken(),
      });
    } catch (e) {
      console.error('Invalid refresh token', e);
      throw new UnauthorizedException('Invalid refresh token.');
    }

    return payload;
  }
}
