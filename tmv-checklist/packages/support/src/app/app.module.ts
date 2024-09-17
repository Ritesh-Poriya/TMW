import { Logger, Module, ValidationPipe } from '@nestjs/common';
import {
  authConfig,
  companyConfig,
  mailConfig,
  postgresConfig,
} from './config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DbModule } from './db/db.module';
import * as path from 'path';
import { HttpModule as HttpClientModule } from '@nestjs/axios';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AuthGuard } from './auth/guards';
import { LoggingInterceptor } from './logger/logging.interceptor';
import { BootStrapModule } from './bootstrap/bootstrap.module';
import { RestModule } from './rest/rest.module';
import { EventsModule } from './events/events.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MailModule } from './mail/mail.module';

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
      load: [postgresConfig, authConfig, mailConfig, companyConfig],
    }),
    MailModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('mailConfig'),
      ejsAsyncOptions: {
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) =>
          configService.get('mailConfig.ejsConfig'),
      },
    }),
    HttpClientModule,
    BootStrapModule,
    RestModule,
    EventEmitterModule.forRoot(),
    EventsModule,
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
