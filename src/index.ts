import express from 'express';
import { Telegraf } from 'telegraf';
import { type User } from 'telegraf/typings/core/types/typegram';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes/index';
import { handleError } from './utils/handleError';
import UserModel from './models/user';
import { type IUserInput } from './interfaces';
import { sequelize } from './database';
import path from 'path';

dotenv.config();

const app = express();
const SERVER_PORT: number = parseInt(process.env.SERVER_PORT ?? '8888', 10);
const token: string = process.env.TELEGRAM_TOKEN_GALA ?? '';
const tokenTricalc = process.env.TELEGRAM_TOKEN_TRICALC ?? '';

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(express.json());
// app.use('/api/uploads', express.static('uploads'));
app.use('/api', router);
app.use('/', express.static(path.join(__dirname, 'gala-clicker/dist')));
path.join(__dirname, 'gala-clicker/dist', 'index.html');

const bot: Telegraf = new Telegraf(token ?? '');
const botTricalc: Telegraf = new Telegraf(tokenTricalc ?? '');

botTricalc.start(async (ctx) => {
  await ctx.reply(`WELCOME TO TRICALC!`);
  const frontUrl: string =
    process.env.FRONT_URL_TRICALC ?? 'https://rokokos97.github.io/tricalc/';
  await ctx.reply('Click the button below to start calculate.', {
    reply_markup: {
      inline_keyboard: [[{ text: 'Calculate', web_app: { url: frontUrl } }]],
    },
  });
});

bot.start(async (ctx) => {
  // if (!ctx.message?.from) {
  //   return;
  // }
  const incomeUser: User = ctx.message?.from;
  const dataUser: IUserInput = {
    external_id_telegram: incomeUser.id.toString() ?? '007',
    username: incomeUser.username ?? 'Unknown',
    first_name: incomeUser.first_name ?? 'Unknown',
    last_name: incomeUser.last_name ?? 'Unknown',
    score: 0,
    dailyScore: 0,
    monthlyScore: 0,
    lastUpdated: new Date().toISOString().split('T')[0],
    lastUpdatedMonthly: new Date().toISOString().split('T')[0].slice(0, 7),
    availableLines: 100,
  };
  await ctx.reply(`WELCOME TO GALA-CLICKER!`);
  const externalIdTelegram: string = dataUser.external_id_telegram;
  try {
    let user = await UserModel.findOne({
      where: { external_id_telegram: externalIdTelegram },
    });
    if (user === null) {
      user = await UserModel.create({ ...dataUser });
      await user.save();
    } else {
      await ctx.reply(
        `${dataUser.first_name ?? ''} ${dataUser.last_name ?? ''} welcome back to the game!`,
      );
    }
    const frontUrl = process.env.FRONT_URL ?? 'http://127.0.0.1:8080';
    await ctx.reply('Click the button below to start playing.', {
      reply_markup: {
        inline_keyboard: [[{ text: 'Play Now', web_app: { url: frontUrl } }]],
      },
    });
  } catch (error) {
    console.error('Error in bot.start()', error);
    handleError(error);
  }
});

bot.on('text', async (ctx) => {
  await ctx.reply(
    'Currently, only the game option is available. Click the "Play Game" button below to start.',
  );
});

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bot.launch();
// eslint-disable-next-line @typescript-eslint/no-floating-promises
botTricalc.launch();

async function start(): Promise<void> {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('MySQL database connected');
    app.listen(SERVER_PORT, () => {
      console.log(`Server is running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    console.log('Database connection error', error);
    process.exit(1);
  }
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
start();
