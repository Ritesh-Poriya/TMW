import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationFilter } from 'src/app/common/pagination';
import { JobStatus } from 'src/app/jobs/@types';

export class FindJobDto extends PaginationFilter {
  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  fromDate: Date;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  toDate: Date;

  @IsOptional()
  @IsArray()
  @IsEnum(JobStatus, {
    each: true,
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') return value.split(',');
    return value;
  })
  @ApiPropertyOptional()
  status: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search: string;
}
