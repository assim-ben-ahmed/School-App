import axios, { AxiosInstance } from 'axios';
import { config } from '../config/app.config';
import { logger } from '../utils/logger';
import { cache } from '../utils/cache';
import { InternalServerError } from '../utils/errors';

/**
 * Blackboard REST API Adapter
 * 
 * Integrates with Blackboard Learn LMS to fetch:
 * - Course enrollments
 * - Course content
 * - Assignments and deadlines
 * - Grades
 * - Announcements
 * 
 * API Documentation: https://developer.blackboard.com/portal/displayApi
 */

interface BlackboardCourse {
    id: string;
    courseId: string;
    name: string;
    description?: string;
    created: string;
    modified: string;
    organization: boolean;
    ultraStatus: string;
    allowGuests: boolean;
    readOnly: boolean;
    termId?: string;
    availability: {
        available: string;
        duration: {
            type: string;
        };
    };
    enrollment: {
        type: string;
    };
    locale?: {
        id: string;
    };
}

interface BlackboardMembership {
    id: string;
    userId: string;
    courseId: string;
    courseRoleId: string;
    dataSourceId: string;
    created: string;
    modified: string;
    availability: {
        available: string;
    };
}

interface BlackboardGrade {
    userId: string;
    columnId: string;
    status: string;
    text?: string;
    score?: number;
    notes?: string;
    feedback?: string;
    exempt: boolean;
    created: string;
    modified: string;
}

interface BlackboardContent {
    id: string;
    parentId?: string;
    title: string;
    body?: string;
    description?: string;
    created: string;
    modified: string;
    position: number;
    hasChildren: boolean;
    availability: {
        available: string;
        allowGuests: boolean;
    };
    contentHandler: {
        id: string;
    };
}

interface BlackboardAssignment {
    id: string;
    title: string;
    description?: string;
    instructions?: string;
    due?: string;
    created: string;
    modified: string;
    score: {
        possible: number;
    };
    availability: {
        available: string;
    };
    grading: {
        due?: string;
        attemptsAllowed?: number;
        scoringModel?: string;
    };
}

export class BlackboardAdapter {
    private client: AxiosInstance;
    private accessToken: string | null = null;
    private tokenExpiry: number = 0;

    constructor() {
        this.client = axios.create({
            baseURL: config.blackboard.apiUrl,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor for authentication
        this.client.interceptors.request.use(
            async (config) => {
                await this.ensureAuthenticated();
                if (this.accessToken) {
                    config.headers.Authorization = `Bearer ${this.accessToken}`;
                }
                return config;
            },
            (error) => {
                logger.error('Blackboard request interceptor error:', error);
                return Promise.reject(error);
            }
        );

        // Response interceptor for error handling
        this.client.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response?.status === 401) {
                    // Token expired, retry authentication
                    this.accessToken = null;
                    await this.ensureAuthenticated();
                    // Retry the original request
                    return this.client.request(error.config);
                }
                logger.error('Blackboard API error:', error.response?.data || error.message);
                return Promise.reject(error);
            }
        );
    }

    /**
     * Ensure we have a valid access token
     */
    private async ensureAuthenticated(): Promise<void> {
        const now = Date.now();

        // Check if token is still valid (with 5 minute buffer)
        if (this.accessToken && this.tokenExpiry > now + 5 * 60 * 1000) {
            return;
        }

        try {
            // Blackboard uses OAuth 2.0 with client credentials grant
            const response = await axios.post(
                `${config.blackboard.apiUrl}/learn/api/public/v1/oauth2/token`,
                new URLSearchParams({
                    grant_type: 'client_credentials',
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Authorization: `Basic ${Buffer.from(`${config.blackboard.apiKey}:${config.blackboard.apiSecret || ''}`).toString('base64')}`,
                    },
                }
            );

            this.accessToken = response.data.access_token;
            this.tokenExpiry = now + response.data.expires_in * 1000;

            logger.info('Blackboard authentication successful');
        } catch (error: any) {
            logger.error('Blackboard authentication failed:', error.message);
            throw new InternalServerError('Failed to authenticate with Blackboard');
        }
    }

    /**
     * Get user's course enrollments
     */
    async getUserCourses(userId: string): Promise<any[]> {
        const cacheKey = `blackboard:courses:${userId}`;

        // Try cache first
        const cached = await cache.get(cacheKey);
        if (cached) {
            return cached;
        }

        try {
            // Get user's memberships
            const membershipsResponse = await this.client.get<{ results: BlackboardMembership[] }>(
                `/learn/api/public/v1/users/${userId}/courses`
            );

            const memberships = membershipsResponse.data.results || [];

            // Fetch course details for each enrollment
            const courses = await Promise.all(
                memberships.map(async (membership) => {
                    try {
                        const courseResponse = await this.client.get<BlackboardCourse>(
                            `/learn/api/public/v1/courses/${membership.courseId}`
                        );

                        return {
                            id: courseResponse.data.id,
                            courseId: courseResponse.data.courseId,
                            name: courseResponse.data.name,
                            description: courseResponse.data.description,
                            role: membership.courseRoleId,
                            enrollmentDate: membership.created,
                            available: courseResponse.data.availability.available === 'Yes',
                        };
                    } catch (error) {
                        logger.error(`Failed to fetch course ${membership.courseId}:`, error);
                        return null;
                    }
                })
            );

            const validCourses = courses.filter((c) => c !== null);

            // Cache for 1 hour
            await cache.set(cacheKey, validCourses, 3600);

            return validCourses;
        } catch (error: any) {
            logger.error('Failed to fetch user courses from Blackboard:', error.message);
            throw new InternalServerError('Failed to fetch courses from Blackboard');
        }
    }

    /**
     * Get course content (modules, lessons, materials)
     */
    async getCourseContent(courseId: string): Promise<any[]> {
        const cacheKey = `blackboard:content:${courseId}`;

        const cached = await cache.get(cacheKey);
        if (cached) {
            return cached;
        }

        try {
            const response = await this.client.get<{ results: BlackboardContent[] }>(
                `/learn/api/public/v1/courses/${courseId}/contents`
            );

            const contents = response.data.results || [];

            const formattedContent = contents.map((content) => ({
                id: content.id,
                title: content.title,
                description: content.description,
                body: content.body,
                position: content.position,
                hasChildren: content.hasChildren,
                available: content.availability.available === 'Yes',
                created: content.created,
                modified: content.modified,
            }));

            // Cache for 30 minutes
            await cache.set(cacheKey, formattedContent, 1800);

            return formattedContent;
        } catch (error: any) {
            logger.error('Failed to fetch course content from Blackboard:', error.message);
            throw new InternalServerError('Failed to fetch course content');
        }
    }

    /**
     * Get assignments for a course
     */
    async getCourseAssignments(courseId: string): Promise<any[]> {
        const cacheKey = `blackboard:assignments:${courseId}`;

        const cached = await cache.get(cacheKey);
        if (cached) {
            return cached;
        }

        try {
            // Get grade columns (assignments are grade columns)
            const response = await this.client.get<{ results: any[] }>(
                `/learn/api/public/v2/courses/${courseId}/gradebook/columns`
            );

            const columns = response.data.results || [];

            // Filter for assignments only (exclude calculated columns)
            const assignments = columns
                .filter((col) => col.contentId) // Has associated content
                .map((col) => ({
                    id: col.id,
                    contentId: col.contentId,
                    name: col.name,
                    description: col.description,
                    due: col.grading?.due,
                    points: col.score?.possible || 0,
                    created: col.created,
                    available: col.availability?.available === 'Yes',
                }));

            // Cache for 15 minutes
            await cache.set(cacheKey, assignments, 900);

            return assignments;
        } catch (error: any) {
            logger.error('Failed to fetch assignments from Blackboard:', error.message);
            throw new InternalServerError('Failed to fetch assignments');
        }
    }

    /**
     * Get user's grades for a course
     */
    async getUserGrades(courseId: string, userId: string): Promise<any> {
        const cacheKey = `blackboard:grades:${courseId}:${userId}`;

        const cached = await cache.get(cacheKey);
        if (cached) {
            return cached;
        }

        try {
            // Get all grade columns
            const columnsResponse = await this.client.get<{ results: any[] }>(
                `/learn/api/public/v2/courses/${courseId}/gradebook/columns`
            );

            const columns = columnsResponse.data.results || [];

            // Get user's grades for each column
            const grades = await Promise.all(
                columns.map(async (column) => {
                    try {
                        const gradeResponse = await this.client.get<BlackboardGrade>(
                            `/learn/api/public/v2/courses/${courseId}/gradebook/columns/${column.id}/users/${userId}`
                        );

                        return {
                            columnId: column.id,
                            columnName: column.name,
                            score: gradeResponse.data.score,
                            possible: column.score?.possible || 0,
                            text: gradeResponse.data.text,
                            feedback: gradeResponse.data.feedback,
                            exempt: gradeResponse.data.exempt,
                            modified: gradeResponse.data.modified,
                        };
                    } catch (error) {
                        // Grade might not exist yet
                        return null;
                    }
                })
            );

            const validGrades = grades.filter((g) => g !== null);

            // Calculate overall grade
            const totalScore = validGrades.reduce((sum, g) => sum + (g.score || 0), 0);
            const totalPossible = validGrades.reduce((sum, g) => sum + g.possible, 0);
            const percentage = totalPossible > 0 ? (totalScore / totalPossible) * 100 : 0;

            const result = {
                courseId,
                userId,
                overallPercentage: percentage.toFixed(2),
                grades: validGrades,
            };

            // Cache for 15 minutes (grades change frequently)
            await cache.set(cacheKey, result, 900);

            return result;
        } catch (error: any) {
            logger.error('Failed to fetch grades from Blackboard:', error.message);
            throw new InternalServerError('Failed to fetch grades');
        }
    }

    /**
     * Get course announcements
     */
    async getCourseAnnouncements(courseId: string): Promise<any[]> {
        const cacheKey = `blackboard:announcements:${courseId}`;

        const cached = await cache.get(cacheKey);
        if (cached) {
            return cached;
        }

        try {
            const response = await this.client.get<{ results: any[] }>(
                `/learn/api/public/v1/courses/${courseId}/announcements`
            );

            const announcements = response.data.results || [];

            const formattedAnnouncements = announcements.map((announcement) => ({
                id: announcement.id,
                title: announcement.title,
                body: announcement.body,
                created: announcement.created,
                modified: announcement.modified,
                creator: announcement.creator,
            }));

            // Cache for 10 minutes
            await cache.set(cacheKey, formattedAnnouncements, 600);

            return formattedAnnouncements;
        } catch (error: any) {
            logger.error('Failed to fetch announcements from Blackboard:', error.message);
            throw new InternalServerError('Failed to fetch announcements');
        }
    }

    /**
     * Sync user's courses from Blackboard to local database
     */
    async syncUserCourses(userId: string, prismaUserId: string): Promise<void> {
        try {
            const courses = await this.getUserCourses(userId);

            logger.info(`Syncing ${courses.length} courses for user ${userId}`);

            // This would be implemented to update the local database
            // For now, just log the courses
            logger.debug('Blackboard courses:', JSON.stringify(courses, null, 2));

            // Invalidate cache to force refresh
            await cache.del(`courses:${prismaUserId}`);
        } catch (error: any) {
            logger.error('Failed to sync courses from Blackboard:', error.message);
            throw error;
        }
    }
}

export const blackboardAdapter = new BlackboardAdapter();
