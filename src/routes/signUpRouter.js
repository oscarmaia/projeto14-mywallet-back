import { Router } from 'express';
import { postSignUp } from '../controllers/user.controller.js'

const router = Router();
router.post('/sign-up',postSignUp);

export default router;