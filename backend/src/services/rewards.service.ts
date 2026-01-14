import prisma from '../database/prisma';
import { NotFoundError, ValidationError } from '../utils/errors';

export class RewardsService {
    async getAIPointsActivities() {
        const activities = await prisma.aIPointsActivity.findMany({
            orderBy: { date: 'desc' },
        });

        return activities;
    }

    async getUserAIPoints(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { aiPoints: true },
        });

        if (!user) {
            throw new NotFoundError('User not found');
        }

        const earnedPoints = await prisma.userAIPoint.findMany({
            where: { userId },
            include: {
                activity: true,
            },
            orderBy: { earnedAt: 'desc' },
        });

        return {
            totalPoints: user.aiPoints,
            earnedPoints,
        };
    }

    async registerForActivity(userId: string, activityId: string) {
        const activity = await prisma.aIPointsActivity.findUnique({
            where: { id: activityId },
        });

        if (!activity) {
            throw new NotFoundError('Activity not found');
        }

        if (activity.status === 'completed') {
            throw new ValidationError('Cannot register for completed activity');
        }

        // Check if already registered
        const existing = await prisma.userAIPoint.findUnique({
            where: {
                userId_activityId: {
                    userId,
                    activityId,
                },
            },
        });

        if (existing) {
            throw new ValidationError('Already registered for this activity');
        }

        // Create registration (points not earned yet)
        const registration = await prisma.userAIPoint.create({
            data: {
                userId,
                activityId,
                pointsEarned: 0, // Will be updated when activity is completed
            },
        });

        return registration;
    }

    async getRewards() {
        const rewards = await prisma.reward.findMany({
            where: { available: true },
            orderBy: { pointsCost: 'asc' },
        });

        return rewards;
    }

    async redeemReward(userId: string, rewardId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundError('User not found');
        }

        const reward = await prisma.reward.findUnique({
            where: { id: rewardId },
        });

        if (!reward) {
            throw new NotFoundError('Reward not found');
        }

        if (!reward.available) {
            throw new ValidationError('Reward is not available');
        }

        if (user.aiPoints < reward.pointsCost) {
            throw new ValidationError('Insufficient AI Points');
        }

        // Create redemption and deduct points
        const redemption = await prisma.$transaction(async (tx) => {
            const redemption = await tx.rewardRedemption.create({
                data: {
                    userId,
                    rewardId,
                    pointsSpent: reward.pointsCost,
                },
            });

            await tx.user.update({
                where: { id: userId },
                data: {
                    aiPoints: {
                        decrement: reward.pointsCost,
                    },
                },
            });

            return redemption;
        });

        return redemption;
    }
}

export const rewardsService = new RewardsService();
