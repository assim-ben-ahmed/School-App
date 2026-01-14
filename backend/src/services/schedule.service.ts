import prisma from '../database/prisma';
import { cache } from '../utils/cache';
import { NotFoundError } from '../utils/errors';

export class ScheduleService {
    async getWeeklySchedule(userId: string) {
        const cacheKey = `schedule:${userId}`;

        // Try cache first
        const cached = await cache.get(cacheKey);
        if (cached) {
            return cached;
        }

        // Get user's enrolled courses
        const userCourses = await prisma.userCourse.findMany({
            where: {
                userId,
                status: 'active',
            },
            include: {
                course: {
                    include: {
                        schedules: true,
                    },
                },
            },
        });

        // Transform to weekly schedule format
        const weeklySchedule = userCourses.flatMap((uc) =>
            uc.course.schedules.map((schedule) => ({
                id: schedule.id,
                courseId: uc.course.id,
                courseName: uc.course.name,
                courseCode: uc.course.code,
                dayOfWeek: schedule.dayOfWeek,
                startTime: schedule.startTime,
                endTime: schedule.endTime,
                room: schedule.room,
                building: schedule.building,
                type: schedule.type,
            }))
        );

        // Group by day
        const groupedByDay = weeklySchedule.reduce((acc, item) => {
            const day = item.dayOfWeek;
            if (!acc[day]) {
                acc[day] = [];
            }
            acc[day].push(item);
            return acc;
        }, {} as Record<number, any[]>);

        // Sort each day by start time
        Object.keys(groupedByDay).forEach((day) => {
            groupedByDay[parseInt(day)].sort((a, b) =>
                a.startTime.localeCompare(b.startTime)
            );
        });

        // Cache for 1 hour
        await cache.set(cacheKey, groupedByDay, 3600);

        return groupedByDay;
    }

    async getTodaySchedule(userId: string) {
        const today = new Date().getDay(); // 0=Sunday, 1=Monday, etc.
        const dayOfWeek = today === 0 ? 6 : today - 1; // Convert to 0=Monday

        const weeklySchedule = await this.getWeeklySchedule(userId);
        return weeklySchedule[dayOfWeek] || [];
    }
}

export const scheduleService = new ScheduleService();
