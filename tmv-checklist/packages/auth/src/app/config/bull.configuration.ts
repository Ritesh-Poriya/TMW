import { BullRootModuleOptions } from '@nestjs/bull';

export const bullConfig = () => {
  if (!process.env.REDIS_HOST) {
    throw new Error('REDIS_HOST environment variable is not defined.');
  }
  if (!Number(process.env.REDIS_PORT)) {
    throw new Error(
      'REDIS_PORT environment variable is not defined or is not valid.',
    );
  }
  if (!process.env.REDIS_PASSWORD) {
    throw new Error('REDIS_PASSWORD environment variable is not defined.');
  }
  if (!Number(process.env.REDIS_BULL_DB)) {
    throw new Error(
      'REDIS_BULL_DB environment variable is not defined or is not valid.',
    );
  }
  return {
    bullConfig: {
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
        db: Number(process.env.REDIS_BULL_DB),
      },
    } as BullRootModuleOptions,
  };
};
