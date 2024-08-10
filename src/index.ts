import express from 'express';
import { Telegraf } from 'telegraf';
import { type User } from 'telegraf/typings/core/types/typegram';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes/index';
import * as mongoose from 'mongoose';
import { handleError } from './utils/handleError';
import UserModel from './models/user';
import { type IUserInput } from './interfaces';

dotenv.config();

const app = express();
const SERVER_PORT: number = parseInt(process.env.SERVER_PORT ?? '8080', 10);
const token: string = process.env.TELEGRAM_TOKEN ?? '';

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(express.json());
app.use('/api/uploads', express.static('uploads'));
app.use('/api', router);

const bot = new Telegraf(token);

bot.start(async (ctx) => {
  if (!ctx.message?.from) {
    return;
  }
  console.log(ctx.message.from);
  const incomeUser: User = ctx.message?.from;
  const dataUser: IUserInput = {
    id: incomeUser.id.toString(),
    username: incomeUser.username ?? '',
    first_name: incomeUser.first_name ?? '',
    last_name: incomeUser.last_name ?? '',
    score: 0,
    dailyScore: 0,
    monthlyScore: 0,
    lastUpdated: new Date().toISOString().split('T')[0],
    lastUpdatedMonthly: new Date().toISOString().split('T')[0].slice(0, 7),
    availableLines: 100,
  };
  console.log('dataUser', dataUser);
  const { id } = dataUser;
  try {
    console.log('id при ініціалізації', id);
    let user = await UserModel.findOne({ id });
    if (user == null) {
      user = new UserModel(dataUser);
      console.log('new user', user);
      await user.save();
      await ctx.reply(
        `${dataUser.first_name ?? ''} ${dataUser.last_name ?? ''} welcome to the game!`,
      );
    } else {
      await ctx.reply(
        `${dataUser.first_name ?? ''} ${dataUser.last_name ?? ''} welcome back to the game!`,
      );
    }
    const frontUrl = 'https://rokokos97.github.io/gala-clicker/';
    await ctx.reply('Click the button below to start playing.', {
      reply_markup: {
        inline_keyboard: [[{ text: 'Play Now', web_app: { url: frontUrl } }]],
      },
    });
  } catch (error) {
    handleError(error);
  }
});

bot.on('text', async (ctx) => {
  await ctx.reply(
    'Currently, only the game option is available. Click the "Play Game" button below to start.',
  );
});

bot.launch();

async function start(): Promise<void> {
  try {
    await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING ?? '');
    console.log('Database connected');
    app.listen(SERVER_PORT, () => {
      console.log(`Server is running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
start();
