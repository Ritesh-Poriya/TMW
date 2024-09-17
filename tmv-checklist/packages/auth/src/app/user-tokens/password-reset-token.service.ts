import { Injectable } from '@nestjs/common';
import { CryptoService } from '../crypt/crypto.service';
import { RedisService } from '../redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { ErrorCode } from '../exceptions/error-codes';
import { CustomExceptionFactory } from '../exceptions/custom-exception.factory';
import { logAround } from '../logger/decorator/log-around';

@Injectable()
export class PasswordResetTokenService {
  constructor(
    private cryptoService: CryptoService,
    private configService: ConfigService,
    private redisService: RedisService,
  ) {}

  @logAround()
  public generateToken(userId: string) {
    const resetPasswordToken = this.cryptoService.encrypt(
      userId +
        this.configService.get('passwordResetConfig.passwordTokenDelimiter') +
        Date.now(),
    );
    const tokenExpireInMs = this.configService.get<number>(
      'passwordResetConfig.passwordTokenExpiryInMs',
    );
    this.redisService
      .getClient()
      .set(
        `resetPasswordToken-${userId}`,
        resetPasswordToken,
        'PX',
        tokenExpireInMs,
      );

    return resetPasswordToken;
  }

  @logAround()
  public decodeToken(token: string) {
    const decryptedToken = this.cryptoService.decrypt(token);
    const [userId, timestamp] = decryptedToken.split(
      this.configService.get('passwordResetConfig.passwordTokenDelimiter'),
    );
    if (!userId || !timestamp) {
      throw CustomExceptionFactory.create(
        ErrorCode.PASSWORD_RESET_TOKEN_INVALID,
      );
    }
    return { userId, timestamp };
  }

  @logAround()
  public getUserIdFromToken(token: string) {
    const { userId } = this.decodeToken(token);
    return userId;
  }

  @logAround()
  public async verifyToken(userId: string, token: string) {
    const resetPasswordToken = await this.redisService
      .getClient()
      .get(`resetPasswordToken-${userId}`);
    if (!resetPasswordToken) {
      return false;
    }
    return resetPasswordToken === token;
  }

  @logAround()
  public async deleteToken(userId: string) {
    await this.redisService.getClient().del(`resetPasswordToken-${userId}`);
  }
}
