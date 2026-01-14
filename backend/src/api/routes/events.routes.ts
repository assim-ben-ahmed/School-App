import { Router } from 'express';
import { eventsService } from '../../services/events.service';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Get all events
router.get('/', authenticate, async (req, res, next) => {
    try {
        const events = await eventsService.getAllEvents();
        res.json({
            success: true,
            data: events,
        });
    } catch (error) {
        next(error);
    }
});

// Get event details
router.get('/:eventId', authenticate, async (req, res, next) => {
    try {
        const event = await eventsService.getEventDetails(req.params.eventId);
        res.json({
            success: true,
            data: event,
        });
    } catch (error) {
        next(error);
    }
});

// Register for event
router.post('/:eventId/register', authenticate, async (req: any, res, next) => {
    try {
        const registration = await eventsService.registerForEvent(req.params.eventId, req.user.id);
        res.status(201).json({
            success: true,
            message: 'Successfully registered for event',
            data: registration,
        });
    } catch (error) {
        next(error);
    }
});

// Get user's registrations
router.get('/my/registrations', authenticate, async (req: any, res, next) => {
    try {
        const registrations = await eventsService.getUserRegistrations(req.user.id);
        res.json({
            success: true,
            data: registrations,
        });
    } catch (error) {
        next(error);
    }
});

export default router;
