import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config/app.config';
import prisma from '../database/prisma';
import { cache } from '../utils/cache';
import { logger } from '../utils/logger';
import { UnauthorizedError, NotFoundError, ValidationError } from '../utils/errors';

interface TokenPayload {
    id: string;
    studentId: string;
    email: string;
    role: string;
}

interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
}

export class AuthService {
    /**
     * Generate JWT access token
     */
    generateAccessToken(payload: TokenPayload): string {
        return jwt.sign(payload, config.jwt.secret, {
            expiresIn: config.jwt.expiresIn,
        });
    }

    /**
     * Generate JWT refresh token
     */
    generateRefreshToken(payload: TokenPayload): string {
        return jwt.sign(payload, config.jwt.refreshSecret, {
            expiresIn: config.jwt.refreshExpiresIn,
        });
    }

    /**
     * Verify access token
     */
    verifyAccessToken(token: string): TokenPayload {
        try {
            return jwt.verify(token, config.jwt.secret) as TokenPayload;
        } catch (error) {
            throw new UnauthorizedError('Invalid or expired token');
        }
    }

    /**
     * Verify refresh token
     */
    verifyRefreshToken(token: string): TokenPayload {
        try {
            return jwt.verify(token, config.jwt.refreshSecret) as TokenPayload;
        } catch (error) {
            throw new UnauthorizedError('Invalid or expired refresh token');
        }
    }

    /**
     * Generate both access and refresh tokens
     */
    generateTokens(user: {
        id: string;
        studentId: string;
        email: string;
        role: string;
    }): AuthTokens {
        const payload: TokenPayload = {
            id: user.id,
            studentId: user.studentId,
            email: user.email,
            role: user.role,
        };

        const accessToken = this.generateAccessToken(payload);
        const refreshToken = this.generateRefreshToken(payload);

        return {
            accessToken,
            refreshToken,
            expiresIn: config.jwt.expiresIn,
        };
    }

    /**
     * Handle SSO callback (SAML/OAuth2)
     * Creates or updates user based on SSO profile
     */
    async handleSSOCallback(ssoProfile: {
        studentId: string;
        email: string;
        firstName: string;
        lastName: string;
    }): Promise<{ user: any; tokens: AuthTokens }> {
        try {
            // Check if user exists
            let user = await prisma.user.findUnique({
                where: { studentId: ssoProfile.studentId },
            });

            if (!user) {
                // Create new user from SSO profile
                user = await prisma.user.create({
                    data: {
                        studentId: ssoProfile.studentId,
                        email: ssoProfile.email,
                        firstName: ssoProfile.firstName,
                        lastName: ssoProfile.lastName,
                        role: 'student',
                    },
                });

                logger.info(`New user created via SSO: ${user.studentId}`);
            } else {
                // Update user info from SSO
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        email: ssoProfile.email,
                        firstName: ssoProfile.firstName,
                        lastName: ssoProfile.lastName,
                        updatedAt: new Date(),
                    },
                });

                logger.info(`User updated via SSO: ${user.studentId}`);
            }

            // Generate tokens
            const tokens = this.generateTokens(user);

            // Store refresh token in cache (for revocation)
            await cache.set(
                `refresh_token:${user.id}`,
                tokens.refreshToken,
                7 * 24 * 60 * 60 // 7 days
            );

            return { user, tokens };
        } catch (error: any) {
            logger.error('SSO callback error:', error);
            throw error;
        }
    }

    /**
     * Refresh access token using refresh token
     */
    async refreshAccessToken(refreshToken: string): Promise<AuthTokens> {
        try {
            // Verify refresh token
            const payload = this.verifyRefreshToken(refreshToken);

            // Check if refresh token is still valid in cache
            const cachedToken = await cache.get(`refresh_token:${payload.id}`);
            if (cachedToken !== refreshToken) {
                throw new UnauthorizedError('Refresh token has been revoked');
            }

            // Get user from database
            const user = await prisma.user.findUnique({
                where: { id: payload.id },
            });

            if (!user) {
                throw new NotFoundError('User not found');
            }

            // Generate new tokens
            const tokens = this.generateTokens(user);

            // Update refresh token in cache
            await cache.set(
                `refresh_token:${user.id}`,
                tokens.refreshToken,
                7 * 24 * 60 * 60
            );

            logger.info(`Access token refreshed for user: ${user.studentId}`);

            return tokens;
        } catch (error: any) {
            logger.error('Token refresh error:', error);
            throw error;
        }
    }

    /**
     * Logout user (revoke refresh token)
     */
    async logout(userId: string): Promise<void> {
        try {
            // Remove refresh token from cache
            await cache.del(`refresh_token:${userId}`);

            // Optionally: Add access token to blacklist
            // (requires storing token and checking on each request)

            logger.info(`User logged out: ${userId}`);
        } catch (error: any) {
            logger.error('Logout error:', error);
            throw error;
        }
    }

    /**
     * Get user profile
     */
    async getUserProfile(userId: string): Promise<any> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                studentId: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                gpa: true,
                creditsCompleted: true,
                totalCredits: true,
                expectedGraduation: true,
                aiPoints: true,
                createdAt: true,
            },
        });

        if (!user) {
            throw new NotFoundError('User not found');
        }

        return user;
    }

    /**
     * Update user profile
     */
    async updateUserProfile(
        userId: string,
        data: {
            firstName?: string;
            lastName?: string;
            email?: string;
        }
    ): Promise<any> {
        try {
            const user = await prisma.user.update({
                where: { id: userId },
                data: {
                    ...data,
                    updatedAt: new Date(),
                },
                select: {
                    id: true,
                    studentId: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    gpa: true,
                    creditsCompleted: true,
                    totalCredits: true,
                    expectedGraduation: true,
                    aiPoints: true,
                },
            });

            // Invalidate cache
            await cache.delPattern(`user:${userId}*`);

            logger.info(`User profile updated: ${user.studentId}`);

            return user;
        } catch (error: any) {
            logger.error('Profile update error:', error);
            throw error;
        }
    }

    /**
     * Validate SSO token/assertion
     * This is a placeholder - actual implementation depends on SSO provider
     */
    async validateSSOToken(token: string): Promise<any> {
        // This would validate the SAML assertion or OAuth token
        // Implementation depends on the SSO provider
        throw new Error('SSO validation not implemented - configure SSO provider');
    }
}

export const authService = new AuthService();
