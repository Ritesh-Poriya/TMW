import { Logger, Module } from '@nestjs/common';
import { CompanyDeletedEventListener } from './listeners/company-deleted.listener';
import { TemplateModule } from '../template/template.module';

@Module({
  imports: [TemplateModule],
  providers: [CompanyDeletedEventListener, Logger],
})
export class EventsModule {}
