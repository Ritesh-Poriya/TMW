import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { userProvider } from './providers/user.provider';
import { CryptoModule } from '../crypt/crypto.module';
import { ConfigService } from '@nestjs/config';
import { UserBootstrap } from './user.bootstrap';

@Module({
  imports: [
    CryptoModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('cryptoConfig'),
    }),
  ],
  providers: [UserService, ...userProvider, UserBootstrap],
  exports: [UserService, UserBootstrap],
})
export class UsersModule {}
