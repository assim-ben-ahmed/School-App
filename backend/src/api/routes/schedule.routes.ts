import { Router } from 'express';
import { scheduleService } from '../../services/schedule.service';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Get weekly schedule
router.get('/weekly', authenticate, async (req: any, res, next) => {
    try {
        const schedule = await scheduleService.getWeeklySchedule(req.user.id);
        res.json({
            success: true,
            data: schedule,
        });
    } catch (error) {
        next(error);
    }
});

// Get today's schedule
router.get('/today', authenticate, async (req: any, res, next) => {
    try {
        const schedule = await scheduleService.getTodaySchedule(req.user.id);
        res.json({
            success: true,
            data: schedule,
        });
    } catch (error) {
        next(error);
    }
});

export default router;
