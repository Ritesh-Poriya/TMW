import { Module } from '@nestjs/common';
import { IReCaptchaEnterpriseConfig } from './@types';
import { RE_CAPTCHA_ENTERPRISE_CONFIG } from './constants';
import { CaptchaService } from './captcha.service';

@Module({})
export class CaptchaModule {
  static forRoot(asyncOptions: {
    inject: any[];
    useFactory: (
      ...args: any[]
    ) => Promise<IReCaptchaEnterpriseConfig> | IReCaptchaEnterpriseConfig;
  }) {
    const { useFactory } = asyncOptions;
    return {
      module: CaptchaModule,
      providers: [
        {
          provide: RE_CAPTCHA_ENTERPRISE_CONFIG,
          useFactory: useFactory,
          inject: asyncOptions.inject,
        },
        CaptchaService,
      ],
      exports: [CaptchaService],
    };
  }
}
