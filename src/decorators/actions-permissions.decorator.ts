import { Reflector } from '@nestjs/core';

export const ActionPermissions = Reflector.createDecorator<string[]>();
