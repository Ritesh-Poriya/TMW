import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { StorageModuleAsyncOptions } from './@types';
import { STORAGE } from './constants';

@Global()
@Module({})
export class StorageModule {
  static forRootAsync(options: StorageModuleAsyncOptions): DynamicModule {
    return {
      module: StorageModule,
      imports: [...options.imports],
      providers: [StorageModule.createStorageModuleProviders(options)],
      exports: [STORAGE],
    };
  }

  private static createStorageModuleProviders(
    options: StorageModuleAsyncOptions,
  ): Provider {
    return {
      provide: STORAGE,
      useFactory: async (...args) => {
        const storage = await options.useFactory(...args);
        return storage;
      },
      inject: options.inject,
    };
  }
}
