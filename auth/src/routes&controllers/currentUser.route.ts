import { Router } from 'express';
// import { authenticateUser } from '../middlewares/tokenValidationMiddleware';
import { authenticateUser } from '../middlewares/tokenValidationMiddleware';
const router = Router();

router.get('/currentuser', authenticateUser, (req, res) => {
  const { currentUser } = req;
  res.send({ currentUser: currentUser });
});

export { router as currentUserRouter };
