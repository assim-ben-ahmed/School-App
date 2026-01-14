/**
 * Test Data Generator
 * Generates realistic fake data for testing without real APIs
 */

export const MOCK_STUDENTS = [
    {
        id: 'user-001',
        studentId: 'STU2024001',
        email: 'john.doe@aivancity.edu',
        firstName: 'John',
        lastName: 'Doe',
        program: 'Computer Science',
        year: 3,
        gpa: 3.8,
        creditsCompleted: 90,
        totalCredits: 120,
        expectedGraduation: '2025-06-15',
    },
    {
        id: 'user-002',
        studentId: 'STU2024002',
        email: 'jane.smith@aivancity.edu',
        firstName: 'Jane',
        lastName: 'Smith',
        program: 'Data Science',
        year: 2,
        gpa: 3.9,
        creditsCompleted: 60,
        totalCredits: 120,
        expectedGraduation: '2026-06-15',
    },
    {
        id: 'user-003',
        studentId: 'STU2024003',
        email: 'alex.johnson@aivancity.edu',
        firstName: 'Alex',
        lastName: 'Johnson',
        program: 'Artificial Intelligence',
        year: 1,
        gpa: 3.5,
        creditsCompleted: 30,
        totalCredits: 120,
        expectedGraduation: '2027-06-15',
    },
];

export const MOCK_COURSES = [
    {
        id: 'course-001',
        code: 'CS301',
        name: 'Advanced Algorithms',
        description: 'Study of advanced algorithmic techniques including dynamic programming, greedy algorithms, and graph algorithms.',
        credits: 4,
        semester: 'Fall 2024',
        year: 2024,
        professor: 'Dr. Sarah Williams',
    },
    {
        id: 'course-002',
        code: 'DS201',
        name: 'Machine Learning Fundamentals',
        description: 'Introduction to supervised and unsupervised learning, neural networks, and model evaluation.',
        credits: 4,
        semester: 'Fall 2024',
        year: 2024,
        professor: 'Prof. Michael Chen',
    },
    {
        id: 'course-003',
        code: 'AI401',
        name: 'Deep Learning',
        description: 'Advanced topics in deep learning including CNNs, RNNs, transformers, and GANs.',
        credits: 4,
        semester: 'Fall 2024',
        year: 2024,
        professor: 'Dr. Emily Rodriguez',
    },
    {
        id: 'course-004',
        code: 'CS202',
        name: 'Database Systems',
        description: 'Relational databases, SQL, NoSQL, database design, and optimization.',
        credits: 3,
        semester: 'Fall 2024',
        year: 2024,
        professor: 'Prof. David Lee',
    },
    {
        id: 'course-005',
        code: 'DS301',
        name: 'Data Visualization',
        description: 'Principles and techniques for effective data visualization and storytelling.',
        credits: 3,
        semester: 'Fall 2024',
        year: 2024,
        professor: 'Dr. Lisa Anderson',
    },
];

export const MOCK_SCHEDULE = [
    {
        courseCode: 'CS301',
        courseName: 'Advanced Algorithms',
        dayOfWeek: 0, // Monday
        startTime: '09:00',
        endTime: '10:30',
        room: 'Room 301',
        building: 'Building A',
        professor: 'Dr. Sarah Williams',
        type: 'lecture',
    },
    {
        courseCode: 'CS301',
        courseName: 'Advanced Algorithms',
        dayOfWeek: 2, // Wednesday
        startTime: '14:00',
        endTime: '16:00',
        room: 'Lab 102',
        building: 'Building B',
        professor: 'Dr. Sarah Williams',
        type: 'lab',
    },
    {
        courseCode: 'DS201',
        courseName: 'Machine Learning Fundamentals',
        dayOfWeek: 1, // Tuesday
        startTime: '10:00',
        endTime: '11:30',
        room: 'Room 205',
        building: 'Building A',
        professor: 'Prof. Michael Chen',
        type: 'lecture',
    },
    {
        courseCode: 'DS201',
        courseName: 'Machine Learning Fundamentals',
        dayOfWeek: 3, // Thursday
        startTime: '15:00',
        endTime: '17:00',
        room: 'Lab 201',
        building: 'Building C',
        professor: 'Prof. Michael Chen',
        type: 'lab',
    },
    {
        courseCode: 'CS202',
        courseName: 'Database Systems',
        dayOfWeek: 0, // Monday
        startTime: '14:00',
        endTime: '15:30',
        room: 'Room 401',
        building: 'Building A',
        professor: 'Prof. David Lee',
        type: 'lecture',
    },
    {
        courseCode: 'DS301',
        courseName: 'Data Visualization',
        dayOfWeek: 4, // Friday
        startTime: '09:00',
        endTime: '11:00',
        room: 'Room 302',
        building: 'Building B',
        professor: 'Dr. Lisa Anderson',
        type: 'workshop',
    },
];

export const MOCK_EVENTS = [
    {
        id: 'event-001',
        name: 'AI Research Symposium',
        description: 'Annual symposium featuring cutting-edge AI research from students and faculty.',
        eventType: 'academic',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '17:00',
        location: 'Main Auditorium',
        maxAttendees: 200,
        aiPoints: 50,
    },
    {
        id: 'event-002',
        name: 'Hackathon 2024',
        description: '48-hour coding competition with prizes and networking opportunities.',
        eventType: 'competition',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        startTime: '18:00',
        endTime: '18:00',
        location: 'Innovation Lab',
        maxAttendees: 100,
        aiPoints: 100,
    },
    {
        id: 'event-003',
        name: 'Career Fair',
        description: 'Meet with top tech companies and explore internship opportunities.',
        eventType: 'career',
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        startTime: '10:00',
        endTime: '16:00',
        location: 'Sports Hall',
        maxAttendees: 500,
        aiPoints: 30,
    },
    {
        id: 'event-004',
        name: 'Wellness Workshop: Stress Management',
        description: 'Learn techniques to manage academic stress and maintain mental health.',
        eventType: 'wellness',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        startTime: '14:00',
        endTime: '16:00',
        location: 'Wellness Center',
        maxAttendees: 30,
        aiPoints: 20,
    },
    {
        id: 'event-005',
        name: 'International Food Festival',
        description: 'Celebrate diversity with food from around the world.',
        eventType: 'social',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        startTime: '12:00',
        endTime: '15:00',
        location: 'Campus Courtyard',
        maxAttendees: 300,
        aiPoints: 15,
    },
];

export const MOCK_ASSIGNMENTS = [
    {
        id: 'assign-001',
        courseCode: 'CS301',
        name: 'Dynamic Programming Assignment',
        description: 'Implement solutions to classic DP problems.',
        due: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        points: 100,
    },
    {
        id: 'assign-002',
        courseCode: 'DS201',
        name: 'ML Model Training',
        description: 'Train and evaluate a classification model on the provided dataset.',
        due: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        points: 150,
    },
    {
        id: 'assign-003',
        courseCode: 'CS202',
        name: 'Database Design Project',
        description: 'Design and implement a normalized database schema.',
        due: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        points: 120,
    },
];

export const MOCK_GRADES = [
    { courseCode: 'CS301', courseName: 'Advanced Algorithms', score: 88, possible: 100, grade: 'A-' },
    { courseCode: 'DS201', courseName: 'Machine Learning Fundamentals', score: 92, possible: 100, grade: 'A' },
    { courseCode: 'CS202', courseName: 'Database Systems', score: 85, possible: 100, grade: 'B+' },
    { courseCode: 'DS301', courseName: 'Data Visualization', score: 95, possible: 100, grade: 'A' },
];

export const MOCK_ANNOUNCEMENTS = [
    {
        id: 'ann-001',
        title: 'Campus Closure - Holiday Break',
        content: 'The campus will be closed from December 20th to January 5th for winter break. Happy holidays!',
        category: 'general',
        publishedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'high',
    },
    {
        id: 'ann-002',
        title: 'Library Extended Hours During Finals',
        content: 'The library will be open 24/7 during the final exam period (Dec 10-20).',
        category: 'academic',
        publishedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'medium',
    },
    {
        id: 'ann-003',
        title: 'New AI Lab Equipment Available',
        content: 'State-of-the-art GPU servers are now available for student research projects. Book your time slot online.',
        category: 'facilities',
        publishedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'medium',
    },
];

export const MOCK_NOTIFICATIONS = [
    {
        id: 'notif-001',
        title: 'New Assignment Posted',
        content: 'Dr. Sarah Williams posted a new assignment in Advanced Algorithms',
        type: 'assignment',
        isRead: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'notif-002',
        title: 'Grade Posted',
        content: 'Your grade for ML Model Training has been posted',
        type: 'grade',
        isRead: false,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'notif-003',
        title: 'Event Reminder',
        content: 'Wellness Workshop starts in 2 days',
        type: 'event',
        isRead: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'notif-004',
        title: 'System Maintenance',
        content: 'The student portal will be down for maintenance on Saturday 2-4 AM',
        type: 'system',
        isRead: true,
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    },
];

export const MOCK_AI_POINTS_ACTIVITIES = [
    {
        id: 'activity-001',
        name: 'Study Group Session',
        description: 'Participate in a peer-led study group',
        category: 'study_group',
        points: 10,
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'upcoming',
    },
    {
        id: 'activity-002',
        name: 'Research Paper Presentation',
        description: 'Present your research at the symposium',
        category: 'academic',
        points: 50,
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'upcoming',
    },
    {
        id: 'activity-003',
        name: 'Volunteer at Career Fair',
        description: 'Help organize and run the career fair',
        category: 'volunteer',
        points: 30,
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'upcoming',
    },
];

export const MOCK_REWARDS = [
    {
        id: 'reward-001',
        name: 'Free Coffee Voucher',
        description: '5 free coffees at campus café',
        pointsCost: 50,
        icon: '☕',
        available: true,
    },
    {
        id: 'reward-002',
        name: 'Priority Course Registration',
        description: 'Register for courses 24 hours early',
        pointsCost: 100,
        icon: '📚',
        available: true,
    },
    {
        id: 'reward-003',
        name: 'Extended Library Access',
        description: '1 month of 24/7 library access',
        pointsCost: 75,
        icon: '📖',
        available: true,
    },
    {
        id: 'reward-004',
        name: 'Campus Merch',
        description: 'Exclusive Aivancity hoodie',
        pointsCost: 150,
        icon: '👕',
        available: true,
    },
];

// Helper function to simulate network delay
export const simulateDelay = (ms: number = 500): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

// Helper function to simulate random failures
export const simulateFailure = (failureRate: number = 0.1): boolean => {
    return Math.random() < failureRate;
};
