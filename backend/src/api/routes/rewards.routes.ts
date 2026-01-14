import { Router } from 'express';
import { rewardsService } from '../../services/rewards.service';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Get AI Points activities
router.get('/activities', authenticate, async (req, res, next) => {
    try {
        const activities = await rewardsService.getAIPointsActivities();
        res.json({
            success: true,
            data: activities,
        });
    } catch (error) {
        next(error);
    }
});

// Get user's AI Points
router.get('/points', authenticate, async (req: any, res, next) => {
    try {
        const points = await rewardsService.getUserAIPoints(req.user.id);
        res.json({
            success: true,
            data: points,
        });
    } catch (error) {
        next(error);
    }
});

// Register for activity
router.post('/activities/:activityId/register', authenticate, async (req: any, res, next) => {
    try {
        const registration = await rewardsService.registerForActivity(req.user.id, req.params.activityId);
        res.status(201).json({
            success: true,
            message: 'Successfully registered for activity',
            data: registration,
        });
    } catch (error) {
        next(error);
    }
});

// Get available rewards
router.get('/rewards', authenticate, async (req, res, next) => {
    try {
        const rewards = await rewardsService.getRewards();
        res.json({
            success: true,
            data: rewards,
        });
    } catch (error) {
        next(error);
    }
});

// Redeem reward
router.post('/rewards/:rewardId/redeem', authenticate, async (req: any, res, next) => {
    try {
        const redemption = await rewardsService.redeemReward(req.user.id, req.params.rewardId);
        res.status(201).json({
            success: true,
            message: 'Reward redeemed successfully',
            data: redemption,
        });
    } catch (error) {
        next(error);
    }
});

export default router;
