import { config } from '../config/app.config';
import { intranetAdapter } from '../adapters/intranet.adapter';
import { mockIntranetAdapter } from '../mocks/intranet.mock';

/**
 * Intranet Service Wrapper
 * Automatically switches between real and mock adapter based on MOCK_MODE
 */

export const intranetService = config.mockMode ? mockIntranetAdapter : intranetAdapter;
