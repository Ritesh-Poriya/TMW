import { Logger, Module, ValidationPipe } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';
import { postgresConfig, natsConfig, jwtConfig, authConfig } from './config';
import { RestModule as HttpControllersModule } from './rest/rest.module';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { NATSModule } from './nats/nats.module';
import { EventsModule } from './events/events.module';
import { JwtModule } from './jwt/jwt.module';
import { AuthGuard } from './auth/guards/auth.guard';
import { HttpModule } from '@nestjs/axios';
import { LoggingInterceptor } from './logger/logging.interceptor';

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
      load: [postgresConfig, natsConfig, jwtConfig, authConfig],
    }),
    HttpModule,
    HttpControllersModule,
    NATSModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('natsConfig'),
    }),
    JwtModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('jwtConfig'),
    }),
    EventsModule,
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
