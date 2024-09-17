import * as path from 'path';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

if (process.env.NODE_ENV === 'local') {
  dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });
}

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [path.join(__dirname, '..', 'template', '**', '*.entity.{ts,js}')],
  migrations: ['./migrations/*.ts'],
  migrationsTableName: process.env.DB_MIGRATION_TABLE_NAME,
  logging: true,
  migrationsTransactionMode: 'each',
});
