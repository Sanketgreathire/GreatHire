import cron from 'node-cron';
import { Recruiter } from '../models/recruiter.model.js';
import { Company } from '../models/company.model.js';
import { sendCompanyProfileReminderEmail } from './emailService.js';

// Check and send 1-hour reminder emails
export const sendOneHourReminders = async () => {
  try {
    console.log('🔍 Checking for 1-hour reminders...');
    
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
    

    
    const recruiters = await Recruiter.find({
      isRecruiterLoggedIn: true,
      isCompanyDetailsCompleted: false,
      reminderEmailSent: false, // Only send to those who haven't received email yet
      lastLoginTime: { $lte: oneHourAgo }
    });

    console.log(`📧 Found ${recruiters.length} recruiters for 1-hour reminder`);

    for (const recruiter of recruiters) {
      // Check if company exists
      const company = await Company.findOne({ adminEmail: recruiter.emailId.email });
      
      if (!company) {
        await sendCompanyProfileReminderEmail(recruiter.emailId.email, recruiter.fullname);
        // Mark email as sent to prevent duplicates
        recruiter.reminderEmailSent = true;
        await recruiter.save();
        console.log(`✅ Sent 1-hour reminder to ${recruiter.emailId.email}`);
      } else {
        // Company exists, update the flags
        recruiter.isCompanyDetailsCompleted = true;
        recruiter.reminderEmailSent = true;
        await recruiter.save();
      }
    }
  } catch (error) {
    console.error('❌ Error in sendOneHourReminders:', error);
  }
};

// Check and send weekend reminder emails
export const sendWeekendReminders = async () => {
  try {
    console.log('🔍 Checking for weekend reminders...');
    
    const recruiters = await Recruiter.find({
      isRecruiterLoggedIn: true,
      isCompanyDetailsCompleted: false
    });

    console.log(`📧 Found ${recruiters.length} recruiters for weekend reminder`);

    for (const recruiter of recruiters) {
      // Check if company exists
      const company = await Company.findOne({ adminEmail: recruiter.emailId.email });
      
      if (!company) {
        await sendCompanyProfileReminderEmail(recruiter.emailId.email, recruiter.fullname);
        console.log(`✅ Sent weekend reminder to ${recruiter.emailId.email}`);
      } else {
        // Company exists, update the flags
        recruiter.isCompanyDetailsCompleted = true;
        recruiter.reminderEmailSent = true;
        await recruiter.save();
      }
    }
  } catch (error) {
    console.error('❌ Error in sendWeekendReminders:', error);
  }
};

// Start cron jobs
export const startCompanyProfileReminderJobs = () => {
  console.log('🚀 Starting company profile reminder cron jobs...');
  
  // Run every minute to check for 1-minute reminders (for testing)
  cron.schedule('* * * * *', () => {
    sendOneHourReminders();
  });

  // Run on Saturday and Sunday at 1:00 PM
  cron.schedule('*/30 * * * *', () => {

    sendWeekendReminders();
  });

  console.log('✅ Company profile reminder cron jobs started');
};

