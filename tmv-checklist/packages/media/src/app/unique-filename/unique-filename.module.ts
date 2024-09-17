import { DynamicModule, Module } from '@nestjs/common';
import { UniqueFileNameGenerator } from './@types';
import { UNIQUE_FILENAME_GENERATOR } from './constants';

@Module({})
export class UniqueFilenameModule {
  static forRoot(value: UniqueFileNameGenerator): DynamicModule {
    return {
      module: UniqueFilenameModule,
      providers: [
        {
          provide: UNIQUE_FILENAME_GENERATOR,
          useValue: value,
        },
      ],
      exports: [UNIQUE_FILENAME_GENERATOR],
    };
  }
}
