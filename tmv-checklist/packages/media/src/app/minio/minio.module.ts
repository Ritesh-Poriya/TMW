import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { MinIOModuleAsyncOptions } from './@types';
import { MINIO_CLIENT, MINIO_OPTIONS_PROVIDER } from './constants';
import * as Minio from 'minio';

@Global()
@Module({})
export class MinIOModule {
  static forRootAsync(options: MinIOModuleAsyncOptions): DynamicModule {
    return {
      module: MinIOModule,
      providers: [
        MinIOModule.minioOptionsProvider(options),
        MinIOModule.minioClientProvider(),
      ],
      exports: [MINIO_CLIENT],
    };
  }

  private static minioOptionsProvider(
    options: MinIOModuleAsyncOptions,
  ): Provider {
    return {
      provide: MINIO_OPTIONS_PROVIDER,
      useFactory: options.useFactory,
      inject: options.inject,
    };
  }

  private static minioClientProvider(): Provider {
    return {
      provide: MINIO_CLIENT,
      useFactory: (options: Minio.ClientOptions) => new Minio.Client(options),
      inject: [MINIO_OPTIONS_PROVIDER],
    };
  }
}
