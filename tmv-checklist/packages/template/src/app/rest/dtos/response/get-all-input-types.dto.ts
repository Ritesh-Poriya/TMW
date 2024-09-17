import { ApiResponseProperty } from '@nestjs/swagger';
import { InputTypeResDto } from './input-type.dto';
import { PaginationMetaDto } from 'src/app/common/pagination';

export class GetAllInputTypeAPIResponse {
  @ApiResponseProperty({ type: [InputTypeResDto] })
  items: InputTypeResDto[];

  @ApiResponseProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
