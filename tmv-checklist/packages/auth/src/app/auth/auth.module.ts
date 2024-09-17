import { Logger, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '../jwt/jwt.module';
import { UsersModule } from '../users/user.module';
import { CryptoModule } from '../crypt/crypto.module';
import { CaptchaModule } from '../captcha/captcha.module';
import { ConfigService } from '@nestjs/config';
import { UserTokensModule } from '../user-tokens/user-tokens.module';
import { RolesGuard } from './guards';

@Module({
  imports: [
    JwtModule,
    UsersModule,
    UserTokensModule,
    CryptoModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('cryptoConfig'),
    }),
    CaptchaModule.forRoot({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('captchaConfig'),
    }),
  ],
  providers: [AuthService, Logger, RolesGuard],
  exports: [AuthService, RolesGuard],
})
export class AuthModule {}
