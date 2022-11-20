import { Router } from 'express';
import { getUserLoggedIn } from '../controllers/user.controller.js';
import { tokenValidate } from '../middlewares/tokenValidate.middleware.js';

const router = Router();
router.get('/main',tokenValidate, getUserLoggedIn);

export default router;