import { Router } from 'express';
import { coursesService } from '../../services/courses.service';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Get user's courses
router.get('/', authenticate, async (req: any, res, next) => {
    try {
        const courses = await coursesService.getUserCourses(req.user.id);
        res.json({
            success: true,
            data: courses,
        });
    } catch (error) {
        next(error);
    }
});

// Get course details
router.get('/:courseId', authenticate, async (req: any, res, next) => {
    try {
        const course = await coursesService.getCourseDetails(req.params.courseId, req.user.id);
        res.json({
            success: true,
            data: course,
        });
    } catch (error) {
        next(error);
    }
});

export default router;
