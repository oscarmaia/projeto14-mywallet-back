import { Router } from 'express';
import { postSignUp } from '../controllers/user.controller.js'
import signUpValidate from '../middlewares/signUpValidate.middleware.js';

const router = Router();
router.post('/sign-up',signUpValidate,postSignUp);

export default router;