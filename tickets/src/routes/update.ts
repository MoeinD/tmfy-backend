import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, NotFoundError, requireAuth, NotAuthorizedError, BadRequestError } from '@tmfyticket/common';
import { Ticket } from '../models/tickets';
import { TicketUpdatePublisher } from '../events/publishers/ticket-update-publisher';
import { natsWrapper } from '../nats-wrapper';


const router = express.Router();

router.put('/api/tickets/:id', requireAuth,
    [body('title').not().isEmpty().withMessage('Title is required'), body('price').isFloat({ gt: 0 }).withMessage('Price must be provided and must greater that zero')], validateRequest
    , async (req: Request, res: Response) => {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket)
            throw new NotFoundError();

        if (ticket.orderId)
            throw new BadRequestError('Ticket has been reserved');

        if (ticket.userId !== req.currentUser!.id)
            throw new NotAuthorizedError();

        ticket.set({ title: req.body.title, price: req.body.price });
        await ticket.save();
        /**publish the event */
        new TicketUpdatePublisher(natsWrapper.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            version: ticket.version
        })
        res.send(ticket);
    })

export { router as updateTicketRouter };