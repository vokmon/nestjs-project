import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as argon from 'argon2';
import { DatasourceService } from '../datasource/datasource.service';
import { UserSigninDto, UserSignupDto } from './auth.dto';
import { Prisma } from '@prisma/client';
import { ROLE_ID_USER } from '../permissions/roles';
import { Auth } from './auth';

@Injectable()
export class AuthService {
  constructor(
    private datasourceService: DatasourceService,
    private auth: Auth,
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

  async signin(userSigninDto: UserSigninDto) {
    // find the user by email
    const user = await this.datasourceService.user.findUnique({
      where: {
        email: userSigninDto.email,
      },
      select: {
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        role: {
          select: {
            description: true,
            name: true,
            actionsIds: true,
            actions: true,
          },
        },
      },
    });

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

    delete user.password;

    const actions = await this.datasourceService.action.findMany({
      where: {
        id: {
          in: user.role.actionsIds,
        },
      },
    });
    user.role.actions = actions;

    return user;
  }
}
