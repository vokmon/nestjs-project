import { Test, TestingModule } from '@nestjs/testing';
import { expect, vi } from 'vitest';
import * as argon from 'argon2';
import { AuthController } from '@src/auth/auth.controller';
import datasourceMockService from '../mock/db/datasource-mock';
import { DatasourceModule } from '@src/datasource/datasource.module';
import { DatasourceService } from '@src/datasource/datasource.service';
import { userWithNormalRole } from '../mock/users';
import { Prisma } from '@prisma/client';
import { Auth } from '@src/auth/auth';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@src/auth/auth.service';
import { normalUserActions } from '../mock/actions';

// 1- mock prisma module
vi.mock('../../mock/db/prisma-mock');

const argonMock = vi.hoisted(() => {
  return {
    verify: vi.fn(),
    hash: vi.fn(),
  };
});

vi.mock('argon2', () => {
  return {
    hash: argonMock.hash,
    verify: argonMock.verify,
  };
});

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    vi.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [DatasourceModule],
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: DatasourceService,
          useValue: datasourceMockService,
        },
        Auth,
        ConfigService,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should signup successfully', async () => {
    const expectedUser = {
      ...userWithNormalRole,
    };

    datasourceMockService.user.create.mockResolvedValue(expectedUser as any);

    const result = await controller.signup(userWithNormalRole);
    expect(result).toMatchObject(expectedUser);
  });

  it('should signup failed because the email is already taken', async () => {
    datasourceMockService.user.create.mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError('Duplicated unique value', {
        code: 'P2002',
        clientVersion: '1',
      }),
    );

    expect(async () => {
      await controller.signup(userWithNormalRole);
    }).rejects.toThrowError(`The email is already taken.`);
  });

  it('should signin successfully', async () => {
    vi.spyOn(argon, 'verify').mockResolvedValueOnce(true);

    const expectedUser = {
      email: userWithNormalRole.email,
      password: userWithNormalRole.password,
      firstName: userWithNormalRole.firstName,
      lastName: userWithNormalRole.lastName,
      role: userWithNormalRole.role,
    };

    datasourceMockService.user.findUnique.mockResolvedValueOnce(
      expectedUser as any,
    );

    datasourceMockService.action.findMany.mockResolvedValueOnce(
      normalUserActions as any,
    );
    const result = await controller.signin(userWithNormalRole);
    expect(result).toMatchObject(expectedUser);
  });

  it('should signin failed because user is invalid', async () => {
    vi.spyOn(argon, 'verify').mockResolvedValueOnce(true);

    datasourceMockService.user.findUnique.mockResolvedValue(null);

    expect(async () => {
      await controller.signin(userWithNormalRole);
    }).rejects.toThrowError(`User ${userWithNormalRole.email} is not found.`);
  });

  it('should signin failed because password is not matched', async () => {
    vi.spyOn(argon, 'verify').mockResolvedValueOnce(false);

    const expectedUser = {
      email: userWithNormalRole.email,
      password: userWithNormalRole.password,
      firstName: userWithNormalRole.firstName,
      lastName: userWithNormalRole.lastName,
    };

    datasourceMockService.user.findUnique.mockResolvedValue(
      expectedUser as any,
    );

    expect(async () => {
      await controller.signin(userWithNormalRole);
    }).rejects.toThrowError(`User ${userWithNormalRole.email} is not found.`);
  });
});
