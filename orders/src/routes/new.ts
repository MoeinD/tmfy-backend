import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/api/orders', async (req: Request, res: Response) => {
    const order = req.body;
    console.log('this is the order that we have recieved rfrom the cliet to be added to the DB');
    res.send({});
})

export { router as newOrderRouter };