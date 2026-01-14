import prisma from '../database/prisma';
import { cache } from '../utils/cache';
import { NotFoundError, ConflictError } from '../utils/errors';

export class EventsService {
    async getAllEvents() {
        const cacheKey = 'events:all';

        const cached = await cache.get(cacheKey);
        if (cached) {
            return cached;
        }

        const events = await prisma.event.findMany({
            where: {
                date: {
                    gte: new Date(),
                },
            },
            orderBy: {
                date: 'asc',
            },
        });

        await cache.set(cacheKey, events, 900); // Cache for 15 minutes
        return events;
    }

    async getEventDetails(eventId: string) {
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            include: {
                registrations: {
                    select: {
                        id: true,
                        status: true,
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
            },
        });

        if (!event) {
            throw new NotFoundError('Event not found');
        }

        return event;
    }

    async registerForEvent(eventId: string, userId: string) {
        // Check if event exists
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            include: {
                registrations: {
                    where: { status: 'registered' },
                },
            },
        });

        if (!event) {
            throw new NotFoundError('Event not found');
        }

        // Check if already registered
        const existingRegistration = await prisma.eventRegistration.findUnique({
            where: {
                eventId_userId: {
                    eventId,
                    userId,
                },
            },
        });

        if (existingRegistration) {
            throw new ConflictError('Already registered for this event');
        }

        // Check capacity
        if (event.maxAttendees && event.registrations.length >= event.maxAttendees) {
            throw new ConflictError('Event is full');
        }

        // Register user
        const registration = await prisma.eventRegistration.create({
            data: {
                eventId,
                userId,
                status: 'registered',
            },
        });

        // Invalidate cache
        await cache.del('events:all');

        return registration;
    }

    async getUserRegistrations(userId: string) {
        const registrations = await prisma.eventRegistration.findMany({
            where: { userId },
            include: {
                event: true,
            },
            orderBy: {
                registeredAt: 'desc',
            },
        });

        return registrations;
    }
}

export const eventsService = new EventsService();
