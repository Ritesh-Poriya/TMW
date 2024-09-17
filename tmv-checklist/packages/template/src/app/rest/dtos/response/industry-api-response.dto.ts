import { ApiResponseProperty } from '@nestjs/swagger';

export class IndustryResponseType {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty()
  description: string;

  @ApiResponseProperty()
  logoUrl: string;
}
