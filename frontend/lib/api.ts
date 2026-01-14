import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 and not already retried, try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const response = await axios.post(`${API_URL}/auth/refresh`, {
                        refreshToken,
                    });

                    const { accessToken, refreshToken: newRefreshToken } = response.data.data;
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', newRefreshToken);

                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed, logout user
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Auth API
export const authApi = {
    login: () => {
        window.location.href = `${API_URL}/auth/login`;
    },

    logout: async () => {
        await api.post('/auth/logout');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    },

    getProfile: async () => {
        const response = await api.get('/auth/me');
        return response.data.data;
    },

    updateProfile: async (data: any) => {
        const response = await api.put('/auth/me', data);
        return response.data.data;
    },
};

// Schedule API
export const scheduleApi = {
    getWeekly: async () => {
        const response = await api.get('/schedule/weekly');
        return response.data.data;
    },

    getToday: async () => {
        const response = await api.get('/schedule/today');
        return response.data.data;
    },
};

// Courses API
export const coursesApi = {
    getAll: async () => {
        const response = await api.get('/courses');
        return response.data.data;
    },

    getById: async (id: string) => {
        const response = await api.get(`/courses/${id}`);
        return response.data.data;
    },
};

// Events API
export const eventsApi = {
    getAll: async () => {
        const response = await api.get('/events');
        return response.data.data;
    },

    getById: async (id: string) => {
        const response = await api.get(`/events/${id}`);
        return response.data.data;
    },

    register: async (id: string) => {
        const response = await api.post(`/events/${id}/register`);
        return response.data.data;
    },

    getMyRegistrations: async () => {
        const response = await api.get('/events/my/registrations');
        return response.data.data;
    },
};

// AI Chat API
export const aiChatApi = {
    createSession: async (botType: string) => {
        const response = await api.post('/ai-chat/sessions', { botType });
        return response.data.data;
    },

    sendMessage: async (sessionId: string, message: string) => {
        const response = await api.post(`/ai-chat/sessions/${sessionId}/messages`, { message });
        return response.data.data;
    },

    getHistory: async (sessionId: string) => {
        const response = await api.get(`/ai-chat/sessions/${sessionId}/messages`);
        return response.data.data;
    },

    getSessions: async () => {
        const response = await api.get('/ai-chat/sessions');
        return response.data.data;
    },
};

// Tools API
export const toolsApi = {
    bookRoom: async (data: any) => {
        const response = await api.post('/tools/room-booking', data);
        return response.data.data;
    },

    getBookings: async () => {
        const response = await api.get('/tools/room-booking');
        return response.data.data;
    },

    submitPrintJob: async (data: any) => {
        const response = await api.post('/tools/print-jobs', data);
        return response.data.data;
    },

    getPrintJobs: async () => {
        const response = await api.get('/tools/print-jobs');
        return response.data.data;
    },
};

// Rewards API
export const rewardsApi = {
    getActivities: async () => {
        const response = await api.get('/rewards/activities');
        return response.data.data;
    },

    getPoints: async () => {
        const response = await api.get('/rewards/points');
        return response.data.data;
    },

    registerActivity: async (id: string) => {
        const response = await api.post(`/rewards/activities/${id}/register`);
        return response.data.data;
    },

    getRewards: async () => {
        const response = await api.get('/rewards/rewards');
        return response.data.data;
    },

    redeemReward: async (id: string) => {
        const response = await api.post(`/rewards/rewards/${id}/redeem`);
        return response.data.data;
    },
};
