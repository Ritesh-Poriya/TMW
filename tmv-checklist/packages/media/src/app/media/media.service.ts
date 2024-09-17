import { Inject, Injectable } from '@nestjs/common';
import { InjectStorage } from '../storage/decorators';
import { Storage } from '../storage/@types';
import * as fs from 'fs';
import { Readable } from 'stream';
import { SignedFileUploadRequestDTO } from '../http/dtos/requests';
import { UNIQUE_FILENAME_GENERATOR } from '../unique-filename/constants';
import { UniqueFileNameGenerator } from '../unique-filename/@types';
import { SignedFileUploadResponseDTO } from '../http/dtos/responses';
import { logAround } from '../logger/decorator/log-around';

@Injectable()
export class MediaService {
  constructor(
    @InjectStorage() private readonly storage: Storage,
    @Inject(UNIQUE_FILENAME_GENERATOR)
    private readonly uniqueFilenameGenerator: UniqueFileNameGenerator,
  ) {}

  @logAround()
  async uploadFile(file: Express.Multer.File): Promise<string> {
    const readable = fs.readFileSync(file.path);
    await this.storage.save(readable, file.filename);
    fs.unlinkSync(file.path);
    return file.filename;
  }

  @logAround({ ignoreReturn: true })
  async getFileStream(file: string): Promise<Readable> {
    return this.storage.getFileStream(file);
  }

  @logAround()
  async signedUpload(
    body: SignedFileUploadRequestDTO,
  ): Promise<SignedFileUploadResponseDTO> {
    const uniqueFilename = this.uniqueFilenameGenerator.generate(body.fileName);
    const signedUrl = await this.storage.createUploadSignedUrl(
      uniqueFilename,
      body.contentType,
    );
    return {
      signedUrl,
      fileKey: uniqueFilename,
    };
  }

  @logAround()
  async signedUrl(filename: string): Promise<string> {
    return this.storage.createReadSignedUrl(filename);
  }
}
