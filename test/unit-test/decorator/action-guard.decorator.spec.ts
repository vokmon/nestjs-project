import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ActionPermissions } from '@src/decorators/actions-permissions.decorator';
import { ActionsGuard } from '@src/guards/actions.guard';
import { ACTION_ALL } from '@src/permissions/actions';
import { vi } from 'vitest';

describe('Action Decorator', () => {
  it('should set metadata on a class', () => {
    @ActionPermissions(['read', 'write'])
    class TestClass {}

    const actions = Reflect.getMetadata(ActionPermissions.KEY, TestClass);
    expect(actions).toEqual(['read', 'write']);
  });

  it('should set metadata on a method', () => {
    class TestClass {
      @ActionPermissions(['update', 'delete'])
      testMethod() {}
    }

    const actions = Reflect.getMetadata(
      ActionPermissions.KEY,
      TestClass.prototype.testMethod,
    );
    expect(actions).toEqual(['update', 'delete']);
  });

  it('should return undefined if no metadata is set', () => {
    class TestClass {
      testMethod() {}
    }

    const actions = Reflect.getMetadata(
      ActionPermissions.KEY,
      TestClass.prototype.testMethod,
    );
    expect(actions).toBeUndefined();
  });

  it('should allow empty array as input', () => {
    @ActionPermissions([])
    class TestClass {}

    const actions = Reflect.getMetadata(ActionPermissions.KEY, TestClass);
    expect(actions).toEqual([]);
  });

  it('should not overwrite metadata when decorator is used multiple times', () => {
    @ActionPermissions(['read'])
    @ActionPermissions(['write'])
    class TestClass {}

    const actions = Reflect.getMetadata(ActionPermissions.KEY, TestClass);
    expect(actions).toEqual(['read']);
  });
});

describe('Action Guard', () => {
  let guard: ActionsGuard;
  let reflector: Reflector;
  let mockExecutionContext: ExecutionContext;

  beforeEach(() => {
    reflector = {
      get: vi.fn(),
    } as any;

    guard = new ActionsGuard(reflector);

    mockExecutionContext = {
      getHandler: vi.fn(),
      switchToHttp: vi.fn().mockReturnValue({
        getRequest: vi.fn().mockReturnValue({
          user: {
            actions: [],
          },
        }),
      }),
    } as any;
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return false if no actions are defined', () => {
    vi.spyOn(reflector, 'get').mockReturnValue(undefined);
    expect(guard.canActivate(mockExecutionContext)).toBe(false);
  });

  it('should return true if user has ACTION_ALL', () => {
    vi.spyOn(reflector, 'get').mockReturnValue(['read']);
    mockExecutionContext.switchToHttp().getRequest().user.actions = [
      ACTION_ALL.name,
    ];
    expect(guard.canActivate(mockExecutionContext)).toBe(true);
  });

  it('should return true if user has required action', () => {
    vi.spyOn(reflector, 'get').mockReturnValue(['read']);
    mockExecutionContext.switchToHttp().getRequest().user.actions = ['read'];
    expect(guard.canActivate(mockExecutionContext)).toBe(true);
  });

  it('should return false if user does not have required action', () => {
    vi.spyOn(reflector, 'get').mockReturnValue(['write']);
    mockExecutionContext.switchToHttp().getRequest().user.actions = ['read'];
    expect(guard.canActivate(mockExecutionContext)).toBe(false);
  });

  it('should return true if user has at least one of the required actions', () => {
    vi.spyOn(reflector, 'get').mockReturnValue(['read', 'write']);
    mockExecutionContext.switchToHttp().getRequest().user.actions = ['write'];
    expect(guard.canActivate(mockExecutionContext)).toBe(true);
  });
});
