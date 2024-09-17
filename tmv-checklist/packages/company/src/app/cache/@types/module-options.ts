import { ModuleMetadata } from '@nestjs/common';
import { ICacheStorage } from './cache';

export interface CacheModuleOptions {
  defaultStorage: ICacheStorage;
}

export interface CacheModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => Promise<ICacheStorage> | ICacheStorage;
  inject?: any[];
}
