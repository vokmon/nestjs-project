import { vi, expect } from 'vitest';
import datasourceMockService from '../mock/db/datasource-mock';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from '@src/auth/strategy';
import { mockDeep, mockReset } from 'vitest-mock-extended';
import { userWithNormalRole } from '../mock/users';
import { normalUserActions } from '../mock/actions';
import { AuthPayload } from '@src/auth/auth.dto';
import { JwtResultPayload } from '@src/auth/strategy/jwt.dto';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  const configMockService = mockDeep<ConfigService>();

  beforeAll(async () => {
    configMockService.get.mockResolvedValueOnce('test_secret');
    jwtStrategy = new JwtStrategy(configMockService, datasourceMockService);
  });

  beforeEach(async () => {
    vi.restoreAllMocks();
    mockReset(datasourceMockService);
    mockReset(configMockService);
  });
  it('should validate user successfully', async () => {
    datasourceMockService.user.findUnique.mockResolvedValueOnce(
      userWithNormalRole as any,
    );

    datasourceMockService.action.findMany.mockResolvedValueOnce(
      normalUserActions as any,
    );

    const payload: AuthPayload = {
      sub: userWithNormalRole.id,
      email: userWithNormalRole.email,
      name: userWithNormalRole.firstName,
      family_name: userWithNormalRole.lastName,
      role: userWithNormalRole.role.id,
    };

    const result = (await jwtStrategy.validate(payload)) as JwtResultPayload;
    expect(result.user).toBeDefined();
    expect(result.actions).toBeDefined();
    expect(result.actions).toHaveLength(2);
  });

  it('should validate user successfully with no actions', async () => {
    datasourceMockService.user.findUnique.mockResolvedValueOnce(
      userWithNormalRole as any,
    );

    const payload: AuthPayload = {
      sub: userWithNormalRole.id,
      email: userWithNormalRole.email,
      name: userWithNormalRole.firstName,
      family_name: userWithNormalRole.lastName,
      role: userWithNormalRole.role.id,
    };

    const result = (await jwtStrategy.validate(payload)) as JwtResultPayload;
    expect(result.user).toBeDefined();
    expect(result.actions).toBeDefined();
  });

  it('should validate user failed because the user is invalid', async () => {
    datasourceMockService.user.findUnique.mockResolvedValueOnce(null);

    const payload: AuthPayload = {
      sub: userWithNormalRole.id,
      email: userWithNormalRole.email,
      name: userWithNormalRole.firstName,
      family_name: userWithNormalRole.lastName,
      role: userWithNormalRole.role.id,
    };

    expect(async () => {
      await jwtStrategy.validate(payload);
    }).rejects.toThrowError(`Invalid user ${userWithNormalRole.email}`);
  });
});
