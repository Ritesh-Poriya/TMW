import { ModuleMetadata } from '@nestjs/common';
import * as Minio from 'minio';

export interface MinIOModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (
    ...args: any[]
  ) => Promise<Minio.ClientOptions> | Minio.ClientOptions;
  inject?: any[];
}
