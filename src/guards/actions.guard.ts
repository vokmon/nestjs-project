import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ActionPermissions } from '../decorators/actions-permissions.decorator';
import { JwtValidationResultPayload } from '@src/auth/strategy/jwt.dto';
import { ACTION_ALL } from '@src/permissions/actions';

@Injectable()
export class ActionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const actions = this.reflector.get(ActionPermissions, context.getHandler());
    if (!actions) {
      return false;
    }
    const request = context.switchToHttp().getRequest();
    const user: JwtValidationResultPayload = request.user;
    const userActions = user.actions;

    return this.matchRoles(actions, userActions);
  }

  matchRoles(actions: string[], userActions: string[]): boolean {
    if (userActions.includes(ACTION_ALL.name)) return true;
    return actions.some((action) => userActions.includes(action));
  }
}
