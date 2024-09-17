import { BlockingOptions } from '../blocking/@types';

export const blockingConfig = () => {
  return {
    blockingConfig: {
      enableBlocking: process.env.ENABLE_BLOCKING !== 'false',
      wrongCredentialsLimit: +process.env.WRONG_CREDENTIALS_LIMIT || 5,
      wrongCredentialsWindowInMinutes:
        +process.env.WRONG_CREDENTIALS_WINDOW_IN_MINUTES || 60,
      wrongCredentialsBlockDurationInMinutes:
        +process.env.WRONG_CREDENTIALS_BLOCK_DURATION_IN_MINUTES || 120,
    } as BlockingOptions,
  };
};
