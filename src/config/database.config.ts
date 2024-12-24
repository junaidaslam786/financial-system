// src/config/database.config.ts
import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// Using `registerAs` allows you to namespace your config.
export default registerAs('database', (): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    // Set synchronize to false in production
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    logging: process.env.DATABASE_LOGGING === 'true',
    autoLoadEntities: true, // Automatically load entities if they're registered with TypeORM
    // You can also specify migrations and related configuration here if needed.
    // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    // migrations: [__dirname + '/../database/migrations/*.ts'],
    // cli: {
    //   migrationsDir: 'src/database/migrations',
    // },
  };
});
