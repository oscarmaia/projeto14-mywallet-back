import { Router } from 'express';
import { postLogout } from '../controllers/user.controller.js';
import { tokenValidate } from '../middlewares/tokenValidate.middleware.js';

const router = Router();
router.post('/logout',tokenValidate, postLogout);
export default router;