import { config } from '../config/app.config';
import { logger } from '../utils/logger';
import { InternalServerError } from '../utils/errors';
import {
    MOCK_STUDENTS,
    MOCK_SCHEDULE,
    MOCK_ANNOUNCEMENTS,
    simulateDelay,
    simulateFailure,
} from './testData';

/**
 * Mock Intranet Adapter
 * Simulates school Intranet API responses for testing
 */

export class MockIntranetAdapter {
    async getStudentProfile(studentId: string): Promise<any> {
        logger.info(`[MOCK] Fetching profile for student: ${studentId}`);

        await simulateDelay(config.mockDelay);

        if (simulateFailure(config.mockFailureRate)) {
            throw new InternalServerError('Mock Intranet API failure');
        }

        // Find student or return first one
        const student = MOCK_STUDENTS.find(s => s.studentId === studentId) || MOCK_STUDENTS[0];

        return {
            studentId: student.studentId,
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
            program: student.program,
            year: student.year,
            gpa: student.gpa,
            creditsCompleted: student.creditsCompleted,
            totalCredits: student.totalCredits,
            expectedGraduation: student.expectedGraduation,
        };
    }

    async getStudentSchedule(studentId: string, semester?: string): Promise<any[]> {
        logger.info(`[MOCK] Fetching schedule for student: ${studentId}, semester: ${semester || 'current'}`);

        await simulateDelay(config.mockDelay);

        if (simulateFailure(config.mockFailureRate)) {
            throw new InternalServerError('Mock Intranet API failure');
        }

        return MOCK_SCHEDULE.map(item => ({
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
    }

    async getStudentAttendance(studentId: string): Promise<any[]> {
        logger.info(`[MOCK] Fetching attendance for student: ${studentId}`);

        await simulateDelay(config.mockDelay);

        if (simulateFailure(config.mockFailureRate)) {
            throw new InternalServerError('Mock Intranet API failure');
        }

        return [
            {
                courseCode: 'CS301',
                courseName: 'Advanced Algorithms',
                totalClasses: 24,
                attended: 22,
                percentage: 91.67,
            },
            {
                courseCode: 'DS201',
                courseName: 'Machine Learning Fundamentals',
                totalClasses: 24,
                attended: 24,
                percentage: 100,
            },
            {
                courseCode: 'CS202',
                courseName: 'Database Systems',
                totalClasses: 20,
                attended: 18,
                percentage: 90,
            },
            {
                courseCode: 'DS301',
                courseName: 'Data Visualization',
                totalClasses: 16,
                attended: 15,
                percentage: 93.75,
            },
        ];
    }

    async getCampusAnnouncements(category?: string): Promise<any[]> {
        logger.info(`[MOCK] Fetching announcements, category: ${category || 'all'}`);

        await simulateDelay(config.mockDelay);

        if (simulateFailure(config.mockFailureRate)) {
            throw new InternalServerError('Mock Intranet API failure');
        }

        let announcements = MOCK_ANNOUNCEMENTS;

        if (category) {
            announcements = announcements.filter(a => a.category === category);
        }

        return announcements.map(announcement => ({
            id: announcement.id,
            title: announcement.title,
            content: announcement.content,
            category: announcement.category,
            publishedDate: announcement.publishedDate,
            expiryDate: announcement.expiryDate,
            priority: announcement.priority,
        }));
    }

    async syncStudentProfile(studentId: string, prismaUserId: string): Promise<void> {
        logger.info(`[MOCK] Syncing profile for student: ${studentId}`);
        await simulateDelay(config.mockDelay);
    }

    async syncStudentSchedule(studentId: string, prismaUserId: string): Promise<void> {
        logger.info(`[MOCK] Syncing schedule for student: ${studentId}`);
        await simulateDelay(config.mockDelay);
    }
}

export const mockIntranetAdapter = new MockIntranetAdapter();
