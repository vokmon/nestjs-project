import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { inject } from 'vitest';
import { userWithNormalRole } from './mock/data/users';

describe('Users controller (e2e)', () => {
  let url: string;
  const path = '/users/me';

  beforeAll(() => {
    url = inject('url');
  });

  it('should get current user information successfully', async () => {
    const response = await request(url)
      .get(path)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${inject('accessTokenUser')}`)
      .expect(HttpStatus.OK);

    expect(response.body.user).toEqual(
      expect.objectContaining({
        email: userWithNormalRole.email,
        firstName: userWithNormalRole.firstName,
        lastName: userWithNormalRole.lastName,
        roleId: userWithNormalRole.roleId,
      }),
    );
  });

  it('should update current user information successfully', async () => {
    const toUpdate = { firstName: 'Test', lastName: 'Account' };
    const response = await request(url)
      .patch(path)
      .send(toUpdate)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${inject('accessTokenUser')}`)
      .expect(HttpStatus.OK);

    expect(response.body).toEqual(expect.objectContaining({ ...toUpdate }));
  });
});
