import { Router } from 'express';
import { aiChatService } from '../../services/ai-chat.service';
import { authenticate } from '../middleware/auth.middleware';
import { aiChatRateLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// Create new chat session
router.post('/sessions', authenticate, async (req: any, res, next) => {
    try {
        const { botType } = req.body;
        const result = await aiChatService.createSession(req.user.id, botType);
        res.status(201).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
});

// Send message in session
router.post('/sessions/:sessionId/messages', authenticate, aiChatRateLimiter, async (req: any, res, next) => {
    try {
        const { message } = req.body;
        const response = await aiChatService.chat(req.params.sessionId, message);
        res.json({
            success: true,
            data: response,
        });
    } catch (error) {
        next(error);
    }
});

// Get chat history
router.get('/sessions/:sessionId/messages', authenticate, async (req, res, next) => {
    try {
        const messages = await aiChatService.getChatHistory(req.params.sessionId);
        res.json({
            success: true,
            data: messages,
        });
    } catch (error) {
        next(error);
    }
});

// Get user's sessions
router.get('/sessions', authenticate, async (req: any, res, next) => {
    try {
        const sessions = await aiChatService.getUserSessions(req.user.id);
        res.json({
            success: true,
            data: sessions,
        });
    } catch (error) {
        next(error);
    }
});

export default router;
