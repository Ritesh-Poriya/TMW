export const mongoDBConfig = async () => {
  if (!process.env.DB_HOST) {
    throw new Error('DB_HOST is not defined');
  }
  if (!process.env.DB_PORT) {
    throw new Error('DB_PORT is not defined');
  }
  if (!process.env.DB_USERNAME) {
    throw new Error('DB_USERNAME is not defined');
  }
  if (!process.env.DB_PASSWORD) {
    throw new Error('DB_PASSWORD is not defined');
  }
  if (!process.env.DB_NAME) {
    throw new Error('DB_NAME is not defined');
  }

  return {
    url: `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}?authSource=admin`,
    name: process.env.DB_NAME,
  };
};
