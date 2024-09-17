import { Inject, Injectable, Logger } from '@nestjs/common';
import { Subjects } from 'src/app/nats/@types/subjects';
import { Listener } from 'src/app/nats/base-listener';
import { CompanyCreatedEvent } from 'src/app/nats/events/company-created.event';
import { queueGroupName } from './queue-group';
import { NATS_CLIENT } from 'src/app/nats/constants';
import { Message, Stan } from 'node-nats-streaming';
import { UserService } from 'src/app/users/user.service';
import { UserRole } from 'src/app/users/@types/users';

@Injectable()
export class CompanyCreatedEventListener extends Listener<CompanyCreatedEvent> {
  subject: CompanyCreatedEvent['subject'] = Subjects.CompanyCreated;
  queueGroupName = queueGroupName;

  constructor(
    @Inject(NATS_CLIENT) client: Stan,
    private readonly userService: UserService,
    private logger: Logger,
  ) {
    super(client);
    this.logger.log('CompanyCreatedEventListener created');
    this.listen();
  }

  async onMessage(data: CompanyCreatedEvent['data'], msg: Message) {
    this.logger.log('CompanyCreatedEventListener received event');
    try {
      const checkIfExist = await this.userService.findUserByEmail(
        data.userEmail,
      );
      if (checkIfExist) {
        this.logger.log(
          `CompanyCreatedEventListener user with email: ${data.userEmail} already exists`,
        );
        msg.ack();
        return;
      }
      const createdUser = await this.userService.createUserForCompany(
        data.firstName,
        data.lastName,
        data.userEmail,
        UserRole.ADMIN,
        data.companyId,
        data.maxUsers,
      );
      this.logger.log(
        `CompanyCreatedEventListener created user with email: ${createdUser.email}`,
      );
      msg.ack();
    } catch (error) {
      this.logger.error(error);
    }
  }
}
