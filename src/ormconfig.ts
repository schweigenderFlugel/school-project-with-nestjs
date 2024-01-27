import { DataSourceOptions } from 'typeorm';
import { ENVIRONMENTS } from './environments';

const production: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  migrations: ['./data/migrations/**/*.ts'],
  synchronize: false,
};

const development: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  migrations: ['./data/migrations/**/*.ts'],
  synchronize: true,
};

const automatedTests: DataSourceOptions = {
  type: 'better-sqlite3',
  database: `data/tests/test.${Math.random}.sqlite`,
  migrations: ['./data/migration'],
  synchronize: true,
  dropSchema: true,
  verbose: console.log,
};

export const dataSourceOption: DataSourceOptions = (() => {
  if (process.env.NODE_ENV === ENVIRONMENTS.PRODUCTION) {
    return production;
  }

  if (process.env.NODE_ENV === ENVIRONMENTS.DEVELOPMENT) {
    return development;
  }

  if (process.env.NODE_ENV === ENVIRONMENTS.AUTOMATED_TESTS) {
    return automatedTests;
  }
})();
