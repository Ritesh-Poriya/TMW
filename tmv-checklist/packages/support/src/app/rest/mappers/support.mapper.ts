import { Support } from 'src/app/support/entities';
import { SupportReqDto } from '../dtos/requests';
import { SupportResDto } from '../dtos/responses';
import { AuthorizeResType } from 'src/app/auth/@types';

export class SupportMapper {
  static toEntity(supportDto: SupportReqDto, user: AuthorizeResType): Support {
    const support = new Support();
    support.message = supportDto.message;
    support.raisedBy = user.userId;
    return support;
  }

  static toResDto(support: Support): SupportResDto {
    return {
      id: support.id,
      message: support.message,
      status: support.status,
      raisedBy: support.raisedBy,
      createdAt: support.createdAt,
    };
  }
}
