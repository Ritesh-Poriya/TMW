import { Module } from '@nestjs/common';
import { SupportService } from './support.service';
import { supportRepositoryProvider } from './repositories/support.repository';

@Module({
  imports: [],
  providers: [SupportService, supportRepositoryProvider],
  exports: [SupportService],
})
export class SupportModule {}
