import { ApiResponseProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString } from 'class-validator';
import { PaginationMetaDto } from 'src/app/common/pagination';

export class CustomerResDto {
  @ApiResponseProperty()
  @IsString()
  id: string;

  @ApiResponseProperty()
  @IsString()
  firstName: string;

  @ApiResponseProperty()
  @IsString()
  lastName: string;

  @ApiResponseProperty()
  @IsString()
  serviceAddress: string;

  @ApiResponseProperty()
  @IsString()
  billingAddress: string;

  @ApiResponseProperty()
  @IsString()
  phoneNumber: string;
}

export class technicianResDto {
  @ApiResponseProperty()
  @IsString()
  firstName: string;

  @ApiResponseProperty()
  @IsString()
  lastName: string;
}

export class JobResDto {
  @ApiResponseProperty()
  @IsString()
  id: string;

  @ApiResponseProperty()
  @IsString()
  templateId: string;

  @ApiResponseProperty()
  @IsString()
  templateName: string;

  @ApiResponseProperty()
  @IsDateString()
  date: Date;

  @ApiResponseProperty()
  @IsString()
  status: string;

  @ApiResponseProperty()
  @IsNumber()
  jobNumber: number;

  @ApiResponseProperty()
  @IsString()
  techSummery: string;

  @ApiResponseProperty()
  @IsString()
  technicianSinature: string;

  @ApiResponseProperty()
  @IsString()
  customerSignature: string;

  @ApiResponseProperty()
  @IsString()
  agreedUponNextStep: string;

  @ApiResponseProperty({ type: CustomerResDto })
  jobCustomer: CustomerResDto;

  @ApiResponseProperty()
  jobTechnician: technicianResDto;

  @ApiResponseProperty()
  checklistSchema: object;

  @ApiResponseProperty()
  checklistResponse: object;

  @ApiResponseProperty()
  createdAt: Date;

  @ApiResponseProperty()
  updatedAt: Date;
}

export class GetAllJobAPIResponse {
  @ApiResponseProperty({ type: [JobResDto] })
  items: JobResDto[];

  @ApiResponseProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
