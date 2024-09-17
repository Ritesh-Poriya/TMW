import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { IJwtConfiguration } from '../jwt/@types';

export const jwtConfig = async () => {
  let publicKey = '';
  if (!process.env.AUTH_PUBLIC_KEY) {
    if (!process.env.AUTH_PUBLIC_KEY_PATH) {
      throw new Error('PUBLIC_KEY_PATH environment variable is not defined.');
    } else {
      publicKey = fs.readFileSync(process.env.AUTH_PUBLIC_KEY_PATH, 'utf8');
    }
  }

  return {
    jwtConfig: new ConfigService({
      publicKey: process.env.AUTH_PUBLIC_KEY || publicKey,
      accessTokenOptions: {
        issuer: process.env.AUTH_ACCESS_TOKEN_ISSUER,
      },
    } as IJwtConfiguration),
  };
};
