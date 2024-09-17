import { Logger, Module, ValidationPipe } from '@nestjs/common';
import { DbModule } from './db/db.module';
import {
  authConfig,
  natsConfig,
  postgresConfig,
  redisConfig,
  usersServiceConfig,
} from './config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';
import { BootStrapModule } from './bootstrap/bootstrap.module';
import { RestModule } from './rest/rest.module';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AuthGuard } from './auth/guards';
import { LoggingInterceptor } from './logger/logging.interceptor';
import { HttpModule as HttpClientModule } from '@nestjs/axios';
import { NATSModule } from './nats/nats.module';
import { CacheModule } from './cache/cache.module';
import { UsersModule } from './users/users.module';
import { RedisModule } from './redis/redis.module';
import { RedisService } from './redis/redis.service';
import { CacheStorageFactory } from './cache/cache-storage.factory';

const envFilePath = path.resolve(__dirname, '../../../../.env');

@Module({
  imports: [
    DbModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('postgresConfig'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'local' ? envFilePath : undefined,
      load: [
        postgresConfig,
        authConfig,
        natsConfig,
        usersServiceConfig,
        redisConfig,
      ],
    }),
    NATSModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('natsConfig'),
    }),
    BootStrapModule,
    HttpClientModule,
    BootStrapModule,
    RestModule,
    UsersModule,
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('redisConfig'),
    }),
    CacheModule.registerAsync({
      useFactory: (redisService: RedisService) => {
        console.log('redisService.getClient', redisService.getClient);
        return CacheStorageFactory.createRedisStore(redisService.getClient());
      },
      inject: [RedisService],
    }),
  ],
  controllers: [],
  providers: [
    Logger,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
      }),
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
