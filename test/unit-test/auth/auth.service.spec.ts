import { Test, TestingModule } from '@nestjs/testing';
import { DatasourceService } from '@src/datasource/datasource.service';
import { AuthService } from 'src/auth/auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, DatasourceService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
