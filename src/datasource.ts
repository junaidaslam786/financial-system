
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config(); // Loads .env into process.env

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false, // Always false for migrations
  logging: process.env.DATABASE_LOGGING === 'false',
  entities: [join(__dirname, '**', '*.entity.{js,ts}')],
  migrations: [join(__dirname, 'database/migrations/*{.js,.ts}')],
});

export default AppDataSource;
