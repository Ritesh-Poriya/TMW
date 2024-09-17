import { Readable } from 'stream';
import { Storage } from '../@types';
import {
  File,
  Storage as GCPStorageClient,
  GetFilesResponse,
} from '@google-cloud/storage';
import { logAround } from 'src/app/logger/decorator/log-around';

export class GCPStorage implements Storage {
  constructor(
    private readonly gcpStorageClient: GCPStorageClient,
    private readonly bucket: string,
  ) {}

  @logAround({ ignoreArgs: true })
  async save(
    stream: Readable | Buffer | string,
    filePath: string,
  ): Promise<string> {
    try {
      await this.gcpStorageClient
        .bucket(this.bucket)
        .file(filePath)
        .save(stream);
      return filePath;
    } catch (error) {
      console.error(error);
      throw new Error('Error uploading file');
    }
  }

  @logAround()
  async delete(file: string): Promise<void> {
    try {
      await this.gcpStorageClient.bucket(this.bucket).file(file).delete();
    } catch (error) {
      throw new Error('Error deleting file');
    }
  }

  @logAround()
  async move(oldPath: string, newPath: string): Promise<void> {
    try {
      await this.gcpStorageClient
        .bucket(this.bucket)
        .file(oldPath)
        .move(newPath);
    } catch (error) {
      throw new Error('Error moving file');
    }
  }

  @logAround()
  async copy(oldPath: string, newPath: string): Promise<void> {
    try {
      await this.gcpStorageClient
        .bucket(this.bucket)
        .file(oldPath)
        .copy(newPath);
    } catch (error) {
      throw new Error('Error copying file');
    }
  }

  @logAround({ ignoreReturn: true })
  async getFileStream(filePath: string): Promise<Readable> {
    try {
      const stream = await this.gcpStorageClient
        .bucket(this.bucket)
        .file(filePath)
        .createReadStream();
      return stream;
    } catch (error) {
      throw new Error('Error getting file stream');
    }
  }

  @logAround()
  async listFiles(path: string): Promise<string[]> {
    try {
      const files: GetFilesResponse = await this.gcpStorageClient
        .bucket(this.bucket)
        .getFiles({ prefix: path });
      return files.map((file: File) => file.name);
    } catch (error) {
      throw new Error('Error listing files');
    }
  }

  @logAround({ ignoreReturn: true })
  public async getInputStream(
    fileName: string,
    startPosition: number,
    chunkSize: number,
  ) {
    return this.gcpStorageClient
      .bucket(this.bucket)
      .file(fileName)
      .createReadStream({
        start: startPosition,
        end: startPosition + chunkSize,
      });
  }

  @logAround()
  public async createUploadSignedUrl(
    fileName: string,
    contentType: string,
  ): Promise<string> {
    const [url] = await this.gcpStorageClient
      .bucket(this.bucket)
      .file(fileName)
      .getSignedUrl({
        version: 'v4',
        action: 'write',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        contentType: contentType,
      });
    return url;
  }

  @logAround()
  public async createReadSignedUrl(fileName: string): Promise<string> {
    const [url] = await this.gcpStorageClient
      .bucket(this.bucket)
      .file(fileName)
      .getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      });
    return url;
  }
}
