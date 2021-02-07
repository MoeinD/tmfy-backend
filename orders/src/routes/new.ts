import express, { Request, Response } from 'express';
import { requireAuth, validationRequest } from '@tmfyticket/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/api/orders', requireAuth, [
    body('ticketId')
        .not()
        .isEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('TicketId must be porovide')
], validationRequest, async (req: Request, res: Response) => {

    res.send({});
})

export { router as newOrderRouter };