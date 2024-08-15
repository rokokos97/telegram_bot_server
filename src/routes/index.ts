import express from 'express';
import usersRoutes from './users.routes';
import levelsRoutes from './levels.routes';

const router = express.Router({ mergeParams: true });

router.use('/users', usersRoutes);
router.use('/levels', levelsRoutes);

export default router;
