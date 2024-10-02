import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@src/app.module';
import type { GlobalSetupContext } from 'vitest/node';
import { userWithNormalRole } from '../mock/data/users';

let app: INestApplication;
const TEST_PORT = 5001;
const TEST_HOSTNAME = '0.0.0.0';

export async function setup({ provide }: GlobalSetupContext) {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();

  // Perform signin and get access token
  const adminSigninPromise = signin(
    process.env.INITIAL_ADMIN_USER,
    process.env.INITIAL_ADMIN_PASSWORD,
  );

  const userSigninPromise = signin(
    userWithNormalRole.email,
    userWithNormalRole.password,
  );

  const [adminSigninToken, userSigninToken] = await Promise.all([
    adminSigninPromise,
    userSigninPromise,
  ]);

  await app.listen(TEST_PORT, TEST_HOSTNAME);
  const url = await app.getUrl();
  provide('accessTokenAdmin', adminSigninToken);
  provide('accessTokenUser', userSigninToken);
  provide('url', url);

  return async () => {
    // teardown
    await app.close();
    console.log('Tear down');
  };
}

const signin = async (email: string, password: string): Promise<string> => {
  const response = await request(app.getHttpServer())
    .post('/auth/signin')
    .send({ email, password })
    .expect(200);
  return response.body.access_token;
};

declare module 'vitest' {
  export interface ProvidedContext {
    accessTokenAdmin: string;
    accessTokenUser: string;
    url: string;
  }
}
