import getUserLoggedIn from "./getUserLoggedInRouter.js"
import signIn from "./signInRouter.js"
import signUp from "./signUpRouter.js"

import { Router } from "express"

const router = Router();
router.use(getUserLoggedIn);
router.use(signIn);
router.use(signUp);

export default router;
