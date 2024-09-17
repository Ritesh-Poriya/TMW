import { Logger, Module } from '@nestjs/common';
import { SupportEventsListener } from './listeners/support.listener';

@Module({
  imports: [],
  providers: [Logger, SupportEventsListener],
})
export class EventsModule {}
