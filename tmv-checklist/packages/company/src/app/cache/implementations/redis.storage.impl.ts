import { Redis } from 'ioredis';
import { ICacheStorage } from '../@types';

export class RedisCacheStorage implements ICacheStorage {
  constructor(private readonly redis: Redis) {}

  async get(key: string) {
    return this.redis.get(key);
  }

  async set(key: string, value: any) {
    await this.redis.set(key, value);
  }

  async delete(key: string): Promise<boolean> {
    try {
      await this.redis.del(key);
      return true;
    } catch (error) {
      return false;
    }
  }

  async has(key: string): Promise<boolean> {
    return !!(await this.redis.get(key));
  }
}
