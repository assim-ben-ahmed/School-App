import axios, { AxiosInstance } from 'axios';
import { config } from '../config/app.config';
import { logger } from '../utils/logger';
import { cache } from '../utils/cache';
import { InternalServerError } from '../utils/errors';

/**
 * School Intranet API Adapter
 * 
 * Integrates with the school's internal API to fetch:
 * - Student profile information
 * - Timetable/Schedule
 * - Attendance records
 * - Campus announcements
 * - Student services
 * 
 * Note: This is a template adapter. Actual implementation depends on
 * the school's specific API structure and authentication method.
 */

interface IntranetStudent {
    id: string;
    studentId: string;
    firstName: string;
    lastName: string;
    email: string;
    program: string;
    year: number;
    gpa?: number;
    creditsCompleted?: number;
    totalCredits?: number;
    expectedGraduation?: string;
}

interface IntranetSchedule {
    id: string;
    courseCode: string;
    courseName: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    room: string;
    building: string;
    professor: string;
    type: string;
}

interface IntranetAttendance {
    courseCode: string;
    courseName: string;
    totalClasses: number;
    attended: number;
    percentage: number;
}

interface IntranetAnnouncement {
    id: string;
    title: string;
    content: string;
    category: string;
    publishedDate: string;
    expiryDate?: string;
    priority: string;
}

export class IntranetAdapter {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: config.intranet.apiUrl,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': config.intranet.apiKey,
            },
        });

        // Response interceptor for error handling
        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                logger.error('Intranet API error:', error.response?.data || error.message);
                return Promise.reject(error);
            }
        );
    }

    /**
     * Get student profile information
     */
    async getStudentProfile(studentId: string): Promise<any> {
        const cacheKey = `intranet:profile:${studentId}`;

        const cached = await cache.get(cacheKey);
        if (cached) {
            return cached;
        }

        try {
            const response = await this.client.get<IntranetStudent>(
                `/api/students/${studentId}`
            );

            const profile = {
                studentId: response.data.studentId,
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                email: response.data.email,
                program: response.data.program,
                year: response.data.year,
                gpa: response.data.gpa,
                creditsCompleted: response.data.creditsCompleted,
                totalCredits: response.data.totalCredits,
                expectedGraduation: response.data.expectedGraduation,
            };

            // Cache for 1 hour
            await cache.set(cacheKey, profile, 3600);

            return profile;
        } catch (error: any) {
            logger.error('Failed to fetch student profile from Intranet:', error.message);
            throw new InternalServerError('Failed to fetch student profile');
        }
    }

    /**
     * Get student's timetable/schedule
     */
    async getStudentSchedule(studentId: string, semester?: string): Promise<any[]> {
        const cacheKey = `intranet:schedule:${studentId}:${semester || 'current'}`;

        const cached = await cache.get(cacheKey);
        if (cached) {
            return cached;
        }

        try {
            const params = semester ? { semester } : {};

            const response = await this.client.get<{ schedule: IntranetSchedule[] }>(
                `/api/students/${studentId}/schedule`,
                { params }
            );

            const schedule = response.data.schedule.map((item) => ({
                courseCode: item.courseCode,
                courseName: item.courseName,
                dayOfWeek: item.dayOfWeek,
                startTime: item.startTime,
                endTime: item.endTime,
                room: item.room,
                building: item.building,
                professor: item.professor,
                type: item.type,
            }));

            // Cache for 1 day (schedule doesn't change often)
            await cache.set(cacheKey, schedule, 86400);

            return schedule;
        } catch (error: any) {
            logger.error('Failed to fetch schedule from Intranet:', error.message);
            throw new InternalServerError('Failed to fetch schedule');
        }
    }

    /**
     * Get student's attendance records
     */
    async getStudentAttendance(studentId: string): Promise<any[]> {
        const cacheKey = `intranet:attendance:${studentId}`;

        const cached = await cache.get(cacheKey);
        if (cached) {
            return cached;
        }

        try {
            const response = await this.client.get<{ attendance: IntranetAttendance[] }>(
                `/api/students/${studentId}/attendance`
            );

            const attendance = response.data.attendance.map((record) => ({
                courseCode: record.courseCode,
                courseName: record.courseName,
                totalClasses: record.totalClasses,
                attended: record.attended,
                percentage: record.percentage,
            }));

            // Cache for 1 hour
            await cache.set(cacheKey, attendance, 3600);

            return attendance;
        } catch (error: any) {
            logger.error('Failed to fetch attendance from Intranet:', error.message);
            throw new InternalServerError('Failed to fetch attendance');
        }
    }

    /**
     * Get campus announcements
     */
    async getCampusAnnouncements(category?: string): Promise<any[]> {
        const cacheKey = `intranet:announcements:${category || 'all'}`;

        const cached = await cache.get(cacheKey);
        if (cached) {
            return cached;
        }

        try {
            const params = category ? { category } : {};

            const response = await this.client.get<{ announcements: IntranetAnnouncement[] }>(
                '/api/announcements',
                { params }
            );

            const announcements = response.data.announcements.map((announcement) => ({
                id: announcement.id,
                title: announcement.title,
                content: announcement.content,
                category: announcement.category,
                publishedDate: announcement.publishedDate,
                expiryDate: announcement.expiryDate,
                priority: announcement.priority,
            }));

            // Cache for 15 minutes
            await cache.set(cacheKey, announcements, 900);

            return announcements;
        } catch (error: any) {
            logger.error('Failed to fetch announcements from Intranet:', error.message);
            throw new InternalServerError('Failed to fetch announcements');
        }
    }

    /**
     * Sync student profile to local database
     */
    async syncStudentProfile(studentId: string, prismaUserId: string): Promise<void> {
        try {
            const profile = await this.getStudentProfile(studentId);

            logger.info(`Syncing profile for student ${studentId}`);
            logger.debug('Intranet profile:', JSON.stringify(profile, null, 2));

            // This would update the local database
            // Implementation depends on your database structure

            // Invalidate user cache
            await cache.delPattern(`user:${prismaUserId}*`);
        } catch (error: any) {
            logger.error('Failed to sync student profile from Intranet:', error.message);
            throw error;
        }
    }

    /**
     * Sync student schedule to local database
     */
    async syncStudentSchedule(studentId: string, prismaUserId: string): Promise<void> {
        try {
            const schedule = await this.getStudentSchedule(studentId);

            logger.info(`Syncing schedule for student ${studentId}: ${schedule.length} classes`);

            // This would update the local database
            // Implementation depends on your database structure

            // Invalidate schedule cache
            await cache.del(`schedule:${prismaUserId}`);
        } catch (error: any) {
            logger.error('Failed to sync schedule from Intranet:', error.message);
            throw error;
        }
    }
}

export const intranetAdapter = new IntranetAdapter();
