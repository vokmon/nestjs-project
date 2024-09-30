import { GetUser } from '@src/decorators';
import { userWithNormalRole } from '../mock/users';
import { normalUserActions } from '../mock/actions';
import { expect, vi } from 'vitest';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';

describe('Get User Decorator', () => {
  const user = {
    user: userWithNormalRole,
    actions: normalUserActions.map((action) => action.name),
  };

  it('should get information from jwt successfully', () => {
    const factory = getParamDecoratorFactory(GetUser);
    const switchToHttpMock = vi.fn().mockReturnValue({
      getRequest: vi.fn().mockReturnValue({ user }),
    });
    const result = factory(null, {
      switchToHttp: switchToHttpMock,
    });

    expect(result).toMatchObject(user);
  });

  it('should get information from jwt successfully with the specific attribute', () => {
    const factory = getParamDecoratorFactory(GetUser);
    const switchToHttpMock = vi.fn().mockReturnValue({
      getRequest: vi.fn().mockReturnValue({ user }),
    });
    const result = factory('user', {
      switchToHttp: switchToHttpMock,
    });

    expect(result).toMatchObject(user.user);
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  function getParamDecoratorFactory(decorator: Function) {
    class Test {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      public test(@decorator() value) {}
    }

    const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, 'test');
    return args[Object.keys(args)[0]].factory;
  }
});
