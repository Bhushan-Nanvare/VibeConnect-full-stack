import express from 'express';
import { getChatMessages, sendMessage, sseController, updatePoll, updateChecklist, updateDecision, updateMessageState } from '../controllers/messageController.js';
import { upload } from '../configs/multer.js';
import { protect } from '../middlewares/auth.js';


const messageRouter = express.Router();

messageRouter.get('/:userId', sseController)
messageRouter.post('/send', upload.single('image'), protect, sendMessage)
messageRouter.post('/get', protect, getChatMessages)
messageRouter.put('/:messageId/poll', protect, updatePoll)
messageRouter.put('/:messageId/checklist', protect, updateChecklist)
messageRouter.put('/:messageId/decision', protect, updateDecision)
messageRouter.put('/:messageId/state', protect, updateMessageState)

export default messageRouter