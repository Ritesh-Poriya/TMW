import { ModuleMetadata } from '@nestjs/common';

export interface EJSModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (...args: any[]) => Promise<IEJSOptions> | IEJSOptions;
  inject?: any[];
}

export interface IEJSOptions {
  viewsDir: string;
  defaultData?: any;
  renderOptions?: any;
}
