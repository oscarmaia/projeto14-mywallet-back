import { Router } from 'express';
import { deleteEntry } from '../controllers/user.controller.js';

const router = Router();
router.get('/main/entry:id', deleteEntry);
export default router;