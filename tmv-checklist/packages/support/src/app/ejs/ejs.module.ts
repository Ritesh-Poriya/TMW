import { Module } from '@nestjs/common';
import { EJSService } from './ejs.service';
import { EJS_PROVIDER } from './constants';
import { EJSModuleAsyncOptions } from './@types';

@Module({})
export class EJSModule {
  static forFeatureAsync(asyncOptions: EJSModuleAsyncOptions) {
    const { useFactory } = asyncOptions;
    return {
      module: EJSModule,
      providers: [
        {
          provide: EJS_PROVIDER,
          useFactory: useFactory,
          inject: asyncOptions.inject,
        },
        EJSService,
      ],
      exports: [EJSService],
    };
  }
}
