import express, { type Request, type Response } from 'express';
import { Telegraf } from 'telegraf';
import UserModel from '../models/user';
import { handleError } from '../utils/handleError';
import { type IUser, type IUserInput } from '../interfaces';
import { Op, type Model } from 'sequelize';

const leaderbordRouter = express.Router({ mergeParams: true });
type UserInstance = Model<IUser, IUserInput>;

const token: string = process.env.TELEGRAM_TOKEN ?? '';
const bot: Telegraf = new Telegraf(token ?? '');

leaderbordRouter.get(
  '/updateLeaderBord',
  async (req: Request, res: Response) => {
    try {
      const leaderbord: UserInstance[] = await UserModel.findAll({
        order: [['score', 'DESC']],
      });

      for (let i = 0; i < leaderbord.length; i++) {
        const user = leaderbord[i];
        const newRank = i + 1;
        const previousRank = user.getDataValue('previousRank');

        if (previousRank !== newRank) {
          // Update the user's rank in the database
          await user.update({ previousRank: newRank });

          // Send notification to the user about the rank change
          sendRankChangeNotification(user.toJSON(), newRank, previousRank);
        }
        res.status(200).json({
          success: true,
          message: 'Leaderboard updated and notifications sent.',
        });
      }
    } catch (error) {
      return handleError(error);
    }
  },
);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function sendRankChangeNotification(
  user: IUser,
  newRank: number,
  previousRank: number,
) {
  const message = `Hi ${user.username}, your rank has changed from ${previousRank} to ${newRank} in the leaderboard!`;

  if (user.external_id_telegram !== undefined) {
    bot.telegram
      .sendMessage(user.external_id_telegram, message)
      .then(() => {
        console.log(`Message sent to ${user.username}`);
      })
      .catch((err) => {
        console.error(`Failed to send message to ${user.username}:`, err);
      });
  } else {
    console.log(`User ${user.username} does not have a Telegram ID.`);
  }
}

leaderbordRouter.get('/:userId', async (req: Request, res: Response) => {
  const userId: string = req.params.userId;

  try {
    const currentUser: UserInstance | null = await UserModel.findOne({
      where: { external_id_telegram: userId },
    });
    if (currentUser == null) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const topUsers: UserInstance[] = await UserModel.findAll({
      order: [['score', 'DESC']],
      limit: 9,
    });
    const cleanTopUsers: IUser[] = topUsers.map((user) => user.toJSON());
    if (currentUser !== null) {
      const currentUserRank: number = currentUser.getDataValue('previousRank');
      if (currentUserRank <= 10) {
        const leaderboard: UserInstance[] = await UserModel.findAll({
          order: [['score', 'DESC']],
          limit: 10,
        });
        const cleanLeaderboard: IUser[] = leaderboard.map((user) =>
          user.toJSON(),
        );

        return res.status(200).json({
          success: true,
          data: cleanLeaderboard,
        });
      } else {
        const leaderboard = [...cleanTopUsers, currentUser.toJSON()];
        return res.status(200).json({
          success: true,
          data: leaderboard,
        });
      }
    }
  } catch (error) {
    return handleError(error);
  }
});

export default leaderbordRouter;
