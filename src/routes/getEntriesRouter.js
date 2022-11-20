import { Router } from 'express';
import { getEntries } from '../controllers/user.controller.js';
import { tokenValidate } from '../middlewares/tokenValidate.middleware.js';

const router = Router();
router.get('/main',tokenValidate, getEntries);
export default router;