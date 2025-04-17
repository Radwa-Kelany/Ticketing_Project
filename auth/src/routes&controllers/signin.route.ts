import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
// import { validationRequest} from '../middlewares/requestValidationMiddleware';
import { validationRequest} from '@rktick/common'
// import {BadRequestError } from '../errors/customError'
import {BadRequestError } from '@rktick/common'
import { User } from '../models/userModel';
import { Password } from '../utils/Password';
import { Token } from '../utils/Token';

const router = Router();

router.post(
  '/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({ min: 4, max: 20 }),
  ],
  validationRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    let existedUser = await User.findOne({ email: email });
    if (!existedUser) {
      throw new BadRequestError('please sign up');
    }

    const isMatch = Password.comparePass(password, existedUser.password);
    if (!isMatch) {
      throw new BadRequestError('incorrect Password');
    }
    const token = Token.signToken({
      email:existedUser.email,
      username: existedUser.username,
      id: existedUser.id,
    });
    req.session = {
      jwt: token,
    };
    res.status(201).send({ msg: 'success login' });
  }
);

export { router as signinRouter };




