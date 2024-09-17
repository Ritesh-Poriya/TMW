import { Inject, Injectable, Logger } from '@nestjs/common';
import { Subjects } from 'src/app/nats/@types/subjects';
import { Listener } from 'src/app/nats/base-listener';
import { CompanyUpdatedEvent } from 'src/app/nats/events/company-updated.event';
import { queueGroupName } from './queue-group';
import { NATS_CLIENT } from 'src/app/nats/constants';
import { Message, Stan } from 'node-nats-streaming';
import { UserService } from 'src/app/users/user.service';
import { UserRole } from 'src/app/users/@types/users';

@Injectable()
export class CompanyUpdatedEventListener extends Listener<CompanyUpdatedEvent> {
  subject: CompanyUpdatedEvent['subject'] = Subjects.CompanyUpdated;
  queueGroupName = queueGroupName;

  constructor(
    @Inject(NATS_CLIENT) client: Stan,
    private readonly userService: UserService,
    private logger: Logger,
  ) {
    super(client);
    this.logger.log('CompanyUpdatedEventListener created');
    this.listen();
  }

  async onMessage(
    data: {
      companyId: string;
      userEmail: string;
      firstName: string;
      lastName: string;
      maxUsers: number;
      oldUserEmail: string;
    },
    message: Message,
  ): Promise<void> {
    try {
      this.logger.log(
        `CompanyUpdatedEventListener received event: seq ${message.getSequence()}`,
      );
      const user = await this.userService.findUserByEmail(data.oldUserEmail);
      if (
        user &&
        (user.firstName !== data.firstName ||
          user.lastName !== data.lastName ||
          user.email !== data.userEmail)
      ) {
        await this.userService.updateUserNamesOrEmailOrRoleForCompany(
          user.userId,
          data.firstName,
          data.lastName,
          data.userEmail,
          UserRole.ADMIN,
          data.companyId,
          data.maxUsers,
        );
      }
      this.logger.log(`acking message seq: ${message.getSequence()}`);
      message.ack();
    } catch (error) {
      this.logger.error(error);
    }
  }
}
