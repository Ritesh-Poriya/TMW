import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Bull, { Queue } from 'bull';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class BlockingService {
  constructor(
    private redisService: RedisService,
    @InjectQueue('blocking') private blockingQueue: Queue,
    private configService: ConfigService,
    private logger: Logger,
  ) {}

  public async handleRateLimit(args: {
    ip: string;
    url: string;
    limit: number;
    windowInMinutes: number;
    blockDurationInMinutes: number;
    removeLastPartOfUrl?: boolean;
    isCheckingOnError?: boolean;
  }) {
    const delayedJobs = await this.blockingQueue.getDelayed();
    this.logger.log(
      `BlockingService.handleRateLimit() delayedJobs: ${JSON.stringify(
        delayedJobs,
      )}`,
    );
    this.logger.log(
      `BlockingService.handleRateLimit() is called with args: ${JSON.stringify(
        JSON.stringify(args),
      )}`,
    );
    if (!args.limit || !args.windowInMinutes || !args.blockDurationInMinutes) {
      throw new Error('Rate limit decorator must be used with proper keys');
    }
    const key = this.getKey(args.ip, args.url, args.removeLastPartOfUrl);
    const currentCount = await this.redisService.getClient().get(key);
    this.logger.log(
      `BlockingService.handleRateLimit() currentCount: ${currentCount} && key: ${key}`,
    );
    this.logger.log(
      `BlockingService.handleRateLimit() incrementing count for key: ${key}`,
    );
    await this.redisService
      .getClient()
      .set(key, currentCount ? +currentCount + 1 : 1);
    if (args.isCheckingOnError) {
      this.logger.log(
        `BlockingService.handleRateLimit() inside if (args.isCheckingOnError)`,
      );
      if (currentCount && +currentCount + 1 >= args.limit) {
        this.logger.log(
          `BlockingService.handleRateLimit() inside if (currentCount && +currentCount + 1 >= args.limit) (isCheckingOnError === true)`,
        );
        await this.blockIPForTime(args.ip, args.blockDurationInMinutes);
      }
    } else {
      this.logger.log(
        `BlockingService.handleRateLimit() inside else block of if (args.isCheckingOnError)`,
      );
      if (currentCount && +currentCount + 1 > args.limit) {
        this.logger.log(
          `BlockingService.handleRateLimit() inside if (currentCount && +currentCount + 1 > args.limit) (isCheckingOnError === false)`,
        );
        await this.blockIPForTime(args.ip, args.blockDurationInMinutes);
      }
    }
    const job = await this.blockingQueue.add(
      'handleTimeOutOnBlock',
      {
        key,
      },
      {
        delay: args.windowInMinutes * 60 * 1000,
      },
    );
    this.logger.log(
      `BlockingService.handleRateLimit() adding a job with id: ${JSON.stringify(
        job,
      )}`,
    );
    this.addJobForIP(args.ip, job.id);
  }

  private getKey(
    ip: string,
    url: string,
    removeLastPartOfUrl: undefined | boolean,
  ): string {
    this.logger.log(
      `BlockingService.getKey() is called with args: ip: ${ip}, url: ${url}, removeLastPartOfUrl: ${removeLastPartOfUrl}`,
    );
    if (removeLastPartOfUrl) {
      const urlParts = url.split('/');
      url = urlParts.slice(0, urlParts.length - 1).join('/');
    }
    const key = `${ip}:url:${url}`;
    this.logger.log(`BlockingService.getKey() returning key: ${key}`);
    return key;
  }

  public async handleRateLimitRouteThrewError(ip: string, url: string) {
    this.logger.log(
      `BlockingService.handleRateLimitRouteThrewError() is called with args: ip: ${ip}, url: ${url}`,
    );
    const key = `${ip}:${url}`;
    const currentCount = await this.redisService.getClient().get(key);
    this.logger.log(
      `BlockingService.handleRateLimitRouteThrewError() currentCount: ${currentCount} && key: ${key}`,
    );
    await this.redisService
      .getClient()
      .set(key, currentCount ? +currentCount - 1 : 1);
    this.logger.log(
      `BlockingService.handleRateLimitRouteThrewError() decrementing count for key: ${key} with value: ${
        currentCount ? +currentCount - 1 : 1
      }`,
    );
  }

  private async blockIPForTime(ip: string, time: number) {
    this.logger.log(
      `BlockingService.blockIPForTime() is called with args: ip: ${ip}, time: ${time}`,
    );
    await this.removeJobsForIP(ip);
    await this.removeKeysAssociatedWithIP(ip);
    const key = `${ip}:blocked`;
    this.redisService.getClient().set(key, time);
    this.logger.log(
      `BlockingService.blockIPForTime() setting key: ${key} with value: ${time}`,
    );
    const job = await this.blockingQueue.add(
      'handleTimeOutOnBlockIP',
      { key, ip },
      { delay: time * 60 * 1000 },
    );
    this.logger.log(
      `BlockingService.blockIPForTime() adding a job with id: ${JSON.stringify(
        job,
      )}`,
    );
  }

  private async removeKeysAssociatedWithIP(ip: string) {
    this.logger.log(
      `BlockingService.removeKeysAssociatedWithIP() is called with args: ip: ${ip}`,
    );
    const prefix = this.configService.get<string>('redisDB.keyPrefix');
    const keys = await this.redisService.getClient().keys(`${prefix}${ip}:*`);
    this.logger.log(
      `BlockingService.removeKeysAssociatedWithIP() keys: ${keys}`,
    );
    for (let k of keys) {
      k = k.replace(prefix, '');
      this.logger.log(
        `BlockingService.removeKeysAssociatedWithIP() removing key: ${k}`,
      );
      await this.redisService.getClient().del(k);
    }
  }

  private async removeJobsForIP(ip: string) {
    this.logger.log(
      `BlockingService.removeJobsForIP() is called with args: ip: ${ip}`,
    );
    const jobs: Bull.JobId[] = JSON.parse(
      await this.redisService.getClient().get(ip),
    );
    this.logger.log(
      `BlockingService.removeJobsForIP() jobs: ${JSON.stringify(jobs)}`,
    );
    for (const jobId of jobs) {
      this.logger.log(`BlockingService.removeJobsForIP() jobID: ${jobId}`);
      const jobInQueue = await this.blockingQueue.getJob(jobId);
      this.logger.log(
        `BlockingService.removeJobsForIP() jobInQueue: ${JSON.stringify(
          jobInQueue,
        )}`,
      );
      if (jobInQueue) {
        this.logger.log(
          `BlockingService.removeJobsForIP() removing job with id: ${jobId}`,
        );
        await jobInQueue.remove();
      }
    }
  }

  async checkIsBlocked(ip: any) {
    this.logger.log(
      `BlockingService.checkIsBlocked() is called with args: ip: ${ip}`,
    );
    const key = `${ip}:blocked`;
    this.logger.log(`BlockingService.checkIsBlocked() key: ${key}`);
    const blocked = await this.redisService.getClient().get(key);
    this.logger.log(
      `BlockingService.checkIsBlocked() blocked: ${blocked} && key: ${key}`,
    );
    if (blocked && +blocked > 0) {
      this.logger.log(
        `BlockingService.checkIsBlocked() inside if (blocked && +blocked > 0)`,
      );
      this.logger.log(
        `BlockingService.checkIsBlocked() return user is blocked for time duration: ${blocked} minutes`,
      );
      return {
        isBlocked: true,
        timeToUnblock: +blocked,
      };
    }
    this.logger.log(
      `BlockingService.checkIsBlocked() return user is not blocked`,
    );
    return {
      isBlocked: false,
    };
  }

  private async addJobForIP(ip: string, jobId: Bull.JobId) {
    this.logger.log(
      `BlockingService.addJobForIP() called with args ip: ${ip} and jobId: ${jobId}`,
    );
    const jobs: Bull.JobId[] =
      JSON.parse(await this.redisService.getClient().get(ip)) || [];
    this.logger.log(
      `BlockingService.addJobForIP() parsing jobs: ${JSON.stringify(jobs)}`,
    );
    jobs.push(jobId);
    this.logger.log(
      `BlockingService.addJobForIP() jobs after pushing: ${jobs}`,
    );
    await this.redisService.getClient().set(ip, JSON.stringify(jobs));
  }
}
