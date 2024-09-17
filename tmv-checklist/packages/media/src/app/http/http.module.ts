import { Module } from '@nestjs/common';
import { MediaModule } from '../media/media.module';
import { MediaController } from './media.controller';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as path from 'path';

@Module({
  imports: [
    MediaModule,
    MulterModule.register({
      storage: multer.diskStorage({
        destination: path.join(__dirname, '..', '..', '..', 'uploads'),
        filename: (_, file, cb) => {
          const spitName = file.originalname.split('.');
          const extension = spitName[spitName.length - 1];
          const fileName = spitName
            .slice(0, spitName.length - 1)
            .join('.')
            .trim()
            .replace(/\s/g, '_');
          cb(
            null,
            `${fileName.toLowerCase()}-${Date.now()}.${extension.toLowerCase()}`,
          );
        },
      }),
    }),
  ],
  controllers: [MediaController],
})
export class HttpModule {}
