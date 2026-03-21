import express from 'express';
import { getRecruitersList, getRecruiter, getRecrutierStats, getAllRecruitersList,sendMessage, updateRecruiterEmail, sendBulkCompanyProfileReminders } from '../../controllers/admin/recruiterStats.controller.js';
import isAuthenticated from '../../middlewares/isAuthenticated.js';

const router = express.Router();
// Define routes
router.get('/get-stats', isAuthenticated, getRecrutierStats);
router.get("/getAllRecruiter-stats", isAuthenticated, getAllRecruitersList);
router.get('/recruiter-stats/:companyId', isAuthenticated, getRecruitersList);
router.get('/getUser/:userId', isAuthenticated, getRecruiter);
router.post('/send-message', isAuthenticated, sendMessage);
router.put('/update-email/:recruiterId', isAuthenticated, updateRecruiterEmail);
router.post('/send-bulk-reminders', isAuthenticated, sendBulkCompanyProfileReminders);

// Test endpoint for email configuration
router.post('/test-email', isAuthenticated, async (req, res) => {
  try {
    console.log('🧪 Testing email configuration...');
    
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.default.createTransporter({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Test the connection
    await transporter.verify();
    console.log('✅ Email configuration is working');
    
    res.json({ success: true, message: 'Email configuration is working' });
  } catch (error) {
    console.error('❌ Email configuration error:', error);
    res.status(500).json({ success: false, message: 'Email configuration failed', error: error.message });
  }
});
export default router;