import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { toBoolean } from 'src/app/common/helpers/transformer';
import { PaginationFilter } from 'src/app/common/pagination';
import { FindTemplateOptions } from 'src/app/template/@types';

export class FindTemplateDto
  extends PaginationFilter
  implements FindTemplateOptions
{
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase())
  @ApiPropertyOptional()
  name: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  industryId: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => toBoolean(value))
  @ApiPropertyOptional()
  public: boolean;

  createdBy: string;
  companyId: string;
}
