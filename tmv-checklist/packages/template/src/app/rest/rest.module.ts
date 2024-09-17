import { Module } from '@nestjs/common';
import { TemplateModule } from '../template/template.module';
import {
  CategoryController,
  IndustryController,
  InputTypeController,
} from './controllers';
import { TemplateController } from './controllers/template.controller';

@Module({
  imports: [TemplateModule],
  controllers: [
    CategoryController,
    IndustryController,
    InputTypeController,
    TemplateController,
  ],
})
export class RestModule {}
