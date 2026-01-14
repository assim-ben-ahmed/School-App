'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import Modal from '@/components/Modal';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuthStore, useUIStore } from '@/lib/store';
import { Calendar, BookOpen, Trophy, Sparkles, Grid3x3, TrendingUp, Award } from 'lucide-react';

export default function Home() {
  const { user, setUser } = useAuthStore();
  const { activeTab } = useUIStore();
  const [loading, setLoading] = useState(false);

  // Mock data for demo (since we don't have real auth yet)
  useEffect(() => {
    // Set mock user for demo
    setUser({
      id: 'user-001',
      studentId: 'STU2024001',
      email: 'john.doe@aivancity.edu',
      firstName: 'John',
      lastName: 'Doe',
      role: 'student',
      gpa: 3.8,
      creditsCompleted: 90,
      totalCredits: 120,
      aiPoints: 150,
    });
  }, [setUser]);

  // Mock today's classes
  const todayClasses = [
    {
      courseName: 'Advanced Algorithms',
      courseCode: 'CS301',
      startTime: '09:00',
      endTime: '10:30',
      room: 'Room 301',
      building: 'Building A',
      type: 'Lecture',
    },
    {
      courseName: 'Database Systems',
      courseCode: 'CS202',
      startTime: '14:00',
      endTime: '15:30',
      room: 'Room 401',
      building: 'Building A',
      type: 'Lecture',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="gradient-primary rounded-2xl p-6 text-white mb-6">
          <h2 className="text-2xl font-bold mb-2">
            Welcome back, {user?.firstName}! 👋
          </h2>
          <p className="text-indigo-100">
            You have {todayClasses.length} classes today
          </p>
          <div className="mt-4 flex items-center gap-4 flex-wrap">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
              <p className="text-xs text-indigo-100">GPA</p>
              <p className="text-xl font-bold">{user?.gpa || 'N/A'}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
              <p className="text-xs text-indigo-100">AI Points</p>
              <p className="text-xl font-bold">{user?.aiPoints || 0}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
              <p className="text-xs text-indigo-100">Credits</p>
              <p className="text-xl font-bold">
                {user?.creditsCompleted}/{user?.totalCredits}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickActionCard
              icon={<Calendar className="w-6 h-6" />}
              label="Schedule"
              color="bg-blue-500"
            />
            <QuickActionCard
              icon={<BookOpen className="w-6 h-6" />}
              label="Courses"
              color="bg-green-500"
            />
            <QuickActionCard
              icon={<Sparkles className="w-6 h-6" />}
              label="AI Chat"
              color="bg-purple-500"
            />
            <QuickActionCard
              icon={<Grid3x3 className="w-6 h-6" />}
              label="Tools"
              color="bg-orange-500"
            />
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Today's Classes</h3>
            <button className="text-sm text-indigo-600 font-semibold hover:text-indigo-700">
              View All →
            </button>
          </div>
          {todayClasses.length > 0 ? (
            <div className="space-y-3">
              {todayClasses.map((cls: any, idx: number) => (
                <ClassCard key={idx} classData={cls} />
              ))}
            </div>
          ) : (
            <div className="card text-center py-8">
              <p className="text-gray-500">No classes today! Enjoy your free time 🎉</p>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatsCard
            icon={<TrendingUp className="w-6 h-6 text-green-600" />}
            label="Attendance"
            value="94%"
            trend="+2%"
            trendUp={true}
          />
          <StatsCard
            icon={<BookOpen className="w-6 h-6 text-blue-600" />}
            label="Courses"
            value="5"
            subtitle="Active"
          />
          <StatsCard
            icon={<Award className="w-6 h-6 text-purple-600" />}
            label="Achievements"
            value="12"
            subtitle="Unlocked"
          />
        </div>

        {/* Upcoming Events */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Upcoming Events</h3>
            <button className="text-sm text-indigo-600 font-semibold hover:text-indigo-700">
              View All →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EventCard
              title="AI Research Symposium"
              date="Jan 21, 2026"
              time="09:00 AM"
              location="Main Auditorium"
              points={50}
            />
            <EventCard
              title="Hackathon 2024"
              date="Jan 28, 2026"
              time="06:00 PM"
              location="Innovation Lab"
              points={100}
            />
          </div>
        </div>

        {/* Announcements */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Announcements</h3>
          <div className="card">
            <div className="flex items-start gap-3 mb-3 pb-3 border-b border-gray-100">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">Library Extended Hours</h4>
                <p className="text-sm text-gray-600">
                  The library will be open 24/7 during the final exam period (Dec 10-20).
                </p>
                <p className="text-xs text-gray-400 mt-1">2 days ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">New AI Lab Equipment</h4>
                <p className="text-sm text-gray-600">
                  State-of-the-art GPU servers are now available for student research projects.
                </p>
                <p className="text-xs text-gray-400 mt-1">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
      <Modal />
    </div>
  );
}

function QuickActionCard({ icon, label, color }: any) {
  return (
    <button className="card card-hover flex flex-col items-center gap-2 py-6">
      <div className={`${color} w-12 h-12 rounded-xl flex items-center justify-center text-white`}>
        {icon}
      </div>
      <span className="text-sm font-semibold text-gray-700">{label}</span>
    </button>
  );
}

function ClassCard({ classData }: any) {
  return (
    <div className="card flex items-center gap-4">
      <div className="bg-indigo-100 rounded-xl p-3">
        <Calendar className="w-6 h-6 text-indigo-600" />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">{classData.courseName}</h4>
        <p className="text-sm text-gray-500">
          {classData.startTime} - {classData.endTime} • {classData.room}
        </p>
      </div>
      <div className="text-right">
        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          {classData.type}
        </span>
      </div>
    </div>
  );
}

function StatsCard({ icon, label, value, subtitle, trend, trendUp }: any) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <div className="bg-gray-50 rounded-lg p-2">{icon}</div>
        {trend && (
          <span className={`text-xs font-semibold ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{subtitle || label}</p>
    </div>
  );
}

function EventCard({ title, date, time, location, points }: any) {
  return (
    <div className="card card-hover">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
          +{points} pts
        </span>
      </div>
      <div className="space-y-1 text-sm text-gray-600">
        <p>📅 {date}</p>
        <p>🕐 {time}</p>
        <p>📍 {location}</p>
      </div>
      <button className="mt-3 w-full bg-indigo-50 text-indigo-600 py-2 rounded-lg font-semibold hover:bg-indigo-100 transition-colors">
        Register
      </button>
    </div>
  );
}
