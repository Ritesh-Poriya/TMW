import { IReCaptchaEnterpriseConfig } from '../captcha/@types';

export const captchaConfig = () => {
  if (!process.env.GCP_PROJECT_ID) {
    throw new Error('GCP_PROJECT_ID environment variable is not defined.');
  }
  if (!process.env.CAPTCHA_KEY) {
    throw new Error('CAPTCHA_KEY environment variable is not defined.');
  }
  if (
    !Number(process.env.CAPTCHA_ACCEPTABLE_SCORE) &&
    Number(process.env.CAPTCHA_ACCEPTABLE_SCORE) > 0 &&
    Number(process.env.CAPTCHA_ACCEPTABLE_SCORE) < 1
  ) {
    throw new Error(
      'CAPTCHA_ACCEPTABLE_SCORE environment variable is not defined or is not valid score',
    );
  }
  if (!process.env.SERVICE_ACCOUNT_PATH) {
    throw new Error(
      'SERVICE_ACCOUNT_PATH environment variable is not defined.',
    );
  }
  return {
    captchaConfig: {
      projectID: process.env.GCP_PROJECT_ID,
      recaptchaKey: process.env.CAPTCHA_KEY,
      acceptableScoreValue: Number(process.env.CAPTCHA_ACCEPTABLE_SCORE),
      serviceAccountPath: process.env.SERVICE_ACCOUNT_PATH,
    } as IReCaptchaEnterpriseConfig,
  };
};
