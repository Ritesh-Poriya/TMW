import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';
import { gcpConfiguration } from './config';
import { StorageModule } from './storage/storage.module';
import { StorageFactory } from './storage/storage.factory';
import { HttpModule } from './http/http.module';
import { GcpBucketModule } from './gcp-bucket/gcp-bucket.module';
import { GCP_STORAGE_CLIENT } from './gcp-bucket/constants';
import { Storage as GCPStorageClient } from '@google-cloud/storage';
import { LoggingInterceptor } from './logger/logging.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

const envFilePath = path.resolve(__dirname, '../../../../.env');
console.log(envFilePath);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'local' ? envFilePath : undefined,
      load: [gcpConfiguration],
    }),
    StorageModule.forRootAsync({
      imports: [GcpBucketModule],
      useFactory: (
        gcpStorageClient: GCPStorageClient,
        configService: ConfigService,
      ) =>
        StorageFactory.gcpStorage(
          gcpStorageClient,
          configService.get('bucketName'),
        ),
      inject: [GCP_STORAGE_CLIENT, ConfigService],
    }),
    GcpBucketModule.forRootAsync({
      useFactory: async (configService: ConfigService) =>
        configService.get('gcpConfig'),
      inject: [ConfigService],
    }),
    HttpModule,
  ],
  providers: [
    Logger,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
