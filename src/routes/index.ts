import express from 'express';
import usersRoutes from './users.routes';

const router = express.Router({ mergeParams: true });

router.use('/users', usersRoutes);

export default router;
