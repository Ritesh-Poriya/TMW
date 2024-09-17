import { ModuleMetadata } from '@nestjs/common';

export interface RedisModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: any[]
  ) => Promise<RedisModuleOptions> | RedisModuleOptions;
  inject?: any[];
}

export interface RedisModuleOptions {
  host: string;
  port: number;
  password: string;
  db: number;
}
