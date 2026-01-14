import prisma from '../database/prisma';
import { cache } from '../utils/cache';
import { NotFoundError } from '../utils/errors';

export class CoursesService {
    async getUserCourses(userId: string) {
        const cacheKey = `courses:${userId}`;

        const cached = await cache.get(cacheKey);
        if (cached) {
            return cached;
        }

        const courses = await prisma.userCourse.findMany({
            where: { userId },
            include: {
                course: true,
            },
        });

        const result = courses.map((uc) => ({
            id: uc.course.id,
            code: uc.course.code,
            name: uc.course.name,
            description: uc.course.description,
            credits: uc.course.credits,
            semester: uc.course.semester,
            year: uc.course.year,
            progress: uc.progress,
            grade: uc.grade,
            status: uc.status,
        }));

        await cache.set(cacheKey, result, 3600); // Cache for 1 hour
        return result;
    }

    async getCourseDetails(courseId: string, userId: string) {
        const userCourse = await prisma.userCourse.findFirst({
            where: {
                userId,
                courseId,
            },
            include: {
                course: {
                    include: {
                        schedules: true,
                    },
                },
            },
        });

        if (!userCourse) {
            throw new NotFoundError('Course not found or not enrolled');
        }

        return {
            ...userCourse.course,
            progress: userCourse.progress,
            grade: userCourse.grade,
            status: userCourse.status,
        };
    }
}

export const coursesService = new CoursesService();
