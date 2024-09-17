import { ApiResponseProperty } from '@nestjs/swagger';

export class SignedFileUploadResponseDTO {
  @ApiResponseProperty()
  public readonly signedUrl: string;

  @ApiResponseProperty()
  public readonly fileKey: string;
}
