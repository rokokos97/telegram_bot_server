import express, { type Request, type Response } from 'express';
import LevelModel from '../models/level';
import { type ILevel } from '../interfaces';
import { handleError } from '../utils/handleError';
import { type Model } from 'sequelize';

type LevelInterface = Model<ILevel>;

const levelsRouter = express.Router({ mergeParams: true });

levelsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const LevelsList = await LevelModel.findAll();
    console.log('levels', LevelsList);

    res.status(200).send(LevelsList);
  } catch (error) {
    console.log('error', error);
    return handleError(error);
  }
});

levelsRouter.post('/', async (req: Request, res: Response) => {
  const newLevel: ILevel = req.body as ILevel;
  const id: string = newLevel.external_id;
  try {
    const existingLevel: LevelInterface | null = await LevelModel.findOne({
      where: { external_id: id },
    });
    if (existingLevel == null) {
      const createdLevel: LevelInterface = await LevelModel.create({
        ...newLevel,
      });
      return res.status(201).send({
        response: {
          message: 'LEVEL_CREATED_SUCCESSFULLY',
          code: 201,
          data: createdLevel,
        },
      });
    }
    return res.status(200).send({
      response: {
        message: 'LEVEL_ALREADY_EXISTS',
        code: 200,
      },
    });
  } catch (error) {
    return handleError(error);
  }
});
levelsRouter.delete('/:id', async (req: Request, res: Response) => {
  const levelId: string = req.params.id;
  try {
    const existingLevel: LevelInterface | null = await LevelModel.findOne({
      where: { external_id: levelId },
    });
    if (existingLevel == null) {
      return res.status(404).send({
        response: {
          message: 'LEVEL_NOT_FOUND',
          code: 404,
        },
      });
    }
    await existingLevel.destroy();
    return res.status(200).send({
      response: {
        message: 'LEVEL_DELETED',
        code: 200,
      },
    });
  } catch (error) {
    return handleError(error);
  }
});

levelsRouter.delete('/:id', async (req: Request, res: Response) => {
  const levelId: string = req.params.id;
  const updatedLevel: ILevel = req.body as ILevel;
  try {
    const existingLevel: LevelInterface | null = await LevelModel.findOne({
      where: { external_id: levelId },
    });
    if (existingLevel == null) {
      return res.status(404).send({
        response: {
          message: 'LEVEL_NOT_FOUND',
          code: 404,
        },
      });
    }
    await existingLevel.update({
      ...updatedLevel,
    });
    return res.status(200).send({
      response: {
        message: 'LEVEL_UPDATED',
        code: 200,
      },
    });
  } catch (error) {
    return handleError(error);
  }
});

export default levelsRouter;
