import request from 'supertest';
import { inject } from 'vitest';

describe('AppController (e2e)', () => {
  it('/ (GET)', () => {
    return request(inject('url'))
      .get('/')
      .expect(200)
      .expect('The server is running.');
  });
});
