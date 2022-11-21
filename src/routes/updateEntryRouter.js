import { Router } from 'express';
import { updateEntry } from '../controllers/user.controller.js';
import { tokenValidate } from '../middlewares/tokenValidate.middleware.js';

const router = Router();
router.put('/main/entry/update/:id',tokenValidate, updateEntry);
export default router;