import { Injectable } from '@nestjs/common';
import { DatasourceService } from '@src/datasource/datasource.service';

@Injectable()
export class AuthService {
  constructor(private datasource: DatasourceService) {}

  signup() {
    return { message: 'I am signed up' };
  }

  signin() {
    return { message: 'I am signed in' };
  }
}
