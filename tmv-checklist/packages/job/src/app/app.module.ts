import { Logger, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { mongoDBConfig } from './config/mongodb.comfiguration';
import { authConfig } from './config';
import * as path from 'path';
import { HttpModule as HttpClientModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { LoggingInterceptor } from './logger/logging.interceptor';
import { AuthGuard } from './auth/guards';
import { BootStrapModule } from './bootstrap/bootstrap.module';
import { RestModule } from './rest/rest.module';
import { CompanyGuard } from './auth/guards/company.guard';

const envFilePath = path.resolve(__dirname, '../../../../.env');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'local' ? envFilePath : undefined,
      load: [mongoDBConfig, authConfig],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get('url'),
        };
      },
    }),
    HttpClientModule,
    BootStrapModule,
    RestModule,
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
      provide: APP_GUARD,
      useClass: CompanyGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
