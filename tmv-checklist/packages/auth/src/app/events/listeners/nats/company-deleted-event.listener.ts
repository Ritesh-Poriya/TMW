import { Inject, Injectable, Logger } from '@nestjs/common';
import { Listener } from 'src/app/nats/base-listener';
import { queueGroupName } from './queue-group';
import { Subjects } from 'src/app/nats/@types/subjects';
import { CompanyDeletedEvent } from 'src/app/nats/events/company-deleted.event';
import { NATS_CLIENT } from 'src/app/nats/constants';
import { Message, Stan } from 'node-nats-streaming';
import { UserService } from 'src/app/users/user.service';

@Injectable()
export class CompanyDeletedEventListener extends Listener<CompanyDeletedEvent> {
  subject: Subjects.CompanyDeleted = Subjects.CompanyDeleted;

  queueGroupName = queueGroupName;

  constructor(
    @Inject(NATS_CLIENT) client: Stan,
    private readonly userService: UserService,
    private logger: Logger,
  ) {
    super(client);
    this.logger.log('CompanyDeletedEventListener created');
    this.listen();
  }

  async onMessage(data: CompanyDeletedEvent['data'], msg: Message) {
    this.logger.log('CompanyDeletedEventListener received event');
    try {
      await this.userService.deleteByCompanyId(data.companyId);
      msg.ack();
    } catch (error) {
      this.logger.error(error);
    }
  }
}
