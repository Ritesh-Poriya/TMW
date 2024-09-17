import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { UniqueFilenameModule } from '../unique-filename/unique-filename.module';
import { UniqueFilenameGeneratorFactory } from '../unique-filename/unique-filename-implementation.factory';

@Module({
  imports: [
    UniqueFilenameModule.forRoot(
      UniqueFilenameGeneratorFactory.addTimeStampPostNameGenerator(),
    ),
  ],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
