import { ApiProperty } from '@nestjs/swagger';

export class SignedFileUploadRequestDTO {
  @ApiProperty()
  fileName: string;
  @ApiProperty()
  contentType: string;
}
