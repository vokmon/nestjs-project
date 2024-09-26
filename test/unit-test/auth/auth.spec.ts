import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Auth } from 'src/auth/auth';

describe('Auth', () => {
  let provider: Auth;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Auth, ConfigService],
    }).compile();

    provider = module.get<Auth>(Auth);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
