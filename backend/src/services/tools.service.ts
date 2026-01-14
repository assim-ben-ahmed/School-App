import prisma from '../database/prisma';
import { ConflictError, NotFoundError } from '../utils/errors';

export class ToolsService {
    // Room Booking
    async bookRoom(userId: string, data: {
        roomName: string;
        bookingDate: Date;
        startTime: string;
        endTime: string;
    }) {
        // Check for conflicts
        const existingBooking = await prisma.roomBooking.findFirst({
            where: {
                roomName: data.roomName,
                bookingDate: data.bookingDate,
                status: 'confirmed',
                OR: [
                    {
                        AND: [
                            { startTime: { lte: data.startTime } },
                            { endTime: { gt: data.startTime } },
                        ],
                    },
                    {
                        AND: [
                            { startTime: { lt: data.endTime } },
                            { endTime: { gte: data.endTime } },
                        ],
                    },
                ],
            },
        });

        if (existingBooking) {
            throw new ConflictError('Room is already booked for this time slot');
        }

        const booking = await prisma.roomBooking.create({
            data: {
                userId,
                ...data,
            },
        });

        return booking;
    }

    async getUserBookings(userId: string) {
        const bookings = await prisma.roomBooking.findMany({
            where: { userId },
            orderBy: { bookingDate: 'desc' },
        });

        return bookings;
    }

    // Print Jobs
    async submitPrintJob(userId: string, data: {
        fileName: string;
        location: string;
        copies: number;
        pages: number;
        color: boolean;
        duplex: boolean;
    }) {
        // Calculate cost
        const pricePerPage = data.color ? 0.20 : 0.05;
        const totalPages = data.copies * data.pages;
        const effectivePages = data.duplex ? Math.ceil(totalPages / 2) : totalPages;
        const cost = effectivePages * pricePerPage;

        // Generate job ID
        const jobId = `PJ${Date.now()}${Math.floor(Math.random() * 1000)}`;

        const printJob = await prisma.printJob.create({
            data: {
                userId,
                jobId,
                fileName: data.fileName,
                location: data.location,
                copies: data.copies,
                pages: data.pages,
                color: data.color,
                duplex: data.duplex,
                cost,
            },
        });

        return printJob;
    }

    async getUserPrintJobs(userId: string) {
        const printJobs = await prisma.printJob.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });

        return printJobs;
    }
}

export const toolsService = new ToolsService();
