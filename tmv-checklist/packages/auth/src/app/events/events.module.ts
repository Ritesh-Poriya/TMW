import { Logger, Module } from '@nestjs/common';
import { UserEventsListener } from './listeners/user.listener';
import { AuthModule } from '../auth/auth.module';
import { UserTokensModule } from '../user-tokens/user-tokens.module';
import { CompanyCreatedEventListener } from './listeners/nats/company-created-event-listener';
import { UsersModule } from '../users/user.module';
import { UrlModule } from '../url/url.module';
import { CompanyDeletedEventListener } from './listeners/nats/company-deleted-event.listener';
import { CompanyUpdatedEventListener } from './listeners/nats/company-updated-event.listener';

@Module({
  imports: [AuthModule, UserTokensModule, UsersModule, UrlModule],
  providers: [
    Logger,
    UserEventsListener,
    CompanyCreatedEventListener,
    CompanyDeletedEventListener,
    CompanyUpdatedEventListener,
  ],
})
export class EventsModule {}
