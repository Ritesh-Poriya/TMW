import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MediaService } from '../media/media.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { SignedFileUploadRequestDTO } from './dtos/requests';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Media')
@Controller()
export class MediaController {
  private readonly DEFAULT_CHUNK_SIZE: number;
  constructor(
    private readonly mediaService: MediaService,
    readonly configService: ConfigService,
  ) {
    this.DEFAULT_CHUNK_SIZE = this.configService.get<number>(
      'streamingConfig.defaultChunkSize',
    );
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.mediaService.uploadFile(file);
  }

  @Post('signed-upload')
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully created.',
    type: SignedFileUploadRequestDTO,
  })
  async signedUpload(@Body() body: SignedFileUploadRequestDTO) {
    return this.mediaService.signedUpload(body);
  }

  @Get('signed-url/:filename')
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully created.',
    type: String,
  })
  async signedUrl(@Param('filename') filename: string) {
    return this.mediaService.signedUrl(filename);
  }

  @Get(':filename')
  async serveAvatar(@Param('filename') file: string, @Res() res: Response) {
    const fileReadStream = await this.mediaService.getFileStream(file);
    fileReadStream.pipe(res);
  }
}
