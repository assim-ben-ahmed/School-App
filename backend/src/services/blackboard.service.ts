import { config } from '../config/app.config';
import { blackboardAdapter } from '../adapters/blackboard.adapter';
import { mockBlackboardAdapter } from '../mocks/blackboard.mock';

/**
 * Blackboard Service Wrapper
 * Automatically switches between real and mock adapter based on MOCK_MODE
 */

export const blackboardService = config.mockMode ? mockBlackboardAdapter : blackboardAdapter;
