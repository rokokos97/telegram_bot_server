import { Sequelize } from 'sequelize';
import { env, CONFIG } from './config';
import chalk from 'chalk';

export const sequelize = new Sequelize(env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  pool: CONFIG.database.pool,
  retry: CONFIG.database.retry,
  logging: process.env.NODE_ENV !== 'production',
});

export async function initDatabase(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log(chalk.green('Database connection has been established successfully.'));
    await sequelize.sync();
    console.log('Database models synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
}
