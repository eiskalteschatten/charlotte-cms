import { Sequelize } from 'sequelize-typescript';
import { setupMigration, migrate } from 'sequelize-migration-wrapper';
import path from 'path';

import logger from '@/lib/logger';

import models from './models';

const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: process.env.DB_SSL === 'true',
  dialect: 'mariadb',
  models,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

export default sequelize;

setupMigration({
  sequelize,
  path: path.resolve(__dirname, './migrations'),
  filePattern: /\.ts|\.js$/,
});

if (process.env.SEED_TEST_DATA === 'true') {
  setupMigration({
    sequelize,
    path: path.resolve(__dirname, './seeds'),
    filePattern: /\.ts|\.js$/,
  });
}

export async function setupSequelize(): Promise<Sequelize> {
  try {
    await sequelize.authenticate();
    logger.info('The connection to the database has been established successfully.');

    if (process.env.DISABLE_DB_MIGRATION !== 'true') {
      await migrate();
      logger.info('Database migration scripts successfully executed.');
    }
  }
  catch (error) {
    logger.error('Unable to connect to the database: ' + error);
  }

  return sequelize;
}
