import { cleanEnv, str, port, url } from 'envalid';
import dotenv from 'dotenv';

dotenv.config();

export const env = cleanEnv(process.env, {
  SERVER_PORT: port({ default: 8888 }),
  TELEGRAM_TOKEN_GALA: str(),
  TELEGRAM_TOKEN_TRICALC: str(),
  DATABASE_URL: str(),
  FRONT_URL: url({ default: 'https://rokokos97.github.io/gala-clicker' }),
  FRONT_URL_TRICALC: url({ default: 'https://rokokos97.github.io/tricalc/' }),
});

export const CONFIG = {
  database: {
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    retry: {
      max: 3
    }
  },
  cors: {
    // In production, this should be replaced with specific origins
    origin: process.env.NODE_ENV === 'production' ? process.env.ALLOWED_ORIGINS?.split(',') : '*',
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization'
  } as const,
  user: {
    defaultAvailableLines: 100
  }
} as const;
