import { ApiResponseProperty } from '@nestjs/swagger';
import { CategoryResDto } from './category.dto';
import { PaginationMetaDto } from 'src/app/common/pagination';

export class GetAllCategoriesAPIResponse {
  @ApiResponseProperty({ type: [CategoryResDto] })
  items: CategoryResDto[];

  @ApiResponseProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
