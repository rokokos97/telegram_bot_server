import express from 'express';
import usersRoutes from './users.routes';
import levelsRoutes from './levels.routes';
import leaderbordRoutes from './leaderbord.routes';

const router = express.Router({ mergeParams: true });

router.use('/users', usersRoutes);
router.use('/levels', levelsRoutes);
router.use('/leaderbord', leaderbordRoutes);

export default router;
