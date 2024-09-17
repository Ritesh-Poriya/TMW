import { ApiResponseProperty } from '@nestjs/swagger';

export class InputTypeResDto {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty()
  options: string;
}
