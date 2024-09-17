import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import {
  NatsModuleAsyncOptions,
  NatsModuleOptions,
} from './@types/module-options';
import { NATS_CLIENT, NATS_MODULE_OPTIONS } from './constants';
import { natsWrapper } from './nats-wrapper';

@Global()
@Module({})
export class NATSModule {
  static forRootAsync(asyncOptions: NatsModuleAsyncOptions): DynamicModule {
    return {
      module: NATSModule,
      imports: asyncOptions.imports || [],
      providers: [
        NATSModule.createAsyncOptionsProvider(asyncOptions),
        NATSModule.createNatsClientProvider(),
      ],
      exports: [NATS_CLIENT],
    };
  }

  private static createAsyncOptionsProvider(
    asyncOptions: NatsModuleAsyncOptions,
  ): Provider {
    return {
      provide: NATS_MODULE_OPTIONS,
      useFactory: async (...args: any[]) => {
        const options = await asyncOptions.useFactory(...args);
        return options;
      },
      inject: asyncOptions.inject || [],
    };
  }

  private static createNatsClientProvider(): Provider {
    return {
      provide: NATS_CLIENT,
      useFactory: async (options: NatsModuleOptions) => {
        await natsWrapper.connect(
          options.clusterId,
          options.clientId,
          options.url,
        );

        natsWrapper.client.on('close', () => {
          console.log('NATS connection is closed!');
          process.exit();
        });

        return natsWrapper.client;
      },
      inject: [NATS_MODULE_OPTIONS],
    };
  }
}
