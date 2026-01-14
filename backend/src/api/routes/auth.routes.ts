import { Router } from 'express';
import passport from '../config/passport.config';
import { authService } from '../../services/auth.service';
import { authenticate } from '../middleware/auth.middleware';
import { authRateLimiter } from '../middleware/rateLimit.middleware';
import { logger } from '../../utils/logger';

const router = Router();

/**
 * @route   GET /auth/login
 * @desc    Initiate SSO login
 * @access  Public
 */
router.get('/login', (req, res, next) => {
    // Redirect to SSO provider
    passport.authenticate('saml', {
        session: false,
    })(req, res, next);
});

/**
 * @route   POST /auth/callback
 * @desc    SSO callback endpoint
 * @access  Public
 */
router.post(
    '/callback',
    authRateLimiter,
    passport.authenticate('saml', { session: false }),
    async (req: any, res, next) => {
        try {
            // User info from SSO provider
            const ssoProfile = req.user;

            if (!ssoProfile) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication failed',
                });
            }

            // Handle SSO callback (create/update user, generate tokens)
            const { user, tokens } = await authService.handleSSOCallback(ssoProfile);

            // Return tokens and user info
            res.json({
                success: true,
                message: 'Authentication successful',
                data: {
                    user: {
                        id: user.id,
                        studentId: user.studentId,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
                    },
                    tokens,
                },
            });
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @route   POST /auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh', authRateLimiter, async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token is required',
            });
        }

        const tokens = await authService.refreshAccessToken(refreshToken);

        res.json({
            success: true,
            message: 'Token refreshed successfully',
            data: tokens,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   POST /auth/logout
 * @desc    Logout user (revoke refresh token)
 * @access  Private
 */
router.post('/logout', authenticate, async (req: any, res, next) => {
    try {
        await authService.logout(req.user.id);

        res.json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticate, async (req: any, res, next) => {
    try {
        const user = await authService.getUserProfile(req.user.id);

        res.json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   PUT /auth/me
 * @desc    Update current user profile
 * @access  Private
 */
router.put('/me', authenticate, async (req: any, res, next) => {
    try {
        const { firstName, lastName, email } = req.body;

        const user = await authService.updateUserProfile(req.user.id, {
            firstName,
            lastName,
            email,
        });

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: user,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /auth/status
 * @desc    Check authentication status
 * @access  Private
 */
router.get('/status', authenticate, (req: any, res) => {
    res.json({
        success: true,
        data: {
            authenticated: true,
            user: {
                id: req.user.id,
                studentId: req.user.studentId,
                email: req.user.email,
                role: req.user.role,
            },
        },
    });
});

export default router;
