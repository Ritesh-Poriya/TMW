import { Injectable } from '@nestjs/common';
import { CryptoService } from '../crypt/crypto.service';
import { RedisService } from '../redis/redis.service';
import { CustomExceptionFactory } from '../exceptions/custom-exception.factory';
import { ErrorCode } from '../exceptions/error-codes';

@Injectable()
export class UserInviteTokenService {
  constructor(
    private cryptoService: CryptoService,
    private readonly redisService: RedisService,
  ) {}

  public async getToken(userId: string) {
    const token = this.cryptoService.encrypt(userId);
    await this.redisService.getClient().set(token, userId);
    return token;
  }

  public async validateAndDecodeToken(token: string) {
    const redisToken = await this.redisService.getClient().get(token);
    const decodedToken = this.cryptoService.decrypt(token);
    const isValid = redisToken === decodedToken;
    if (!isValid) {
      throw CustomExceptionFactory.create(ErrorCode.INVALID_INVITE_TOKEN);
    }
    await this.redisService.getClient().del(token);
    return decodedToken;
  }
}
