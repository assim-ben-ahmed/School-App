import { create } from 'zustand';

interface User {
    id: string;
    studentId: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    gpa?: number;
    creditsCompleted?: number;
    totalCredits?: number;
    aiPoints?: number;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    setUser: (user) => set({ user, isAuthenticated: !!user }),
    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ user: null, isAuthenticated: false });
    },
}));

interface UIState {
    activeTab: string;
    isModalOpen: boolean;
    modalContent: React.ReactNode | null;
    setActiveTab: (tab: string) => void;
    openModal: (content: React.ReactNode) => void;
    closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    activeTab: 'home',
    isModalOpen: false,
    modalContent: null,
    setActiveTab: (tab) => set({ activeTab: tab }),
    openModal: (content) => set({ isModalOpen: true, modalContent: content }),
    closeModal: () => set({ isModalOpen: false, modalContent: null }),
}));
