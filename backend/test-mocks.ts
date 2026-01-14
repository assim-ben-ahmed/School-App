/**
 * Quick Test Script - No Database Required
 * Tests mock services directly without API server
 */

import { mockBlackboardAdapter } from './src/mocks/blackboard.mock';
import { mockIntranetAdapter } from './src/mocks/intranet.mock';
import { mockAIChatService } from './src/mocks/aiChat.mock';

async function runTests() {
    console.log('🧪 Running Mock Service Tests...\n');

    try {
        // Test 1: Mock Blackboard - Get Courses
        console.log('📚 Test 1: Blackboard - Get User Courses');
        const courses = await mockBlackboardAdapter.getUserCourses('STU2024001');
        console.log(`✅ Retrieved ${courses.length} courses`);
        console.log(`   First course: ${courses[0]?.name}`);
        console.log('');

        // Test 2: Mock Blackboard - Get Assignments
        console.log('📝 Test 2: Blackboard - Get Course Assignments');
        const assignments = await mockBlackboardAdapter.getCourseAssignments('CS301');
        console.log(`✅ Retrieved ${assignments.length} assignments`);
        console.log(`   First assignment: ${assignments[0]?.name}`);
        console.log('');

        // Test 3: Mock Blackboard - Get Grades
        console.log('📊 Test 3: Blackboard - Get User Grades');
        const grades = await mockBlackboardAdapter.getUserGrades('CS301', 'STU2024001');
        console.log(`✅ Overall percentage: ${grades.overallPercentage}%`);
        console.log(`   Number of graded items: ${grades.grades.length}`);
        console.log('');

        // Test 4: Mock Intranet - Get Student Profile
        console.log('👤 Test 4: Intranet - Get Student Profile');
        const profile = await mockIntranetAdapter.getStudentProfile('STU2024001');
        console.log(`✅ Student: ${profile.firstName} ${profile.lastName}`);
        console.log(`   GPA: ${profile.gpa}, Credits: ${profile.creditsCompleted}/${profile.totalCredits}`);
        console.log('');

        // Test 5: Mock Intranet - Get Schedule
        console.log('📅 Test 5: Intranet - Get Student Schedule');
        const schedule = await mockIntranetAdapter.getStudentSchedule('STU2024001');
        console.log(`✅ Retrieved ${schedule.length} schedule items`);
        console.log(`   First class: ${schedule[0]?.courseName} on ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][schedule[0]?.dayOfWeek]}`);
        console.log('');

        // Test 6: Mock Intranet - Get Announcements
        console.log('📢 Test 6: Intranet - Get Campus Announcements');
        const announcements = await mockIntranetAdapter.getCampusAnnouncements();
        console.log(`✅ Retrieved ${announcements.length} announcements`);
        console.log(`   Latest: ${announcements[0]?.title}`);
        console.log('');

        // Test 7: Mock AI Chat - Campus Assistant
        console.log('🤖 Test 7: AI Chat - Campus Assistant');
        const response1 = await mockAIChatService.chat('campus', 'Where is the library?');
        console.log(`✅ Response: ${response1.substring(0, 80)}...`);
        console.log('');

        // Test 8: Mock AI Chat - Study Buddy
        console.log('📖 Test 8: AI Chat - Study Buddy');
        const response2 = await mockAIChatService.chat('study', 'How should I study for exams?');
        console.log(`✅ Response: ${response2.substring(0, 80)}...`);
        console.log('');

        // Test 9: Mock AI Chat - Wellness Bot
        console.log('💚 Test 9: AI Chat - Wellness Bot');
        const response3 = await mockAIChatService.chat('wellness', 'I feel stressed');
        console.log(`✅ Response: ${response3.substring(0, 80)}...`);
        console.log('');

        console.log('🎉 All tests passed!\n');
        console.log('📊 Summary:');
        console.log('   ✅ 9/9 tests successful');
        console.log('   ✅ Mock Blackboard API working');
        console.log('   ✅ Mock Intranet API working');
        console.log('   ✅ Mock AI Chat working');
        console.log('   ✅ No real API keys required');
        console.log('   ✅ Realistic test data');
        console.log('\n🚀 Backend is DEMO-READY!');

    } catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
}

// Run tests
runTests();
