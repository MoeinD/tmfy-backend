import express, { Request, Response } from 'express';
import { requireAuth, validateRequest, NotFoundError, OrderStatus, NotAuthorizedError, BadRequestError } from '@tmfyticket/common';
import { body } from 'express-validator';
import { Order } from '../models/order';
import { stripe } from '../stripe';
import { Payment } from '../models/payments';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

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

        const charge = await stripe.charges.create({
            currency: 'usd',
            amount: order.price * 100,
            source: token
        })

        /**save the payments */
        const payment = Payment.build({
            orderId,
            stripeId: charge.id
        })

        await payment.save();

        await new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment.id,
            orderId: payment.orderId,
            stripeId: payment.stripeId
        })

        res.status(201).send({ id: payment.id });
    })

export { router as createChargeRouter };