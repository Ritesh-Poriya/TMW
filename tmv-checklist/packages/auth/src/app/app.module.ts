import { Logger, Module, ValidationPipe } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { UsersModule } from './users/user.module';
import { RestModule } from './rest/rest.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';
import { JwtModule } from './jwt/jwt.module';
import {
  captchaConfig,
  cryptoConfig,
  jwtConfig,
  mailConfig,
  passwordResetConfig,
  redisConfig,
  bullConfig,
  postgresConfig,
  hostConfig,
  natsConfig,
  bootstrapConfig,
  blockingConfig,
  urlConfig,
  companyConfig,
} from './config';
import { MailModule } from './mail/mail.module';
import { RedisModule } from './redis/redis.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventsModule } from './events/events.module';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AuthGuard } from './auth/guards';
import { HealthModule } from './health/health.module';
import { BullModule } from '@nestjs/bull';
import { LoggingInterceptor } from './logger/logging.interceptor';
import { NATSModule } from './nats/nats.module';
import { BootStrapModule } from './bootstrap/bootstrap.module';
import { AuthModule } from './auth/auth.module';

const envFilePath = path.resolve(__dirname, '../../../../.env');

@Module({
  imports: [
    DbModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('postgresConfig'),
    }),
    UsersModule,
    RestModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'local' ? envFilePath : undefined,
      load: [
        jwtConfig,
        captchaConfig,
        cryptoConfig,
        mailConfig,
        redisConfig,
        passwordResetConfig,
        bullConfig,
        postgresConfig,
        hostConfig,
        natsConfig,
        bootstrapConfig,
        blockingConfig,
        urlConfig,
        companyConfig,
      ],
    }),
    JwtModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('jwtConfig'),
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
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('redisConfig'),
    }),
    EventEmitterModule.forRoot(),
    EventsModule,
    HealthModule,
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('bullConfig'),
    }),
    NATSModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('natsConfig'),
    }),
    BootStrapModule,
  ],
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
