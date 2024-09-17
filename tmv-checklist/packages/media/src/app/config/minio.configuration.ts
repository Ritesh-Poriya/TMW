import * as Minio from 'minio';

export const minioConfig = () => {
  if (!process.env.MINIO_HOST) {
    throw new Error('MINIO_HOST is not defined');
  }
  if (!process.env.MINIO_PORT) {
    throw new Error('MINIO_PORT is not defined');
  }
  if (!process.env.MINIO_ACCESS_KEY) {
    throw new Error('MINIO_ACCESS_KEY is not defined');
  }
  if (!process.env.MINIO_ACCESS_KEY_SECRET) {
    throw new Error('MINIO_ACCESS_KEY_SECRET is not defined');
  }
  if (!process.env.MINIO_BUCKET_NAME) {
    throw new Error('MINIO_BUCKET_NAME is not defined');
  }
  return {
    minioConfig: {
      endPoint: process.env.MINIO_HOST,
      port: Number(process.env.MINIO_PORT),
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_ACCESS_KEY_SECRET,
    } as Minio.ClientOptions,
    minioBucket: process.env.MINIO_BUCKET_NAME,
  };
};
