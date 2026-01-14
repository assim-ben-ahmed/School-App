'use client';

import { useAuthStore } from '@/lib/store';
import { Bell, User } from 'lucide-react';

export default function Header() {
    const { user } = useAuthStore();

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                {/* Logo & Title */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-xl">A</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900">Aivancity Hub</h1>
                        <p className="text-xs text-gray-500">Student Portal</p>
                    </div>
                </div>

                {/* User Info & Actions */}
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Bell className="w-5 h-5 text-gray-600" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* User Avatar */}
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-indigo-600" />
                        </div>
                        {user && (
                            <div className="hidden md:block">
                                <p className="text-sm font-semibold text-gray-900">
                                    {user.firstName} {user.lastName}
                                </p>
                                <p className="text-xs text-gray-500">{user.studentId}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
