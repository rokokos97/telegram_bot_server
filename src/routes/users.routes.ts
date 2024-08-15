import express, { type Request, type Response } from 'express';
import UserModel from '../models/user';
import { handleError } from '../utils/handleError';
import { type IUserInput, type IUser } from '../interfaces';
import { type Model } from 'sequelize';

type UserInstance = Model<IUser, IUserInput>;

const usersRouter = express.Router({ mergeParams: true });

usersRouter.get('/', async (req: Request, res: Response) => {
  try {
    const usersList = await UserModel.findAll();
    res.status(200).send(usersList);
  } catch (error) {
    return handleError(error);
  }
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
usersRouter.get('/:userId', async (req: Request, res: Response) => {
  const id: string = req.params.userId;
  try {
    const existingUser: UserInstance | null = await UserModel.findOne({
      where: { external_id_telegram: id },
    });
    if (existingUser == null) {
      return res.status(404).send({
        response: {
          message: 'USER_NOT_FOUND',
          code: 404,
        },
      });
    }
    res.status(200).json(existingUser);
  } catch (error) {
    return handleError(error);
  }
});
// eslint-disable-next-line @typescript-eslint/no-misused-promises
usersRouter.put('/:userId', async (req: Request, res: Response) => {
  const id: string = req.params.userId;
  const updatedUser: IUserInput = req.body as IUserInput;
  try {
    const existingUser: UserInstance | null = await UserModel.findOne({
      where: { external_id_telegram: id },
    });
    if (existingUser == null) {
      return res.status(404).send({
        response: {
          message: 'USER_NOT_FOUND',
          code: 404,
        },
      });
    }
    await existingUser.update(updatedUser);
    return res.status(200).send({
      response: {
        message: 'USER_UPDATED_SUCCESSFULLY',
        code: 200,
      },
    });
  } catch (error) {
    return handleError(error);
  }
});
export default usersRouter;
