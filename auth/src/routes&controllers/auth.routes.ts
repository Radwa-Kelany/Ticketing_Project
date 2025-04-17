import { Router } from "express";
import { signinRouter } from "./signin.route";
import { signupRouter } from "./signup.route";
import { signoutRouter } from "./signout.route";
import { currentUserRouter} from "./currentUser.route";
const authRouter= Router();
authRouter.use('/', signinRouter);
authRouter.use('/', signupRouter);
authRouter.use('/', signoutRouter);
authRouter.use('/', currentUserRouter);

export default authRouter;