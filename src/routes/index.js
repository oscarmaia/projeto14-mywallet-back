import getUserLoggedIn from "./getUserLoggedInRouter.js"
import signIn from "./signInRouter.js"
import signUp from "./signUpRouter.js"
import postIncomingRouter from "./postIncomingRouter.js"
import postExpenseRouter from "./postExpenseRouter.js"
import { Router } from "express"

const router = Router();
router.use(getUserLoggedIn);
router.use(signIn);
router.use(signUp);
router.use(postIncomingRouter);
router.use(postExpenseRouter);

export default router;
