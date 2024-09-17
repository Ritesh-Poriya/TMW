import { ApiResponseProperty } from '@nestjs/swagger';

export class SupportResDto {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  message: string;

  @ApiResponseProperty()
  raisedBy: string;

  @ApiResponseProperty()
  status: string;

  @ApiResponseProperty()
  createdAt: Date;
}
