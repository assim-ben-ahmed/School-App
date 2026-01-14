import Redis from 'ioredis';
import { config } from '../config/app.config';
import { logger } from './logger';

class CacheService {
    private client: Redis;

    constructor() {
        this.client = new Redis(config.redisUrl);

        this.client.on('connect', () => {
            logger.info('Redis connected successfully');
        });

        this.client.on('error', (err) => {
            logger.error(`Redis error: ${err.message}`);
        });
    }

    async get<T>(key: string): Promise<T | null> {
        try {
            const data = await this.client.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            logger.error(`Cache get error: ${error}`);
            return null;
        }
    }

    async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
        try {
            const serialized = JSON.stringify(value);
            if (ttlSeconds) {
                await this.client.setex(key, ttlSeconds, serialized);
            } else {
                await this.client.set(key, serialized);
            }
        } catch (error) {
            logger.error(`Cache set error: ${error}`);
        }
    }

    async del(key: string): Promise<void> {
        try {
            await this.client.del(key);
        } catch (error) {
            logger.error(`Cache delete error: ${error}`);
        }
    }

    async delPattern(pattern: string): Promise<void> {
        try {
            const keys = await this.client.keys(pattern);
            if (keys.length > 0) {
                await this.client.del(...keys);
            }
        } catch (error) {
            logger.error(`Cache delete pattern error: ${error}`);
        }
    }

    async exists(key: string): Promise<boolean> {
        try {
            const result = await this.client.exists(key);
            return result === 1;
        } catch (error) {
            logger.error(`Cache exists error: ${error}`);
            return false;
        }
    }
}

export const cache = new CacheService();
