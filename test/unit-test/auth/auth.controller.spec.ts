import { Test, TestingModule } from '@nestjs/testing';
import { expect, vi } from 'vitest';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { DatasourceModule } from '@src/datasource/datasource.module';
import { AuthController } from '@src/auth/auth.controller';
import { DatasourceService } from '@src/datasource/datasource.service';
import { userWithNormalRole } from '../mock/users';
import { Prisma } from '@prisma/client';
import { Auth } from '@src/auth/auth';
import { AuthService } from '@src/auth/auth.service';
import datasourceMockService from '../mock/db/datasource-mock';

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
        JwtService,
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

  it('should signup failed because an error occurs', async () => {
    datasourceMockService.user.create.mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError('Error', {
        code: 'P2003',
        clientVersion: '1',
      }),
    );

    expect(async () => {
      await controller.signup(userWithNormalRole);
    }).rejects.toThrowError(`Error`);
  });

  it('should signin successfully', async () => {
    vi.spyOn(argon, 'verify').mockResolvedValueOnce(true);

    datasourceMockService.user.findUnique.mockResolvedValueOnce(
      userWithNormalRole as any,
    );

    const result = await controller.signin(userWithNormalRole);
    expect(result.access_token).toBeDefined();
    expect(result.refresh_token).toBeDefined();
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

  const signInWithNormalUser = async () => {
    vi.spyOn(argon, 'verify').mockResolvedValueOnce(true);

    datasourceMockService.user.findUnique.mockResolvedValueOnce(
      userWithNormalRole as any,
    );

    return controller.signin(userWithNormalRole);
  };
  it('should get new token with refresh token successfully', async () => {
    const signInTokens = await signInWithNormalUser();
    datasourceMockService.user.findUnique.mockResolvedValueOnce(
      userWithNormalRole as any,
    );
    const result = await controller.getTokenByRefreshToken(signInTokens);
    expect(result.access_token).toBeDefined();
    expect(result.refresh_token).toBeDefined();
  });

  it('should get new token with refresh token failed because user is invalid', async () => {
    const signInTokens = await signInWithNormalUser();

    expect(async () => {
      await controller.getTokenByRefreshToken(signInTokens);
    }).rejects.toThrowError(`User ${userWithNormalRole.email} is not found.`);
  });

  it('should get new token with refresh token failed because access token is invalid', async () => {
    expect(async () => {
      await controller.getTokenByRefreshToken({
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxeyJzdWIiOiIwNjFjNWU2My05ZDJkLTQ2MTctYTJiMC0zMzUzNWRmYWJhMjYiLCJlbWFpbCI6InVzZXIxQHRlc3QuY29tIiwibmFtZSI6IlRlc3QiLCJmYW1pbHlfbmFtZSI6IkFjY291bnQiLCJyb2xlIjoiMiIsImlhdCI6MTcyNzQ5NTY2MCwiZXhwIjoxNzI3NDk2NTYwfQ.jGN148W0dh5wdPMGGukhNHqIduP72UWocJecVjC7tYQ',
        refresh_token: 'refresh_token',
      });
    }).rejects.toThrowError(`Invalid access token`);
  });

  it('should get new token with refresh token failed because refresh token is invalid', async () => {
    expect(async () => {
      await controller.getTokenByRefreshToken({
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwNjFjNWU2My05ZDJkLTQ2MTctYTJiMC0zMzUzNWRmYWJhMjYiLCJlbWFpbCI6InVzZXIxQHRlc3QuY29tIiwibmFtZSI6IlRlc3QiLCJmYW1pbHlfbmFtZSI6IkFjY291bnQiLCJyb2xlIjoiMiIsImlhdCI6MTcyNzQ5NTY2MCwiZXhwIjoxNzI3NDk2NTYwfQ.jGN148W0dh5wdPMGGukhNHqIduP72UWocJecVjC7tYQ',
        refresh_token: 'refresh_token',
      });
    }).rejects.toThrowError(`Invalid refresh token`);
  });
});
