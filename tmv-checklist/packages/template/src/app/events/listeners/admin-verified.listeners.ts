import { Inject, Injectable } from '@nestjs/common';
import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from 'src/app/nats/@types/subjects';
import { Listener } from 'src/app/nats/base-listener';
import { NATS_CLIENT } from 'src/app/nats/constants';
import { UserService } from 'src/app/users/services/user.service';
import { queueGroupName } from './queue-group-name';
import { AdminVerifiedEvent } from 'src/app/nats/events/admin-verified.event';
import { logAround } from 'src/app/logger/decorator/log-around';

@Injectable()
export class AdminVerifiedListener extends Listener<AdminVerifiedEvent> {
  subject: AdminVerifiedEvent['subject'] = Subjects.AdminVerified;
  queueGroupName = queueGroupName;

  constructor(
    @Inject(NATS_CLIENT) client: Stan,
    private readonly userService: UserService,
  ) {
    super(client);
    console.log('AdminVerifiedListener is created');
    this.listen();
  }

  @logAround()
  async onMessage(
    data: {
      userId: string;
      email: string;
    },
    message: Message,
  ): Promise<void> {
    console.log(`Message info -`, JSON.stringify(message.getSequence()));
    const createdUser = await this.userService.createUser(
      data.userId,
      data.email,
    );
    console.log('User created: ', JSON.stringify(createdUser));
    message.ack();
    console.log('Message acknowledged');
  }
}
