import notificationService from './utils/notificationService.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';

dotenv.config();

// Test notification system
async function testNotifications() {
  try {
    await connectDB();
    console.log('🔗 Connected to database');

    // Test data - replace with actual user/job IDs from your database
    const testData = {
      userId: '60f1b2b3c4d5e6f7a8b9c0d1', // Replace with actual user ID
      recruiterId: '60f1b2b3c4d5e6f7a8b9c0d2', // Replace with actual recruiter ID
      jobId: '60f1b2b3c4d5e6f7a8b9c0d3', // Replace with actual job ID
      jobTitle: 'Senior React Developer',
      companyName: 'TechCorp Inc.'
    };

    console.log('🧪 Testing notification system...');

    // Test 1: Welcome notification
    console.log('1. Testing welcome notification...');
    await notificationService.notifyWelcome({
      userId: testData.userId,
      userType: 'student',
      name: 'John Doe'
    });

    // Test 2: Job match notification
    console.log('2. Testing job match notification...');
    await notificationService.notifyJobMatch({
      userId: testData.userId,
      jobId: testData.jobId,
      jobTitle: testData.jobTitle,
      companyName: testData.companyName,
      matchScore: 85,
      location: 'San Francisco, CA',
      salary: '$80,000 - $120,000'
    });

    // Test 3: Application submitted notification
    console.log('3. Testing application submitted notification...');
    await notificationService.notifyApplicationSubmitted({
      applicantId: testData.userId,
      jobId: testData.jobId,
      jobTitle: testData.jobTitle,
      companyName: testData.companyName,
      recruiterId: testData.recruiterId,
      applicationId: 'test-app-id'
    });

    // Test 4: Application status change notification
    console.log('4. Testing application status change notification...');
    await notificationService.notifyApplicationStatusChanged({
      applicantId: testData.userId,
      jobId: testData.jobId,
      jobTitle: testData.jobTitle,
      companyName: testData.companyName,
      status: 'Shortlisted',
      previousStatus: 'Pending',
      recruiterId: testData.recruiterId
    });

    // Test 5: Job posted notification
    console.log('5. Testing job posted notification...');
    await notificationService.notifyNewJobPosted({
      recruiterId: testData.recruiterId,
      jobId: testData.jobId,
      jobTitle: testData.jobTitle,
      companyName: testData.companyName
    });

    console.log('✅ All notification tests completed successfully!');
    console.log('📱 Check your database for the created notifications');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run tests
testNotifications();
