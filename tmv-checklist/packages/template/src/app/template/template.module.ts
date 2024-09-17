import { Module } from '@nestjs/common';
import { IndustryService } from './services/industry.service';
import { CategoryService } from './services/category.service';
import {
  categoryRepositoryProvider,
  industryRepositoryProvider,
} from './repositories';
import { templateRepositoryProvider } from './repositories/template.repository';
import { inputTypeRepositoryProvider } from './repositories/inputType.repository';
import { InputTypeService } from './services/inputType.service';
import { taskRepositoryProvider } from './repositories/task.repository';
import { TemplateService } from './services/template.service';

@Module({
  providers: [
    IndustryService,
    CategoryService,
    InputTypeService,
    TemplateService,
    categoryRepositoryProvider,
    industryRepositoryProvider,
    templateRepositoryProvider,
    inputTypeRepositoryProvider,
    taskRepositoryProvider,
  ],
  exports: [
    IndustryService,
    CategoryService,
    InputTypeService,
    TemplateService,
  ],
})
export class TemplateModule {}
