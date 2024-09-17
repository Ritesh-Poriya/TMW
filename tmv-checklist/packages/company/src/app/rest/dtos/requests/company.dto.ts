import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { toBoolean, toNumber } from 'src/app/common/helpers/transformer';
import { PaginationFilter } from 'src/app/common/pagination';
import { FindCompanyOptions } from 'src/app/company/@types';

export class FindCompanyDto
  extends PaginationFilter
  implements FindCompanyOptions
{
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  search: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => toBoolean(value))
  ignoreUserCount: boolean;
}

export class IgnoreUserCountQuery {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => toBoolean(value))
  ignoreUserCount: boolean;
}

export class CompanyBillingContactReqDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  lastName: string;

  @ApiProperty()
  @IsEmail()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  phone: string;
}

export class CompanyTenantReqDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  tenantName: string;

  @ApiProperty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  renewalDate: Date;

  @ApiProperty()
  @IsNumber()
  @Transform(({ value }) => toNumber(value))
  maxUsers: number;

  @ApiProperty()
  @IsEmail()
  @Transform(({ value }) => value.trim())
  tenantMasterAdminEmail: string;
}

export class CompanyReqDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  name: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => CompanyBillingContactReqDto)
  @IsNotEmpty()
  billingContact: CompanyBillingContactReqDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => CompanyTenantReqDto)
  @IsNotEmpty()
  companyTenant: CompanyTenantReqDto;
}
