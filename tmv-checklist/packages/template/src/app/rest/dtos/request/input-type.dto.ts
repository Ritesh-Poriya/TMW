import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsString } from 'class-validator';

export class InputTypeReqDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsJSON()
  @ApiProperty()
  options: string;
}
