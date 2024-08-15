declare namespace NodeJS {
  interface ProcessEnv {
    TELEGRAM_TOKEN: string;
    BOT_PORT: string;
    DB_PORT: string;
    MONGO_DB_CONNECTION_STRING: string;
    MYSQL_DB_NAME: string;
    MYSQL_DB_USER: string;
    MYSQL_DB_PASSWORD: string;
    MYSQL_DB_HOST: string;
  }
}
