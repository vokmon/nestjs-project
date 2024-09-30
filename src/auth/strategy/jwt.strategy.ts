import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { DatasourceService } from '@src/datasource/datasource.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthPayload } from '../auth.dto';
import { JwtValidationResultPayload } from './jwt.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private datasourceService: DatasourceService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('ACCESS_JWT_TOKEN_SECRET'),
    });
  }

  async validate(payload: AuthPayload): Promise<JwtValidationResultPayload> {
    // This data will be passed into the request object
    const user = await this.datasourceService.user.findUnique({
      where: {
        id: payload.sub,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        roleId: true,
        role: {
          select: {
            id: true,
            name: true,
            description: true,
            actionsIds: true,
          },
        },
      },
    });

    if (!user) {
      throw new ConflictException(`Invalid user ${payload.email}`);
    }

    const { actionsIds } = user.role;
    const actions = await this.datasourceService.action.findMany({
      select: {
        name: true,
      },
      where: {
        id: {
          in: actionsIds,
        },
      },
    });

    const actionNames = (actions || []).map((action) => action.name);
    return {
      user,
      actions: actionNames,
    };
  }
}
