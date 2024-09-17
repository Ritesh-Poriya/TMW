import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { RedisModuleAsyncOptions, RedisModuleOptions } from './@types';
import { REDIS_CLIENT, REDIS_OPTIONS } from './constants';
import { Redis } from 'ioredis';
import { RedisService } from './redis.service';
import { RedisHealthIndicator } from './redis-health.indicator';

@Global()
@Module({})
export class RedisModule {
  static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
    return {
      module: RedisModule,
      providers: [
        RedisModule.createAsyncOptionsProviders(options),
        RedisModule.createAsyncClientProvider(),
        RedisService,
        RedisHealthIndicator,
      ],
      exports: [RedisService, RedisHealthIndicator],
    };
  }

  private static createAsyncOptionsProviders(
    options: RedisModuleAsyncOptions,
  ): Provider {
    return {
      provide: REDIS_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };
  }

  private static createAsyncClientProvider(): Provider {
    return {
      provide: REDIS_CLIENT,
      useFactory: async (options: RedisModuleOptions) => {
        const redis = new Redis(options);
        return redis;
      },
      inject: [REDIS_OPTIONS],
    };
  }
}
