import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Auth {
  constructor(private config: ConfigService) {}

  getSecretBufferValue = () => {
    return Buffer.from(this.config.get<string>('AUTH_SECRET'), 'utf-8');
  };
}
