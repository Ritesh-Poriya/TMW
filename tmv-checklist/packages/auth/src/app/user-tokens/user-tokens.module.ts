import { Module } from '@nestjs/common';
import { CryptoModule } from '../crypt/crypto.module';
import { ConfigService } from '@nestjs/config';
import { PasswordResetTokenService } from './password-reset-token.service';
import { UserInviteTokenService } from './user-token.service';

@Module({
  imports: [
    CryptoModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('cryptoConfig'),
    }),
  ],
  providers: [PasswordResetTokenService, UserInviteTokenService],
  exports: [PasswordResetTokenService, UserInviteTokenService],
})
export class UserTokensModule {}
