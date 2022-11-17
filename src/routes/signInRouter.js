import { Router } from 'express';
import { postSignIn } from '../controllers/user.controller.js'

const router = Router();
router.post('/sign-in',postSignIn);

export default router;