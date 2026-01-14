import { config } from '../config/app.config';
import { logger } from '../utils/logger';
import { InternalServerError } from '../utils/errors';
import {
    MOCK_STUDENTS,
    MOCK_COURSES,
    MOCK_SCHEDULE,
    MOCK_ASSIGNMENTS,
    MOCK_GRADES,
    MOCK_ANNOUNCEMENTS,
    simulateDelay,
    simulateFailure,
} from './testData';

/**
 * Mock Blackboard Adapter
 * Simulates Blackboard API responses for testing
 */

export class MockBlackboardAdapter {
    async getUserCourses(userId: string): Promise<any[]> {
        logger.info(`[MOCK] Fetching courses for user: ${userId}`);

        await simulateDelay(config.mockDelay);

        if (simulateFailure(config.mockFailureRate)) {
            throw new InternalServerError('Mock Blackboard API failure');
        }

        return MOCK_COURSES.map((course, index) => ({
            id: course.id,
            courseId: course.code,
            name: course.name,
            description: course.description,
            role: 'Student',
            enrollmentDate: new Date(2024, 8, 1).toISOString(),
            available: true,
        }));
    }

    async getCourseContent(courseId: string): Promise<any[]> {
        logger.info(`[MOCK] Fetching content for course: ${courseId}`);

        await simulateDelay(config.mockDelay);

        if (simulateFailure(config.mockFailureRate)) {
            throw new InternalServerError('Mock Blackboard API failure');
        }

        return [
            {
                id: 'content-001',
                title: 'Week 1: Introduction',
                description: 'Course overview and syllabus',
                position: 1,
                hasChildren: true,
                available: true,
                created: new Date(2024, 8, 1).toISOString(),
                modified: new Date(2024, 8, 1).toISOString(),
            },
            {
                id: 'content-002',
                title: 'Week 2: Fundamentals',
                description: 'Core concepts and principles',
                position: 2,
                hasChildren: true,
                available: true,
                created: new Date(2024, 8, 8).toISOString(),
                modified: new Date(2024, 8, 8).toISOString(),
            },
            {
                id: 'content-003',
                title: 'Week 3: Advanced Topics',
                description: 'Deep dive into advanced concepts',
                position: 3,
                hasChildren: true,
                available: true,
                created: new Date(2024, 8, 15).toISOString(),
                modified: new Date(2024, 8, 15).toISOString(),
            },
        ];
    }

    async getCourseAssignments(courseId: string): Promise<any[]> {
        logger.info(`[MOCK] Fetching assignments for course: ${courseId}`);

        await simulateDelay(config.mockDelay);

        if (simulateFailure(config.mockFailureRate)) {
            throw new InternalServerError('Mock Blackboard API failure');
        }

        const course = MOCK_COURSES.find(c => c.id === courseId || c.code === courseId);

        return MOCK_ASSIGNMENTS
            .filter(a => !course || a.courseCode === course.code)
            .map(assignment => ({
                id: assignment.id,
                contentId: assignment.id,
                name: assignment.name,
                description: assignment.description,
                due: assignment.due,
                points: assignment.points,
                created: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                available: true,
            }));
    }

    async getUserGrades(courseId: string, userId: string): Promise<any> {
        logger.info(`[MOCK] Fetching grades for course: ${courseId}, user: ${userId}`);

        await simulateDelay(config.mockDelay);

        if (simulateFailure(config.mockFailureRate)) {
            throw new InternalServerError('Mock Blackboard API failure');
        }

        const course = MOCK_COURSES.find(c => c.id === courseId || c.code === courseId);
        const courseGrades = MOCK_GRADES.filter(g => !course || g.courseCode === course.code);

        const grades = courseGrades.map(grade => ({
            columnId: `col-${grade.courseCode}`,
            columnName: grade.courseName,
            score: grade.score,
            possible: grade.possible,
            text: grade.grade,
            feedback: 'Good work! Keep it up.',
            exempt: false,
            modified: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        }));

        const totalScore = grades.reduce((sum, g) => sum + g.score, 0);
        const totalPossible = grades.reduce((sum, g) => sum + g.possible, 0);
        const percentage = totalPossible > 0 ? (totalScore / totalPossible) * 100 : 0;

        return {
            courseId,
            userId,
            overallPercentage: percentage.toFixed(2),
            grades,
        };
    }

    async getCourseAnnouncements(courseId: string): Promise<any[]> {
        logger.info(`[MOCK] Fetching announcements for course: ${courseId}`);

        await simulateDelay(config.mockDelay);

        if (simulateFailure(config.mockFailureRate)) {
            throw new InternalServerError('Mock Blackboard API failure');
        }

        return [
            {
                id: 'bb-ann-001',
                title: 'Welcome to the Course!',
                body: 'Welcome everyone! Looking forward to a great semester.',
                created: new Date(2024, 8, 1).toISOString(),
                modified: new Date(2024, 8, 1).toISOString(),
                creator: 'Dr. Sarah Williams',
            },
            {
                id: 'bb-ann-002',
                title: 'Office Hours Update',
                body: 'Office hours this week will be moved to Thursday 2-4 PM.',
                created: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                modified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                creator: 'Dr. Sarah Williams',
            },
        ];
    }

    async syncUserCourses(userId: string, prismaUserId: string): Promise<void> {
        logger.info(`[MOCK] Syncing courses for user: ${userId}`);
        await simulateDelay(config.mockDelay);
    }
}

export const mockBlackboardAdapter = new MockBlackboardAdapter();
