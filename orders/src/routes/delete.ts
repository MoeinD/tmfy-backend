import express, { Request, Response } from 'express';
import { Order, OrderStatus } from '../models/order';
import { requireAuth, NotFoundError, NotAuthorizedError } from '@tmfyticket/common';


const router = express.Router();

router.delete('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
    /**we do not want to delete the order and
     * just want to cancel the order
     */
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    /**check if we do not have the order send the not found  */
    if (!order)
        throw new NotFoundError();
    /**check if the order request by the not the owner  */
    if (order.userId !== req.currentUser!.id)
        throw new NotAuthorizedError();
    order.status = OrderStatus.Canceled;
    await order.save();
    res.status(204).send(order);
})

export { router as deleteOrderRouter };