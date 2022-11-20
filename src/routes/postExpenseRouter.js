import { Router } from 'express';
import { postExpense } from '../controllers/user.controller.js'
import entryValidate from '../middlewares/entryValidate.middleware.js';
import { tokenValidate } from '../middlewares/tokenValidate.middleware.js';

const router = Router();
router.post('/main/expense', tokenValidate, entryValidate, postExpense);

export default router;