import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SupportReqDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;
}
