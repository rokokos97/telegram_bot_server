import { Context, Telegraf } from 'telegraf';
import { handleError } from '../utils/handleError';
import { env } from '../config';

export const createTriCalcBot = () => {
  const bot = new Telegraf(env.TELEGRAM_TOKEN_TRICALC);

  bot.start(async (ctx: Context) => {
    try {
      await ctx.reply('WELCOME TO TRICALC!');
      await ctx.reply('Click the button below to start calculate.', {
        reply_markup: {
          inline_keyboard: [[{ text: 'Calculate', web_app: { url: env.FRONT_URL_TRICALC } }]],
        },
      });
    } catch (error) {
      console.error('Error in botTricalc.start():', error);
      handleError(error);
    }
  });

  return bot;
};
