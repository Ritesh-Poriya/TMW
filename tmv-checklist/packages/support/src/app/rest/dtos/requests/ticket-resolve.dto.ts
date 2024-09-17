import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TicketResolveReqDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  resolveNote: string;
}
