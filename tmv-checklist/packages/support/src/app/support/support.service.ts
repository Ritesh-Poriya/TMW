import { Inject, Injectable } from '@nestjs/common';
import { Support } from './entities';
import { PageService } from '../common/pagination';
import { Repository } from 'typeorm';
import { SUPPORT_REPOSITORY } from './constants';
import { SupportStatus } from './@types';
import { CompanyResDto } from '../company/@types/res-types';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SupportEventType } from '../events/@types';
import { AuthorizeResType } from '../auth/@types';
import { TicketResolveReqDto } from '../rest/dtos/requests/ticket-resolve.dto';
import { CustomExceptionFactory } from '../exceptions/custom-exception.factory';
import { ErrorCode } from '../exceptions/error-codes';

@Injectable()
export class SupportService extends PageService<Support> {
  constructor(
    @Inject(SUPPORT_REPOSITORY)
    readonly supportRepository: Repository<Support>,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super(supportRepository);
  }

  async raiseTicket(
    support: Support,
    company: CompanyResDto,
    user: AuthorizeResType,
  ): Promise<Support> {
    delete support.id;
    support.status = SupportStatus.PENDING;
    const result = await this.supportRepository.save(support);
    this.eventEmitter.emit(SupportEventType.TICKET_RAISE, {
      companyEmail: company.billingContact.email,
      firstName: user.firstName,
      lastName: user.lastName,
      userEmail: user.email,
      message: result.message,
    });
    return result;
  }

  async ticketResolve(body: TicketResolveReqDto, id: string) {
    const support = await this.supportRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!support) {
      throw CustomExceptionFactory.create(ErrorCode.SUPPORT_TICKET_NOT_FOUND);
    }

    await this.supportRepository.update(id, {
      ...body,
      status: SupportStatus.RESOLVED,
      resolvedOn: new Date(),
    });
  }
}
