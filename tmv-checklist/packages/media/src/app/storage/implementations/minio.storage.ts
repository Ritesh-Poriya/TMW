import * as Minio from 'minio';

import { Storage } from '../@types';
import { Readable } from 'stream';
import { logAround } from 'src/app/logger/decorator/log-around';

export class MinioStorage implements Storage {
  constructor(
    private readonly minioClient: Minio.Client,
    private readonly bucket: string,
  ) {}

  @logAround({ ignoreArgs: true })
  async save(
    stream: Readable | Buffer | string,
    filePath: string,
  ): Promise<string> {
    try {
      const url = await this.minioClient.putObject(
        this.bucket,
        filePath,
        stream,
      );
      return url.etag;
    } catch (error) {
      console.error(error);
      throw new Error('Error uploading file');
    }
  }

  @logAround()
  async delete(file: string): Promise<void> {
    try {
      await this.minioClient.removeObject(this.bucket, file);
    } catch (error) {
      throw new Error('Error deleting file');
    }
  }

  @logAround()
  async move(oldPath: string, newPath: string): Promise<void> {
    try {
      await this.minioClient.copyObject(
        this.bucket,
        newPath,
        oldPath,
        new Minio.CopyConditions(),
      );
      await this.minioClient.removeObject(this.bucket, oldPath);
    } catch (error) {
      throw new Error('Error moving file');
    }
  }

  @logAround()
  async copy(oldPath: string, newPath: string): Promise<void> {
    try {
      await this.minioClient.copyObject(
        this.bucket,
        newPath,
        oldPath,
        new Minio.CopyConditions(),
      );
    } catch (error) {
      throw new Error('Error copying file');
    }
  }

  @logAround({ ignoreReturn: true })
  async getFileStream(filePath: string): Promise<Readable> {
    try {
      const stream = await this.minioClient.getObject(this.bucket, filePath);
      return stream;
    } catch (error) {
      throw new Error('Error getting file stream');
    }
  }

  @logAround()
  async listFiles(path: string): Promise<string[]> {
    try {
      const files = await this.listObjects(this.bucket, path, true);
      return files.map((file) => file.name);
    } catch (error) {
      throw new Error('Error listing files');
    }
  }

  @logAround()
  private async listObjects(
    bucket: string,
    prefix: string,
    recursive: boolean,
  ): Promise<Minio.BucketItem[]> {
    return new Promise((resolve, reject) => {
      const bucketStream = this.minioClient.listObjectsV2(
        bucket,
        prefix,
        recursive,
      );
      const files = [];
      bucketStream.on('data', (obj) => {
        files.push(obj);
      });
      bucketStream.on('end', () => {
        resolve(files);
      });
      bucketStream.on('error', (error) => {
        reject(error);
      });
    });
  }

  @logAround({ ignoreReturn: true })
  public async getInputStream(
    fileName: string,
    startPosition: number,
    chunkSize: number,
  ) {
    return this.minioClient.getPartialObject(
      this.bucket,
      fileName,
      startPosition,
      chunkSize,
    );
  }

  @logAround()
  public async createUploadSignedUrl(fileName: string): Promise<string> {
    return this.minioClient.presignedPutObject(this.bucket, fileName, 15 * 60);
  }

  @logAround()
  public async createReadSignedUrl(fileName: string): Promise<string> {
    return this.minioClient.presignedGetObject(this.bucket, fileName, 15 * 60);
  }
}
