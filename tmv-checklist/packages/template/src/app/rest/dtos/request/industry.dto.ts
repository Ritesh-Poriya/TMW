import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class IndustryRequestBody {
  @IsString()
  @ApiProperty()
  name: string;
  @IsString()
  @ApiProperty()
  description: string;
  @IsString()
  @ApiProperty()
  logoUrl: string;
}
