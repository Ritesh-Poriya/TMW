import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { toBoolean } from 'src/app/common/helper/transformer';
import { PaginationFilter } from 'src/app/common/pagination';
import {
  CompanyUserRole,
  FindCompanyUserOptions,
  UserRole,
} from 'src/app/users/@types/users';

export class FindCompanyUsersReqDto
  extends PaginationFilter
  implements FindCompanyUserOptions
{
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  @ApiPropertyOptional()
  search: string;

  @IsOptional()
  @IsArray()
  @IsEnum(CompanyUserRole, {
    each: true,
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') return value.split(',');
    return value;
  })
  @ApiPropertyOptional()
  roles: UserRole[];

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => toBoolean(value))
  @ApiPropertyOptional()
  excludeMe: boolean;
}
