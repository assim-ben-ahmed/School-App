import { Router } from 'express';
import { toolsService } from '../../services/tools.service';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Room Booking
router.post('/room-booking', authenticate, async (req: any, res, next) => {
    try {
        const booking = await toolsService.bookRoom(req.user.id, req.body);
        res.status(201).json({
            success: true,
            message: 'Room booked successfully',
            data: booking,
        });
    } catch (error) {
        next(error);
    }
});

router.get('/room-booking', authenticate, async (req: any, res, next) => {
    try {
        const bookings = await toolsService.getUserBookings(req.user.id);
        res.json({
            success: true,
            data: bookings,
        });
    } catch (error) {
        next(error);
    }
});

// Print Jobs
router.post('/print-jobs', authenticate, async (req: any, res, next) => {
    try {
        const printJob = await toolsService.submitPrintJob(req.user.id, req.body);
        res.status(201).json({
            success: true,
            message: 'Print job submitted successfully',
            data: printJob,
        });
    } catch (error) {
        next(error);
    }
});

router.get('/print-jobs', authenticate, async (req: any, res, next) => {
    try {
        const printJobs = await toolsService.getUserPrintJobs(req.user.id);
        res.json({
            success: true,
            data: printJobs,
        });
    } catch (error) {
        next(error);
    }
});

export default router;
