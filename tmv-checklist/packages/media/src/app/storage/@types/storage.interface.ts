import { Readable } from 'stream';

export interface Storage {
  getInputStream(
    fileName: string,
    startPosition: number,
    chunkSize: number,
  ): Promise<Readable>;
  save(stream: Readable | Buffer | string, filePath: string): Promise<string>;
  delete(filePath: string): Promise<void>;
  move(oldPath: string, newPath: string): Promise<void>;
  copy(oldPath: string, newPath: string): Promise<void>;
  getFileStream(filePath: string): Promise<Readable>;
  listFiles(path: string): Promise<string[]>;
  createUploadSignedUrl(fileName: string, contentType: string): Promise<string>;
  createReadSignedUrl(fileName: string): Promise<string>;
}
