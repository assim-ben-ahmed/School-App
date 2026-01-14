/**
 * 🎬 INTERACTIVE BACKEND DEMO
 * 
 * This script demonstrates the student app backend in action
 * with realistic mock data and AI responses.
 * 
 * No API keys required - everything runs in MOCK MODE!
 */

import { mockBlackboardAdapter } from './src/mocks/blackboard.mock';
import { mockIntranetAdapter } from './src/mocks/intranet.mock';
import { mockAIChatService } from './src/mocks/aiChat.mock';

// Utility functions for demo
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const printHeader = (title: string) => {
    console.log('\n' + '='.repeat(70));
    console.log(`  ${title}`);
    console.log('='.repeat(70) + '\n');
};

const printSection = (title: string) => {
    console.log(`\n${'─'.repeat(70)}`);
    console.log(`  ${title}`);
    console.log('─'.repeat(70));
};

const printSuccess = (message: string) => {
    console.log(`✅ ${message}`);
};

const printInfo = (label: string, value: any) => {
    console.log(`   ${label}: ${value}`);
};

const printData = (data: any) => {
    console.log(JSON.stringify(data, null, 2));
};

async function runDemo() {
    printHeader('🎓 AIVANCITY STUDENT APP - BACKEND DEMO');
    console.log('Welcome to the interactive backend demonstration!');
    console.log('This demo shows all features working with mock data.\n');
    console.log('🔧 Mode: MOCK (No real API keys needed)');
    console.log('⏱️  Simulated delay: 500ms per request');
    console.log('📊 Test data: 3 students, 5 courses, 5 events, 6 AI bots\n');

    await sleep(2000);

    // ========================================
    // SCENARIO 1: Student Login & Profile
    // ========================================
    printHeader('📱 SCENARIO 1: Student Login & Profile');

    console.log('👤 Student John Doe logs into the app...\n');
    await sleep(1000);

    printSection('Fetching Student Profile from Intranet');
    const profile = await mockIntranetAdapter.getStudentProfile('STU2024001');
    printSuccess('Profile loaded successfully!');
    printInfo('Name', `${profile.firstName} ${profile.lastName}`);
    printInfo('Student ID', profile.studentId);
    printInfo('Email', profile.email);
    printInfo('Program', profile.program);
    printInfo('Year', profile.year);
    printInfo('GPA', profile.gpa);
    printInfo('Credits', `${profile.creditsCompleted}/${profile.totalCredits}`);
    printInfo('Expected Graduation', profile.expectedGraduation);

    await sleep(2000);

    // ========================================
    // SCENARIO 2: View Today's Schedule
    // ========================================
    printHeader('📅 SCENARIO 2: View Today\'s Schedule');

    console.log('John wants to see his classes for today...\n');
    await sleep(1000);

    printSection('Fetching Weekly Schedule from Intranet');
    const schedule = await mockIntranetAdapter.getStudentSchedule('STU2024001');
    printSuccess(`Retrieved ${schedule.length} classes for the week`);

    console.log('\n📚 Today\'s Classes (Monday):');
    const mondayClasses = schedule.filter(s => s.dayOfWeek === 0);
    mondayClasses.forEach((cls, idx) => {
        console.log(`\n   ${idx + 1}. ${cls.courseName} (${cls.courseCode})`);
        printInfo('   Time', `${cls.startTime} - ${cls.endTime}`);
        printInfo('   Location', `${cls.room}, ${cls.building}`);
        printInfo('   Professor', cls.professor);
        printInfo('   Type', cls.type);
    });

    await sleep(2000);

    // ========================================
    // SCENARIO 3: Check Grades
    // ========================================
    printHeader('📊 SCENARIO 3: Check Grades & Academic Progress');

    console.log('John checks his grades in Advanced Algorithms...\n');
    await sleep(1000);

    printSection('Fetching Grades from Blackboard');
    const grades = await mockBlackboardAdapter.getUserGrades('CS301', 'STU2024001');
    printSuccess('Grades loaded successfully!');
    printInfo('Course', 'CS301 - Advanced Algorithms');
    printInfo('Overall Score', `${grades.overallPercentage}%`);

    console.log('\n   📝 Grade Breakdown:');
    grades.grades.forEach((grade: any) => {
        console.log(`      • ${grade.columnName}: ${grade.score}/${grade.possible} (${grade.text})`);
    });

    await sleep(2000);

    // ========================================
    // SCENARIO 4: View Assignments
    // ========================================
    printHeader('📝 SCENARIO 4: Upcoming Assignments');

    console.log('John checks for upcoming assignments...\n');
    await sleep(1000);

    printSection('Fetching Assignments from Blackboard');
    const assignments = await mockBlackboardAdapter.getCourseAssignments('CS301');
    printSuccess(`Found ${assignments.length} assignments`);

    console.log('\n   📋 Assignment List:');
    assignments.forEach((assignment: any, idx: number) => {
        console.log(`\n   ${idx + 1}. ${assignment.name}`);
        printInfo('   Description', assignment.description);
        printInfo('   Due Date', new Date(assignment.due).toLocaleDateString());
        printInfo('   Points', assignment.points);
    });

    await sleep(2000);

    // ========================================
    // SCENARIO 5: Campus Announcements
    // ========================================
    printHeader('📢 SCENARIO 5: Campus Announcements');

    console.log('Checking latest campus announcements...\n');
    await sleep(1000);

    printSection('Fetching Announcements from Intranet');
    const announcements = await mockIntranetAdapter.getCampusAnnouncements();
    printSuccess(`Retrieved ${announcements.length} announcements`);

    announcements.forEach((ann: any, idx: number) => {
        console.log(`\n   ${idx + 1}. ${ann.title}`);
        printInfo('   Category', ann.category);
        printInfo('   Priority', ann.priority);
        printInfo('   Published', new Date(ann.publishedDate).toLocaleDateString());
        console.log(`   ${ann.content.substring(0, 100)}...`);
    });

    await sleep(2000);

    // ========================================
    // SCENARIO 6: AI Chat - Campus Assistant
    // ========================================
    printHeader('🤖 SCENARIO 6: AI Chat - Campus Assistant');

    console.log('John asks the Campus Assistant about the library...\n');
    await sleep(1000);

    printSection('AI Chat Session');
    console.log('👤 John: "Where is the library and what are the hours?"\n');
    await sleep(500);

    const response1 = await mockAIChatService.chat('campus', 'Where is the library and what are the hours?');
    console.log('🤖 Campus Assistant:');
    console.log(`   ${response1}\n`);

    await sleep(2000);

    // ========================================
    // SCENARIO 7: AI Chat - Study Buddy
    // ========================================
    printHeader('📖 SCENARIO 7: AI Chat - Study Buddy');

    console.log('John needs help studying for his algorithms exam...\n');
    await sleep(1000);

    printSection('AI Chat Session');
    console.log('👤 John: "What\'s the best way to study for my algorithms exam?"\n');
    await sleep(500);

    const response2 = await mockAIChatService.chat('study', 'What\'s the best way to study for my algorithms exam?');
    console.log('🤖 Study Buddy:');
    console.log(`   ${response2}\n`);

    await sleep(2000);

    // ========================================
    // SCENARIO 8: AI Chat - Wellness Bot
    // ========================================
    printHeader('💚 SCENARIO 8: AI Chat - Wellness Bot');

    console.log('John is feeling stressed about exams...\n');
    await sleep(1000);

    printSection('AI Chat Session');
    console.log('👤 John: "I\'m feeling really stressed about my upcoming exams"\n');
    await sleep(500);

    const response3 = await mockAIChatService.chat('wellness', 'I\'m feeling really stressed about my upcoming exams');
    console.log('🤖 Wellness Bot:');
    console.log(`   ${response3}\n`);

    await sleep(2000);

    // ========================================
    // SCENARIO 9: Browse Courses
    // ========================================
    printHeader('📚 SCENARIO 9: Browse All Courses');

    console.log('John views all his enrolled courses...\n');
    await sleep(1000);

    printSection('Fetching Enrolled Courses from Blackboard');
    const courses = await mockBlackboardAdapter.getUserCourses('STU2024001');
    printSuccess(`Enrolled in ${courses.length} courses`);

    console.log('\n   📖 Course List:');
    courses.forEach((course: any, idx: number) => {
        console.log(`\n   ${idx + 1}. ${course.name} (${course.courseId})`);
        printInfo('   Description', course.description?.substring(0, 80) + '...');
        printInfo('   Role', course.role);
        printInfo('   Status', course.available ? 'Active' : 'Inactive');
    });

    await sleep(2000);

    // ========================================
    // DEMO SUMMARY
    // ========================================
    printHeader('✅ DEMO COMPLETE!');

    console.log('🎉 All features demonstrated successfully!\n');

    console.log('📊 What we tested:');
    console.log('   ✅ Student profile retrieval');
    console.log('   ✅ Weekly schedule/timetable');
    console.log('   ✅ Grade checking');
    console.log('   ✅ Assignment tracking');
    console.log('   ✅ Campus announcements');
    console.log('   ✅ AI Chat - Campus Assistant');
    console.log('   ✅ AI Chat - Study Buddy');
    console.log('   ✅ AI Chat - Wellness Bot');
    console.log('   ✅ Course enrollment list');

    console.log('\n🔧 Technical Details:');
    console.log('   • Mock Mode: ENABLED');
    console.log('   • API Keys Required: NONE');
    console.log('   • Database Required: NO (for this demo)');
    console.log('   • Response Time: ~500ms (simulated)');
    console.log('   • Test Data: Realistic & consistent');

    console.log('\n🚀 Ready for:');
    console.log('   • Frontend integration');
    console.log('   • Stakeholder demos');
    console.log('   • User acceptance testing');
    console.log('   • Production deployment (with real APIs)');

    console.log('\n💡 Next Steps:');
    console.log('   1. Connect frontend (React/Next.js)');
    console.log('   2. Configure real API credentials');
    console.log('   3. Set MOCK_MODE=false in production');
    console.log('   4. Deploy to cloud platform');

    printHeader('Thank you for watching! 🎓');
}

// Run the demo
console.clear();
runDemo().catch(console.error);
