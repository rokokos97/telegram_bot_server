import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
  process.env.MYSQL_DB_NAME ?? '',
  process.env.MYSQL_DB_USER ?? '',
  process.env.MYSQL_DB_PASSWORD ?? '',
  {
    host: process.env.MYSQL_DB_HOST ?? '',
    dialect: 'mysql',
  },
);
