import express, { Request, Response } from 'express';
import UserModel from '../models/user';
import { handleError } from '../utils/handleError';

const usersRouter = express.Router({ mergeParams: true });

usersRouter.get('/', async (req: Request, res: Response) => {
  try {
    const usersList = await UserModel.find();
    res.status(200).send(usersList);
  } catch (error) {
    return handleError(error);
  }
});

usersRouter.get('/:userId', async (req: Request, res: Response) => {
  const id:string = req.params.userId;
  try {
    const existingUser = await UserModel.findOne({id});
    if (!existingUser) {
      return res.status(404).send({
        response: {
          message: 'USER_NOT_FOUND',
          code: 400,
        }
      })
    }
    res.status(200).json(existingUser);
  } catch (error) {
    return handleError(error);
  }
});
usersRouter.put('/:userId', async (req: Request, res: Response) => {
  const id: string = req.params.userId;
  try {
    let user = await UserModel.findOneAndUpdate({id}, req.body, {new: true})
    if (!user) {
      return res.status(404).send({
        response: {
          message: 'USER_NOT_FOUND',
          code: 400,
        }
      })
    }
    return  res.status(200).send({
              response: {
                message: 'USER_UPDATED_SUCCESSFULLY',
                code: 200,
              }
            });
  } catch (error) {
    return handleError(error);
  }
});
export default usersRouter;
