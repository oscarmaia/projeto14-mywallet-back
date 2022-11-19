import { Router } from 'express';
import { getUserLoggedIn } from '../controllers/user.controller.js';

const router = Router();
router.get('/main', getUserLoggedIn);

export default router;