import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';
import { toBoolean } from 'src/app/common/helpers/transformer';
import { PaginationFilter } from 'src/app/common/pagination';
import { FindCategoryOptions } from 'src/app/template/@types/find-category';

export class FindCategoryDto
  extends PaginationFilter
  implements FindCategoryOptions
{
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  name: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  parentCategoryId: string;

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

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => toBoolean(value))
  @ApiPropertyOptional()
  includeMine: boolean;
}
