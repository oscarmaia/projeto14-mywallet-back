import { Router } from 'express';
import { postIncoming } from '../controllers/user.controller.js'
import entryValidate from '../middlewares/entryValidate.middleware.js';
import { tokenValidate } from '../middlewares/tokenValidate.middleware.js';

const router = Router();
router.post('/main/incoming', tokenValidate, entryValidate, postIncoming);

export default router;