import express from 'express';
import cors from 'cors';
import router from './routes/index';
import { initDatabase, sequelize } from './database';
import path from 'path';
import { CONFIG, env } from './config';
import { createGalaClickerBot } from './bots/galaClicker';
import { createTriCalcBot } from './bots/tricalc';
import chalk from 'chalk';


const app = express();
const bot = createGalaClickerBot();
const botTricalc = createTriCalcBot();

// Middleware
app.use(cors(CONFIG.cors));
app.use(express.json());
app.use('/api', router);

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Health check endpoint
app.get('/health', (_, res) => {
  res.status(200).json({ status: 'OK' });
});

async function start(): Promise<void> {
  try {
    try {
      await initDatabase();
      console.log(chalk.green('Database connected successfully'));
      bot.launch();
    } catch (error: any) {
      console.error('Database connection failed:', error?.message || 'Unknown error');
    }
    console.log(chalk.green(`Server starting on PORT ${env.SERVER_PORT}`));
    // try {
    //   await Promise.all([
    //     bot.launch(),
    //     botTricalc.launch()
    //   ]);
    //   console.log('Bots started successfully');
    // } catch (error: any) {
    //   console.error('Failed to start bots:', error?.message || 'Unknown error');
    // }
    const server = app.listen(env.SERVER_PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${env.SERVER_PORT}`);
    });
    server.on('error', (error: Error & { code?: string }) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${env.SERVER_PORT} is already in use`);
      } else {
        console.error('Error starting server:', error);
      }
      process.exit(1);
    });

    // Graceful shutdown
    const shutdown = async () => {
      console.log('Shutting down gracefully...');
      bot.stop('SIGTERM');
      botTricalc.stop('SIGTERM');
      await sequelize.close();
      process.exit(0);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('Failed to start the application:', error);
    process.exit(1);
  }
}

// Start the application
start().catch((error) => {
  console.error('Unhandled error during startup:', error);
  process.exit(1);
});
