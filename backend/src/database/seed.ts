import { PrismaClient } from '@prisma/client';
import { MOCK_STUDENTS, MOCK_COURSES, MOCK_EVENTS, MOCK_AI_POINTS_ACTIVITIES, MOCK_REWARDS } from '../mocks/testData';

const prisma = new PrismaClient();

/**
 * Seed database with test data
 * Run with: npx tsx src/database/seed.ts
 */

async function main() {
    console.log('🌱 Seeding database with test data...');

    // Clear existing data
    console.log('Clearing existing data...');
    await prisma.rewardRedemption.deleteMany();
    await prisma.userAIPoint.deleteMany();
    await prisma.reward.deleteMany();
    await prisma.aIPointsActivity.deleteMany();
    await prisma.printJob.deleteMany();
    await prisma.roomBooking.deleteMany();
    await prisma.aIChatMessage.deleteMany();
    await prisma.aIChatSession.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.message.deleteMany();
    await prisma.conversationParticipant.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.eventRegistration.deleteMany();
    await prisma.event.deleteMany();
    await prisma.schedule.deleteMany();
    await prisma.userCourse.deleteMany();
    await prisma.course.deleteMany();
    await prisma.user.deleteMany();

    // Create users
    console.log('Creating users...');
    for (const student of MOCK_STUDENTS) {
        await prisma.user.create({
            data: {
                studentId: student.studentId,
                email: student.email,
                firstName: student.firstName,
                lastName: student.lastName,
                role: 'student',
                gpa: student.gpa,
                creditsCompleted: student.creditsCompleted,
                totalCredits: student.totalCredits,
                expectedGraduation: new Date(student.expectedGraduation),
                aiPoints: 150, // Starting AI points
            },
        });
    }
    console.log(`✅ Created ${MOCK_STUDENTS.length} users`);

    // Create courses
    console.log('Creating courses...');
    for (const course of MOCK_COURSES) {
        await prisma.course.create({
            data: {
                code: course.code,
                name: course.name,
                description: course.description,
                credits: course.credits,
                semester: course.semester,
                year: course.year,
            },
        });
    }
    console.log(`✅ Created ${MOCK_COURSES.length} courses`);

    // Enroll first user in all courses
    console.log('Creating course enrollments...');
    const firstUser = await prisma.user.findFirst();
    if (firstUser) {
        const courses = await prisma.course.findMany();
        for (const course of courses) {
            await prisma.userCourse.create({
                data: {
                    userId: firstUser.id,
                    courseId: course.id,
                    progress: Math.floor(Math.random() * 100),
                    grade: ['A', 'A-', 'B+', 'B'][Math.floor(Math.random() * 4)],
                    status: 'active',
                },
            });
        }
        console.log(`✅ Enrolled user in ${courses.length} courses`);
    }

    // Create schedules
    console.log('Creating schedules...');
    const courses = await prisma.course.findMany();
    const scheduleData = [
        { code: 'CS301', day: 0, start: '09:00', end: '10:30', room: 'Room 301', building: 'Building A', type: 'lecture' },
        { code: 'CS301', day: 2, start: '14:00', end: '16:00', room: 'Lab 102', building: 'Building B', type: 'lab' },
        { code: 'DS201', day: 1, start: '10:00', end: '11:30', room: 'Room 205', building: 'Building A', type: 'lecture' },
        { code: 'DS201', day: 3, start: '15:00', end: '17:00', room: 'Lab 201', building: 'Building C', type: 'lab' },
        { code: 'CS202', day: 0, start: '14:00', end: '15:30', room: 'Room 401', building: 'Building A', type: 'lecture' },
        { code: 'DS301', day: 4, start: '09:00', end: '11:00', room: 'Room 302', building: 'Building B', type: 'workshop' },
    ];

    for (const sched of scheduleData) {
        const course = courses.find(c => c.code === sched.code);
        if (course) {
            await prisma.schedule.create({
                data: {
                    courseId: course.id,
                    dayOfWeek: sched.day,
                    startTime: sched.start,
                    endTime: sched.end,
                    room: sched.room,
                    building: sched.building,
                    type: sched.type,
                },
            });
        }
    }
    console.log(`✅ Created ${scheduleData.length} schedule items`);

    // Create events
    console.log('Creating events...');
    for (const event of MOCK_EVENTS) {
        await prisma.event.create({
            data: {
                name: event.name,
                description: event.description,
                eventType: event.eventType,
                date: new Date(event.date),
                startTime: event.startTime,
                endTime: event.endTime,
                location: event.location,
                maxAttendees: event.maxAttendees,
                aiPoints: event.aiPoints,
            },
        });
    }
    console.log(`✅ Created ${MOCK_EVENTS.length} events`);

    // Create AI Points activities
    console.log('Creating AI Points activities...');
    for (const activity of MOCK_AI_POINTS_ACTIVITIES) {
        await prisma.aIPointsActivity.create({
            data: {
                name: activity.name,
                description: activity.description,
                category: activity.category,
                points: activity.points,
                date: new Date(activity.date),
                status: activity.status,
            },
        });
    }
    console.log(`✅ Created ${MOCK_AI_POINTS_ACTIVITIES.length} AI Points activities`);

    // Create rewards
    console.log('Creating rewards...');
    for (const reward of MOCK_REWARDS) {
        await prisma.reward.create({
            data: {
                name: reward.name,
                description: reward.description,
                pointsCost: reward.pointsCost,
                icon: reward.icon,
                available: reward.available,
            },
        });
    }
    console.log(`✅ Created ${MOCK_REWARDS.length} rewards`);

    // Create notifications for first user
    if (firstUser) {
        console.log('Creating notifications...');
        await prisma.notification.createMany({
            data: [
                {
                    userId: firstUser.id,
                    title: 'New Assignment Posted',
                    content: 'Dr. Sarah Williams posted a new assignment in Advanced Algorithms',
                    type: 'assignment',
                    isRead: false,
                },
                {
                    userId: firstUser.id,
                    title: 'Grade Posted',
                    content: 'Your grade for ML Model Training has been posted',
                    type: 'grade',
                    isRead: false,
                },
                {
                    userId: firstUser.id,
                    title: 'Event Reminder',
                    content: 'Wellness Workshop starts in 2 days',
                    type: 'event',
                    isRead: true,
                },
            ],
        });
        console.log('✅ Created 3 notifications');
    }

    console.log('🎉 Database seeded successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
