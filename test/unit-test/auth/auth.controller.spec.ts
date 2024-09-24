import { Test, TestingModule } from '@nestjs/testing';
import { vi } from 'vitest';
import { AuthController } from '@src/auth/auth.controller';
import { AuthService } from '@src/auth/auth.service';
import datasourceMockService from '../mock/db/datasource-mock';
import { DatasourceModule } from '@src/datasource/datasource.module';
import { DatasourceService } from '@src/datasource/datasource.service';
import { userWithNormalRole } from '../mock/users';

// 1- mock prisma module
vi.mock('../../mock/db/prisma-mock'); // 1

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
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should signup successfully', async () => {
    const expectedUser = {
      email: userWithNormalRole.email,
      firstName: userWithNormalRole.firstName,
      lastName: userWithNormalRole.lastName,
    };

    datasourceMockService.user.create.mockResolvedValue(expectedUser as any);

    const result = await controller.signup(userWithNormalRole);
    expect(result).toMatchObject(expectedUser);
  });
});
