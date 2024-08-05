declare namespace NodeJS {
    interface ProcessEnv {
        PORT: string;
        TELEGRAM_TOKEN: string;
        NODE_ENV: 'development' | 'production' | 'test';
    }
}
