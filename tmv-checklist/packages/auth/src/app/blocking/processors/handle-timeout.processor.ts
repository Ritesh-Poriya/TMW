import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueError,
  OnQueueFailed,
  OnQueueRemoved,
  OnQueueStalled,
  OnQueueWaiting,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { RedisService } from 'src/app/redis/redis.service';

@Processor('blocking')
export class BlockingUnblockingProcessor {
  constructor(
    private redisService: RedisService,
    private logger: Logger,
  ) {}
  @Process('handleTimeOutOnBlock')
  async handleTimeOutOnBlock(job: Job<{ key: string }>) {
    try {
      this.logger.log(
        `BlockingUnblockingProcessor.handleTimeOutOnBlock() is called with job: ${JSON.stringify(
          job,
        )}`,
      );
      const count = await this.redisService.getClient().get(job.data.key);
      this.logger.log(
        `BlockingUnblockingProcessor.handleTimeOutOnBlock() count: ${count}`,
      );
      if (count && +count === 1) {
        this.logger.log(
          `BlockingUnblockingProcessor.handleTimeOutOnBlock() inside if (count && +count === 1) and deleting key: ${job.data.key}`,
        );
        await this.redisService.getClient().del(job.data.key);
      } else if (count && +count > 1) {
        this.logger.log(
          `BlockingUnblockingProcessor.handleTimeOutOnBlock() inside else if (count && +count > 1) and decrementing count for key: ${
            job.data.key
          } to ${+count - 1}`,
        );
        await this.redisService.getClient().set(job.data.key, +count - 1);
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  @Process('handleTimeOutOnBlockIP')
  async handleTimeOutOnBlockIP(job: Job<{ key: string; ip: string }>) {
    const keys = await this.redisService
      .getClient()
      .keys(`*${job.data.ip}:url:*`);

    for (const key of keys) {
      await this.redisService.getClient().del(key);
    }

    this.logger.log(
      `BlockingUnblockingProcessor.handleTimeOutOnBlockIP() is called with job: ${JSON.stringify(
        job,
      )}`,
    );
    this.logger.log(
      `BlockingUnblockingProcessor.handleTimeOutOnBlockIP() deleting key: ${job.data.key}`,
    );
    await this.redisService.getClient().del(job.data.key);
  }

  @OnQueueError()
  async onQueueError(job: Job, error: Error) {
    this.logger.log(
      `BlockingUnblockingProcessor.onQueueError() is called with job: ${JSON.stringify(
        job,
      )} and error: ${JSON.stringify(error)}`,
    );
  }

  @OnQueueWaiting()
  async onQueueWaiting(jobId: number | string) {
    this.logger.log(
      `BlockingUnblockingProcessor.onQueueWaiting() is called with jobId: ${jobId}`,
    );
  }

  @OnQueueActive()
  async onQueueActive(job: Job) {
    this.logger.log(
      `BlockingUnblockingProcessor.onQueueActive() is called with job: ${JSON.stringify(
        job,
      )}`,
    );
  }

  @OnQueueStalled()
  async onQueueStalled(jobId: number | string) {
    this.logger.log(
      `BlockingUnblockingProcessor.onQueueStalled() is called with jobId: ${jobId}`,
    );
  }

  @OnQueueCompleted()
  async onQueueCompleted(job: Job) {
    this.logger.log(
      `BlockingUnblockingProcessor.onQueueCompleted() is called with job: ${JSON.stringify(
        job,
      )}`,
    );
  }

  @OnQueueFailed()
  async onQueueFailed(job: Job) {
    this.logger.log(
      `BlockingUnblockingProcessor.onQueueFailed() is called with job: ${JSON.stringify(
        job,
      )}`,
    );
  }

  @OnQueueRemoved()
  async onQueueRemoved(job: Job) {
    this.logger.log(
      `BlockingUnblockingProcessor.onQueueRemoved() is called with job: ${JSON.stringify(
        job,
      )}`,
    );
  }
}
