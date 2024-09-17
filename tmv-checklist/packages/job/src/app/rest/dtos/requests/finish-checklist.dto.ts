import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class FinishChecklistReqDto {
  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  checklistResponse: object;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  techSummery: string;
}
