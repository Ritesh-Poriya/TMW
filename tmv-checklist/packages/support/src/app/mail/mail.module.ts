import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import {
  FROM_MAIL,
  MAIL_MODULE_OPTIONS,
  TRANSPORTER_CONFIG,
} from './constants';
import { MailModuleAsyncOptions, MailModuleOptions } from './@types';
import { EJSModule } from '../ejs/ejs.module';
import { MailTransporter } from './mail-transporter';
import { EmailService } from './email.service';

@Global()
@Module({})
export class MailModule {
  public static forRootAsync(
    asyncOptions: MailModuleAsyncOptions,
  ): DynamicModule {
    const { ejsAsyncOptions } = asyncOptions;
    const imports = [];
    if (ejsAsyncOptions) {
      imports.push(EJSModule.forFeatureAsync(ejsAsyncOptions));
    }
    return {
      module: MailModule,
      imports: imports,
      providers: [
        MailModule.createAsyncOptionsProvider(asyncOptions),
        MailModule.createAsyncTransportConfigProvider(),
        MailModule.createFromMailProvider(),
        MailTransporter,
        EmailService,
      ],
      exports: [EmailService],
    };
  }

  private static createAsyncOptionsProvider(
    asyncOptions: MailModuleAsyncOptions,
  ): Provider {
    return {
      provide: MAIL_MODULE_OPTIONS,
      useFactory: async (...args: any[]) => {
        const options = await asyncOptions.useFactory(...args);
        return options;
      },
      inject: asyncOptions.inject || [],
    };
  }

  private static createAsyncTransportConfigProvider(): Provider {
    return {
      provide: TRANSPORTER_CONFIG,
      useFactory: async (options: MailModuleOptions) => {
        return options.transportConfig;
      },
      inject: [MAIL_MODULE_OPTIONS],
    };
  }

  private static createFromMailProvider(): Provider {
    return {
      provide: FROM_MAIL,
      useFactory: async (options: MailModuleOptions) => {
        return options.fromMail;
      },
      inject: [MAIL_MODULE_OPTIONS],
    };
  }
}
