import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { inject } from 'vitest';

const users = ['01', '02'].map((index: string) => ({
  email: `user_${new Date().getTime()}_${index}@test.com`,
  password: 'test123',
  firstName: 'Test',
  lastName: 'Account',
}));
const [user, user2] = users;

describe('Authentication signup workflow (e2e)', () => {
  let url: string;
  const path = '/auth/signup';

  beforeAll(() => {
    url = inject('url');
  });

  it('should signup succcessfully', async () => {
    const response = await request(url)
      .post(path)
      .send(user)
      .set('Accept', 'application/json')
      .expect(HttpStatus.CREATED)
      .expect({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    expect(response.body).toMatchObject({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  });

  it('should signup succcessfully with only username and password', async () => {
    const response = await request(url)
      .post(path)
      .send({
        email: user2.email,
        password: user2.password,
      })
      .set('Accept', 'application/json')
      .expect(HttpStatus.CREATED);

    expect(response.body).toMatchObject({
      email: user2.email,
    });
  });

  it('should signup failed because the email is already taken', async () => {
    const response = await request(url)
      .post(path)
      .send(user)
      .set('Accept', 'application/json')
      .expect(HttpStatus.CONFLICT);
    expect(response.body).toMatchObject({
      message: 'The email is already taken.',
      error: 'Conflict',
      statusCode: HttpStatus.CONFLICT,
    });
  });

  it('should signup failed because the email and password are not defined', async () => {
    const response = await request(url)
      .post(path)
      .send({})
      .set('Accept', 'application/json')
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toMatchObject({
      message: 'Validation failed',
      errors: [
        {
          field: 'email',
          message: 'Required',
        },
        {
          field: 'password',
          message: 'Required',
        },
      ],
    });
  });
});

describe('Authentication signin workflow (e2e)', () => {
  let url: string;
  const path = '/auth/signin';

  beforeAll(() => {
    url = inject('url');
  });

  it('should signin succcessfully', async () => {
    const response = await request(url)
      .post(path)
      .send({
        email: user.email,
        password: user.password,
      })
      .set('Accept', 'application/json')
      .expect(HttpStatus.OK);

    expect(response.body.access_token).toBeDefined();
    expect(response.body.refresh_token).toBeDefined();
  });

  it('should signin failed because the email and password are not defined', async () => {
    const response = await request(url)
      .post(path)
      .send({})
      .set('Accept', 'application/json')
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toMatchObject({
      message: 'Validation failed',
      errors: [
        {
          field: 'email',
          message: 'Required',
        },
        {
          field: 'password',
          message: 'Required',
        },
      ],
    });
  });

  it('should signin with refresh token succcessfully', async () => {
    const response = await request(url)
      .post(path)
      .send({
        email: user.email,
        password: user.password,
      })
      .set('Accept', 'application/json')
      .expect(HttpStatus.OK);

    const payload = {
      access_token: response.body.access_token,
      refresh_token: response.body.refresh_token,
    };

    const refreshTokenResponse = await request(url)
      .post('/auth/get-token')
      .send(payload)
      .set('Accept', 'application/json')
      .expect(HttpStatus.OK);
    expect(refreshTokenResponse.body.access_token).toBeDefined();
    expect(refreshTokenResponse.body.refresh_token).toBeDefined();
  });
});
