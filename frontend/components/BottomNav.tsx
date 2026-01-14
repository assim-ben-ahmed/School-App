'use client';

import { useUIStore } from '@/lib/store';
import { Home, Calendar, BookOpen, Sparkles, Grid3x3, MessageSquare, User } from 'lucide-react';

const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'ai-chat', label: 'AI Chat', icon: Sparkles },
    { id: 'tools', label: 'Tools', icon: Grid3x3 },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'profile', label: 'Profile', icon: User },
];

export default function BottomNav() {
    const { activeTab, setActiveTab } = useUIStore();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
            <div className="flex items-center justify-around py-2">
                {navItems.slice(0, 5).map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${isActive
                                    ? 'text-indigo-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
                            <span className="text-xs font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
