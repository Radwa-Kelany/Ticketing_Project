import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
// import { validationRequest } from '../middlewares/requestValidationMiddleware';
import { validationRequest } from '@rktick/common';
// import {BadRequestError} from "../errors/customError"
import {BadRequestError} from "@rktick/common"
import { User } from '../models/userModel';
import { Token } from '../utils/Token';

const router = Router();

router.post(
  '/signup',
  [
    body('username')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('username must be at least 10 characters'),
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({ min: 4, max: 20 }),
  ],
  validationRequest,
  async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    const existedUser = await User.findOne({ email });
    if (existedUser) {
      throw new BadRequestError('Email in use');
    }
    const user = User.build({ username, email, password });
    // console.log(user);
    await user.save();
    const token = await Token.signToken({
      email:user.email,
      username: user.username,
      id: user.id,
    });
    req.session = {
      jwt: token,
    };
    res.status(201).send({ msg: 'success login' });
  }
);

export { router as signupRouter };
