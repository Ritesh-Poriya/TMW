import { ModuleMetadata } from '@nestjs/common';
import { Storage } from './storage.interface';

export interface StorageModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => Promise<Storage> | Storage;
  inject?: any[];
}
