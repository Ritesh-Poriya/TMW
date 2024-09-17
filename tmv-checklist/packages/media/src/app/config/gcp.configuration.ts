import { GcpBucketOptions } from '../gcp-bucket/@types';

export const gcpConfiguration = () => {
  if (!process.env.GCP_SERVICE_ACCOUNT_KEY_PATH) {
    throw new Error('GCP_SERVICE_ACCOUNT_KEY_PATH is not defined');
  }
  if (!process.env.GCP_BUCKET_NAME) {
    throw new Error('GCP_BUCKET_NAME is not defined');
  }
  return {
    gcpConfig: {
      keyFilename: process.env.GCP_SERVICE_ACCOUNT_KEY_PATH,
    } as GcpBucketOptions,
    bucketName: process.env.GCP_BUCKET_NAME,
  };
};
