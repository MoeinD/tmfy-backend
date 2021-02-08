import express, { Request, Response } from 'express';
import { requireAuth } from '@tmfyticket/common';
import { Order } from '../models/order';




const router = express.Router();

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
    /**populate will asociate the ticket with the order */
    const orders = await Order.find({
        userId: req.currentUser!.id
    }).populate('ticket');

    res.send(orders);
})

export { router as indexOrderRouter };