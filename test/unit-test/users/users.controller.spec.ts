import { expect, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { DatasourceModule } from '@src/datasource/datasource.module';
import { UsersController } from '@src/users/users.controller';
import { UsersService } from '@src/users/users.service';
import { userWithNormalRole } from '../mock/users';
import { normalUserActions } from '../mock/actions';
import { DatasourceService } from '@src/datasource/datasource.service';
import datasourceMockService from '../mock/db/datasource-mock';

describe('UsersController', () => {
  let controller: UsersController;
  const user = {
    user: userWithNormalRole,
    actions: normalUserActions.map((action) => action.name),
  };
  beforeAll(async () => {
    vi.restoreAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatasourceModule],
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: DatasourceService,
          useValue: datasourceMockService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should get information from jwt successfully', () => {
    const result = controller.getMe(user);
    expect(result).toBeDefined();
  });

  it('should update user information successfully', async () => {
    const result = await controller.updateUser(user, {
      email: 'user11@test.com',
      firstName: 'Test',
      lastName: 'Account',
    });

    expect(datasourceMockService.user.update).toHaveBeenCalledOnce();
  });

  it('should get data with permission successfully', async () => {
    const result = await controller.getDataWithPermission();
    expect(result).toEqual('Success!');
  });
});
