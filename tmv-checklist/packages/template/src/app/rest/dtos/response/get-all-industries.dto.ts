import { ApiResponseProperty } from '@nestjs/swagger';
import { IndustryResponseType } from './industry-api-response.dto';
import { PaginationMetaDto } from 'src/app/common/pagination';

export class GetAllIndustriesAPIResponse {
  @ApiResponseProperty({ type: [IndustryResponseType] })
  items: IndustryResponseType[];

  @ApiResponseProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
