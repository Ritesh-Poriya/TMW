import * as Minio from 'minio';
import { MinioStorage } from './implementations/minio.storage';
import { GCPStorage } from './implementations/gcp.storage';
import { Storage as GCPStorageClient } from '@google-cloud/storage';

export class StorageFactory {
  static minioStorage(client: Minio.Client, bucketName: string) {
    return new MinioStorage(client, bucketName);
  }

  static gcpStorage(client: GCPStorageClient, bucketName: string) {
    return new GCPStorage(client, bucketName);
  }
}
