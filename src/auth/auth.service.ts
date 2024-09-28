import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { DatasourceService } from '../datasource/datasource.service';
import {
  TokenInformation,
  UserDto,
  UserSigninDto,
  UserSignupDto,
} from './auth.dto';
import { Prisma } from '@prisma/client';
import { ROLE_ID_USER } from '@src/permissions/roles';
import { Auth } from './auth';

@Injectable()
export class AuthService {
  constructor(
    private datasourceService: DatasourceService,
    private auth: Auth,
    private configService: ConfigService,
  ) {}

  async signup(userSignupDto: UserSignupDto) {
    try {
      // generate the password hash
      const hash = await argon.hash(userSignupDto.password, {
        secret: this.auth.getSecretBufferValue(),
      });
      // save the new user into the db
      const user = await this.datasourceService.user.create({
        data: {
          email: userSignupDto.email,
          password: hash,
          firstName: userSignupDto.firstName,
          lastName: userSignupDto.lastName,
          roleId: ROLE_ID_USER,
          createdById: userSignupDto.createdByUserId,
          updatedById: userSignupDto.updatedByUserId,
        },
        select: {
          email: true,
          firstName: true,
          lastName: true,
        },
      });

      // return the saved user
      return user;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // https://www.prisma.io/docs/orm/reference/error-reference
        if (e.code === 'P2002') {
          throw new ConflictException('The email is already taken.');
        }
      }
      throw e;
    }
  }

  async signin(userSigninDto: UserSigninDto): Promise<TokenInformation> {
    // find the user by email
    const user = await this.getUserByEmail(userSigninDto.email);
    // if the user does not exist, throw an error
    if (!user) {
      throw new ForbiddenException(`User ${userSigninDto.email} is not found.`);
    }

    const pwMatches = await argon.verify(
      user.password,
      userSigninDto.password,
      { secret: this.auth.getSecretBufferValue() },
    );
    if (!pwMatches) {
      throw new ForbiddenException(`User ${userSigninDto.email} is not found.`);
    }
    return await this.generateTokens(user);
  }

  async getTokenByRefreshToken(tokenInformation: TokenInformation) {
    const payload = this.auth.verifyTokenInformation(tokenInformation);
    const user = await this.getUserByEmail(payload.email);
    // if the user does not exist, throw an error
    if (!user) {
      throw new ForbiddenException(`User ${payload.email} is not found.`);
    }
    return await this.generateTokens(user);
  }

  private getUserByEmail(email: string) {
    return this.datasourceService.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        role: {
          select: {
            id: true,
            description: true,
            name: true,
          },
        },
      },
    });
  }

  private async generateTokens(user: UserDto) {
    const accessTokenPromise = this.auth.signToken(user, {
      expiresIn: this.configService.get('ACCESS_JWT_TOKEN_EXPIRES_IN'),
      secret: this.auth.getAuthSecretToken(),
    });

    const refreshTokenPromise = this.auth.signToken(user, {
      expiresIn: this.configService.get('REFRESH_JWT_TOKEN_EXPIRES_IN'),
      secret: this.auth.getRefreshSecretToken(),
    });

    const [accessToken, refreshToken] = await Promise.all([
      accessTokenPromise,
      refreshTokenPromise,
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
