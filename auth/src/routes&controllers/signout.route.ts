import { Router, Request, Response } from 'express';
// import { authenticateUser } from '../middlewares/tokenValidationMiddleware'
import { authenticateUser } from '@rktick/common'
const router = Router();

router.post(
  '/signout',
  authenticateUser,
  (req: Request, res: Response) => {
    req.session = null;
    res.status(200).send({ msg: 'hello from signout' });
  }
);

export { router as signoutRouter };
