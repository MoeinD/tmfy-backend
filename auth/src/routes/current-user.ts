import express from 'express';
import jwt from 'jsonwebtoken';

import { crrentUser } from '../middlewares/current-user';

const router = express.Router();

router.get('/api/users/currentuser', crrentUser, (req, res) => {
    res.send({ crrentUser: req.currentUser || null });
})

export { router as recentUserRouter };