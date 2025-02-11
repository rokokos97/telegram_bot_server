import { Context, Telegraf } from 'telegraf';
import { User } from 'telegraf/typings/core/types/typegram';
import { handleError } from '../utils/handleError';
import UserModel from '../models/user';
import { IUserInput } from '../interfaces';
import { CONFIG, env } from '../config';
import chalk from 'chalk';

export const createGalaClickerBot = () => {
  const bot = new Telegraf(env.TELEGRAM_TOKEN_GALA);

  bot.start(async (ctx: Context) => {
    console.log(chalk.green('Gala-clicker bot was running...'))
    if (!ctx.message?.from) {
      await ctx.reply('Sorry, there was an error processing your request.');
      return;
    }

    const incomeUser: User = ctx.message.from;
    const dataUser: IUserInput = {
      external_id_telegram: incomeUser.id.toString(),
      username: incomeUser.username ?? 'Unknown',
      first_name: incomeUser.first_name ?? 'Unknown',
      last_name: incomeUser.last_name ?? 'Unknown',
      score: 0,
      dailyScore: 0,
      monthlyScore: 0,
      lastUpdated: new Date().toISOString().split('T')[0],
      lastUpdatedMonthly: new Date().toISOString().split('T')[0].slice(0, 7),
      availableLines: CONFIG.user.defaultAvailableLines,
    };

    try {
      await ctx.reply('WELCOME TO GALA-CLICKER!');
      let user = await UserModel.findOne({
        where: { external_id_telegram: dataUser.external_id_telegram },
      });

      if (!user) {
        user = await UserModel.create(dataUser as any);  // TODO: Fix type definition
      } else {
        await ctx.reply(
          `${dataUser.first_name} ${dataUser.last_name} welcome back to the game!`,
        );
      }

      await ctx.reply('Click the button below to start playing.', {
        reply_markup: {
          inline_keyboard: [[{ text: 'Play Now', web_app: { url: env.FRONT_URL } }]],
        },
      });
    } catch (error) {
      console.error('Error in bot.start():', error);
      handleError(error);
      await ctx.reply('Sorry, there was an error processing your request. Please try again later.');
    }
  });

  bot.on('text', async (ctx: Context) => {
    try {
      await ctx.reply(
        'Currently, only the game option is available. Click the "Play Game" button below to start.',
      );
    } catch (error) {
      console.error('Error handling text message:', error);
      handleError(error);
    }
  });

  return bot;
};
