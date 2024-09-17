import { Redis } from 'ioredis';
import { RedisCacheStorage } from './implementations/redis.storage.impl';
import { ICacheStorage } from './@types';

export class CacheStorageFactory {
  public static createRedisStore(redis: Redis): ICacheStorage {
    return new RedisCacheStorage(redis);
  }

  public static createMemoryStore(): ICacheStorage {
    return new Map();
  }
}
