import { ModuleMetadata } from '@nestjs/common';

export interface NatsModuleOptions {
  clusterId: string;
  clientId: string;
  url: string;
}

export interface NatsModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: any[]
  ) => Promise<NatsModuleOptions> | NatsModuleOptions;
  inject?: any[];
}
