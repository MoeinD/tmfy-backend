import express, { Request, Response } from 'express';
import { requireAuth, validateRequest, NotFoundError, OrderStatus, NotAuthorizedError, BadRequestError } from '@tmfyticket/common';
import { body } from 'express-validator';
import { Order } from '../models/order';
import { stripe } from '../stripe';

const router = express.Router();

router.post('/api/payments',
    requireAuth,
    [
        body('token').not().isEmpty(),
        body('orderId').not().isEmpty()
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { token, orderId } = req.body;

        //first we shoud find the order
        const order = await Order.findById(orderId);

        if (!order)
            throw new NotFoundError();

        /**check if the order belong to the user */
        if (order.userId !== req.currentUser!.id)
            throw new NotAuthorizedError();

        //check the order has not been cancelled
        if (order.status === OrderStatus.Cancelled)
            throw new BadRequestError('Order has been cancelled');

        await stripe.charges.create({
            currency: 'usd',
            amount: order.price * 100,
            source: token
        })

        res.status(201).send({ success: true });
    })

export { router as createChargeRouter };