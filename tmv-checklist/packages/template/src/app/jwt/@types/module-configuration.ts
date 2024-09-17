import { SignOptions } from 'jsonwebtoken';

export interface IJwtConfiguration {
  publicKey: string;
  accessTokenOptions: SignOptions & { algorithm: 'none' };
}
