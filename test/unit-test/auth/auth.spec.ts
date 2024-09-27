import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Auth } from 'src/auth/auth';

describe('Auth', () => {
  let provider: Auth;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Auth, ConfigService, JwtService],
    }).compile();

    provider = module.get<Auth>(Auth);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
