import dotenv from 'dotenv';

dotenv.config();

export const config = {
    // Server
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '4000', 10),
    apiPrefix: process.env.API_PREFIX || '/api/v1',

    // Mock Mode (for testing without real APIs)
    mockMode: process.env.MOCK_MODE === 'true',
    mockDelay: parseInt(process.env.MOCK_DELAY_MS || '500', 10),
    mockFailureRate: parseFloat(process.env.MOCK_FAILURE_RATE || '0.0'),

    // Database
    databaseUrl: process.env.DATABASE_URL || '',

    // Redis
    redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',

    // JWT
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
        refreshSecret: process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret',
        refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
    },

    // SSO
    sso: {
        strategy: process.env.SSO_STRATEGY || 'saml',
        callbackUrl: process.env.SSO_CALLBACK_URL || 'http://localhost:4000/api/v1/auth/callback',
        issuer: process.env.SSO_ISSUER || '',
        entryPoint: process.env.SSO_ENTRY_POINT || '',
        cert: process.env.SSO_CERT || '',
    },

    // External APIs - Intranet
    intranet: {
        apiUrl: process.env.INTRANET_API_URL || '',
        apiKey: process.env.INTRANET_API_KEY || '',
    },

    // External APIs - Blackboard
    blackboard: {
        apiUrl: process.env.BLACKBOARD_API_URL || '',
        apiKey: process.env.BLACKBOARD_API_KEY || '',
        apiSecret: process.env.BLACKBOARD_API_SECRET || '',
    },

    // OpenAI
    openai: {
        apiKey: process.env.OPENAI_API_KEY || '',
        model: process.env.OPENAI_MODEL || 'gpt-4',
        maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '500', 10),
    },

    // Rate Limiting
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    },

    // CORS
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',

    // Logging
    logLevel: process.env.LOG_LEVEL || 'info',
};
