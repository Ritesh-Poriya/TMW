import { Injectable } from '@nestjs/common';
import { HealthIndicator } from '@nestjs/terminus';
import { RedisService } from './redis.service';
import { logAround } from '../logger/decorator/log-around';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  constructor(private readonly redisService: RedisService) {
    super();
  }

  @logAround()
  async isHealthy() {
    const client = this.redisService.getClient();
    return client
      .ping()
      .then(() => this.getStatus('redis', true))
      .catch(() => this.getStatus('redis', false));
  }
}
