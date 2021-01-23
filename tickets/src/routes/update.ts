import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validationRequest, NotFoundError, requireAuth, NotAuthorizedError } from '@tmfyticket/common';
import { Ticket } from '../models/tickets';

const router = express.Router();

router.put('/api/tickets/:id', requireAuth,
    [body('title').not().isEmpty().withMessage('Title is required'), body('price').isFloat({ gt: 0 }).withMessage('Price must be provided and must greater that zero')], validationRequest
    , async (req: Request, res: Response) => {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket)
            throw new NotFoundError();

        if (ticket.userId !== req.currentUser!.id)
            throw new NotAuthorizedError();

        ticket.set({ title: req.body.title, price: req.body.title });

        res.send(ticket);
    })

export { router as updateTicketRouter };