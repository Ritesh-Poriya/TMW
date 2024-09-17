import { ApiResponseProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from 'src/app/common/pagination';
import { CustomerResDto } from './job.dto';

export class GetAllCustomerAPIResponse {
  @ApiResponseProperty({ type: [CustomerResDto] })
  items: CustomerResDto[];

  @ApiResponseProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
