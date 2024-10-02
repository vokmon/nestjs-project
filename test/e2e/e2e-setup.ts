import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@src/app.module';
import type { GlobalSetupContext } from 'vitest/node';

let app: INestApplication;
let accessTokenAdmin: string;

const TEST_PORT = 5001;
const TEST_HOSTNAME = '0.0.0.0';

export async function setup({ provide }: GlobalSetupContext) {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();

  // Perform signin and get access token
  const response = await request(app.getHttpServer())
    .post('/auth/signin')
    .send({ email: 'admin@system.com', password: 'test_admin' })
    .expect(200);

  accessTokenAdmin = response.body.access_token;

  await app.listen(TEST_PORT, TEST_HOSTNAME);
  const url = await app.getUrl();
  provide('accessTokenAdmin', accessTokenAdmin);
  provide('url', url);

  return async () => {
    // teardown
    await app.close();
    console.log('Tear down');
  };
}

declare module 'vitest' {
  export interface ProvidedContext {
    accessTokenAdmin: string;
    url: string;
  }
}
