import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from './config/passport.config';
import { config } from './config/app.config';
import { logger } from './utils/logger';
import { errorHandler, notFoundHandler } from './api/middleware/errorHandler.middleware';
import { rateLimiter } from './api/middleware/rateLimit.middleware';

// Import routes
import authRoutes from './api/routes/auth.routes';
import scheduleRoutes from './api/routes/schedule.routes';
import coursesRoutes from './api/routes/courses.routes';
import eventsRoutes from './api/routes/events.routes';
import aiChatRoutes from './api/routes/ai-chat.routes';
import toolsRoutes from './api/routes/tools.routes';
import rewardsRoutes from './api/routes/rewards.routes';

const app: Application = express();

// Security middleware
app.use(helmet());
app.use(cors({
    origin: config.corsOrigin,
    credentials: true,
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport
app.use(passport.initialize());

// Logging middleware
app.use(morgan('combined', {
    stream: {
        write: (message: string) => logger.http(message.trim()),
    },
}));

// Rate limiting
app.use(rateLimiter);

// Health check
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});

// API routes
const apiPrefix = config.apiPrefix;
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/schedule`, scheduleRoutes);
app.use(`${apiPrefix}/courses`, coursesRoutes);
app.use(`${apiPrefix}/events`, eventsRoutes);
app.use(`${apiPrefix}/ai-chat`, aiChatRoutes);
app.use(`${apiPrefix}/tools`, toolsRoutes);
app.use(`${apiPrefix}/rewards`, rewardsRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

export default app;
