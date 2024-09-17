import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { GcpBucketModuleAsyncOptions, GcpBucketOptions } from './@types';
import { GCP_BUCKET_OPTIONS, GCP_STORAGE_CLIENT } from './constants';
import { Storage as GCPBucketStorage } from '@google-cloud/storage';

@Global()
@Module({})
export class GcpBucketModule {
  static forRootAsync(options: GcpBucketModuleAsyncOptions): DynamicModule {
    return {
      module: GcpBucketModule,
      providers: [
        GcpBucketModule.createAsyncOptionsProvider(options),
        GcpBucketModule.createClientProvider(),
      ],
      exports: [GCP_STORAGE_CLIENT],
    };
  }

  static createAsyncOptionsProvider(
    options: GcpBucketModuleAsyncOptions,
  ): Provider {
    return {
      provide: GCP_BUCKET_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };
  }

  static createClientProvider(): Provider {
    return {
      provide: GCP_STORAGE_CLIENT,
      useFactory: (options: GcpBucketOptions) => new GCPBucketStorage(options),
      inject: [GCP_BUCKET_OPTIONS],
    };
  }
}
