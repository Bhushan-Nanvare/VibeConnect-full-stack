import express from 'express';
import { getInboxItems, markInboxItemRead, dismissInboxItem } from '../controllers/inboxController.js';
import { protect } from '../middlewares/auth.js';

const inboxRouter = express.Router();

inboxRouter.get('/', protect, getInboxItems)
inboxRouter.put('/:itemId/read', protect, markInboxItemRead)
inboxRouter.put('/:itemId/dismiss', protect, dismissInboxItem)

export default inboxRouter


