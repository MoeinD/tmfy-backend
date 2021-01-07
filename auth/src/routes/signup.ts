import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';
import { validationRequest } from '../middlewares/validate-request';



const router = express.Router();

router.post('/api/users/signup', [
    body('email').
        isEmail().withMessage('Email must be valid'),
    body('password').
        trim().isLength({ min: 4, max: 20 }).
        withMessage('Password must be between 4 and 20 characters')
],
    validationRequest,
    async (req: Request, res: Response, next: NextFunction) => {
        /**in this stage we have recieved 
         * the email and password properly from
         * the client and then we can continue 
         * and check if the user with the same
         * email exist
         */
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new BadRequestError('The user exist');
        }
        const user = User.build({ email, password });
        await user.save();

        //Jenerate JWT
        const userJwt = jwt.sign({
            id: user.id,
            email: user.email
            /**! shows the TS that we have check the value of 
             * this var in the other section and  the TS
             * error will be gone
             */
        }, process.env.JWT_KEY!);
        //Store it on session object
        req.session = {
            jwt: userJwt
        }

        res.status(201).send(user);

    })

export default router;