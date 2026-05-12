import { Router } from 'express';
import { messagesController } from '../controllers/messages.controller';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { sendMessageSchema } from '../validators/review.validator';

const router = Router();

// All message routes require auth
router.use(authMiddleware);

router.get('/conversations', (req, res) => messagesController.getConversations(req, res));
router.get('/conversations/:userId', (req, res) => messagesController.getMessages(req, res));
router.post('/', validate(sendMessageSchema), (req, res) => messagesController.sendMessage(req, res));
router.put('/:id/read', (req, res) => messagesController.markAsRead(req, res));
router.get('/unread-count', (req, res) => messagesController.getUnreadCount(req, res));
router.get('/realtime-config', (req, res) => messagesController.getRealtimeConfig(req, res));

export default router;
