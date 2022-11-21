import getEntriesRouter from "./getEntriesRouter.js"
import signIn from "./signInRouter.js"
import signUp from "./signUpRouter.js"
import postIncomingRouter from "./postIncomingRouter.js"
import postExpenseRouter from "./postExpenseRouter.js"
import logoutRouter from "./logoutRouter.js"
import deleteEntryRouter from "./deleteEntryRouter.js"
import updateEntryRouter from "./updateEntryRouter.js"
import { Router } from "express"

const router = Router();
router.use(getEntriesRouter);
router.use(signIn);
router.use(signUp);
router.use(postIncomingRouter);
router.use(postExpenseRouter);
router.use(logoutRouter);
router.use(deleteEntryRouter);
router.use(updateEntryRouter);



export default router;
