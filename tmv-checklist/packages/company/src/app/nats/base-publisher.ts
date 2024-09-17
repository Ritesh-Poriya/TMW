import { Stan } from 'node-nats-streaming';
import { Event } from './@types/event';
import { logAround } from '../logger/decorator/log-around';

export abstract class Publisher<T extends Event> {
  abstract subject: T['subject'];
  protected client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  @logAround()
  public async publish(data: T['data']) {
    return new Promise<void>((resolve, reject) => {
      console.log('Publishing event to subject', this.subject);
      console.log('Event data', data);
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          console.log('Error publishing event to subject', this.subject);
          console.log('Error data', err);
          return reject(err);
        }
        console.log('Event published to subject', this.subject);
        resolve();
      });
    });
  }
}
