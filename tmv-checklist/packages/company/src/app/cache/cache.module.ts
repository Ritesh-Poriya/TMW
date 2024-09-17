import { DynamicModule, Module, Provider } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { CacheService } from './cache.service';
import {
  CacheModuleAsyncOptions,
  CacheModuleOptions,
  ICacheStorage,
} from './@types';
import { DEFAULT_CACHE_STORAGE } from './constants';

export const defaultCacheStorage: {
  storage?: ICacheStorage;
} = {};

@Module({})
export class CacheModule {
  public static register(options: CacheModuleOptions): DynamicModule {
    return {
      module: CacheModule,
      imports: [DiscoveryModule],
      providers: [
        CacheService,
        CacheModule.registerDefaultStore(options.defaultStorage),
      ],
      exports: [CacheService],
    };
  }

  private static registerDefaultStore(
    storage: ICacheStorage,
  ): Provider<ICacheStorage> {
    defaultCacheStorage.storage = storage;
    return {
      provide: DEFAULT_CACHE_STORAGE,
      useValue: storage,
    };
  }

  public static async registerAsync(
    options: CacheModuleAsyncOptions,
  ): Promise<DynamicModule> {
    return {
      module: CacheModule,
      imports: [DiscoveryModule],
      providers: [CacheService, CacheModule.registerDefaultStoreAsync(options)],
      exports: [CacheService],
    };
  }

  private static registerDefaultStoreAsync(
    options: CacheModuleAsyncOptions,
  ): Provider<ICacheStorage> {
    return {
      provide: DEFAULT_CACHE_STORAGE,
      useFactory: async (...args: any[]) => {
        const storage = await options.useFactory(...args);
        defaultCacheStorage.storage = storage;
        console.log(`Default storage: ${storage.constructor.name}`);
        return storage;
      },
      inject: [...(options.inject || [])],
    };
  }
}
