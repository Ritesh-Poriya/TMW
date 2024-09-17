import { ModuleMetadata } from '@nestjs/common';
import { StorageOptions as GcpBucketOptions } from '@google-cloud/storage';

export interface GcpBucketModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => Promise<GcpBucketOptions> | GcpBucketOptions;
  inject?: any[];
}

export { GcpBucketOptions };
