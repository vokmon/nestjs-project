import { ConflictException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { DatasourceService } from '../datasource/datasource.service';
import { UserSigninDto, UserSignupDto } from './auth.dto';
import { Prisma } from '@prisma/client';

const DEFAULT_ROLE = 2; // user role
@Injectable()
export class AuthService {
  constructor(private datasourceService: DatasourceService) {}

  async signup(userSignupDto: UserSignupDto) {
    try {
      // generate the password hash
      const hash = await argon.hash(userSignupDto.password, {
        secret: Buffer.from(process.env.AUTH_SECRET, 'utf-8'),
      });
      // save the new user into the db
      const user = await this.datasourceService.user.create({
        data: {
          email: userSignupDto.email,
          password: hash,
          firstName: userSignupDto.firstName,
          lastName: userSignupDto.lastName,
          roleId: DEFAULT_ROLE,
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

  signin(userSigninDto: UserSigninDto) {
    console.log(userSigninDto);
    return { message: 'I am signed in' };
  }
}
