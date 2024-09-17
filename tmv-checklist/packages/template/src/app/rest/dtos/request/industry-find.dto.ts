import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationFilter } from 'src/app/common/pagination';
import { FindIndustryOptions } from 'src/app/template/@types';

export class FindIndustryDto
  extends PaginationFilter
  implements FindIndustryOptions
{
  @IsOptional()
  @ApiPropertyOptional()
  name: string;
}
