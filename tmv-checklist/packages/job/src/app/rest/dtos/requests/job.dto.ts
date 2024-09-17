import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CustomerReqDto {
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
  @IsString()
  @IsNotEmpty()
  serviceAddress: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  billingAddress: string;

  @ApiProperty()
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  phoneNumber: string;
}

export class JobReqDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  templateId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  templateName: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  jobNumber: number;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  checklistSchema: object;

  @ApiProperty()
  @ValidateNested()
  @Type(() => CustomerReqDto)
  @IsNotEmpty()
  jobCustomer: CustomerReqDto;
}
