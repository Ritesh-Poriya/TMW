import { Inject, Injectable } from '@nestjs/common';
import { REDIS_CLIENT } from './constants';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  getClient() {
    return this.redis;
  }
}
