import { Router } from 'express';
import { postSignIn } from '../controllers/user.controller.js'
import signInValidate from '../middlewares/signIn.middleware.js';

const router = Router();
router.post('/sign-in', signInValidate, postSignIn);

export default router;