import express from 'express';
import { getRecruitersList, getRecruiter, getRecrutierStats, getAllRecruitersList, sendMessage, updateRecruiterEmail, getInactiveJobRecruiters, sendFirstJobReminderEmails } from '../../controllers/admin/recruiterStats.controller.js';
import isAuthenticated from '../../middlewares/isAuthenticated.js';

const router = express.Router();
// Define routes
router.get('/get-stats', isAuthenticated, getRecrutierStats);
router.get("/getAllRecruiter-stats", isAuthenticated, getAllRecruitersList);
router.get('/recruiter-stats/:companyId', isAuthenticated, getRecruitersList);
router.get('/getUser/:userId', isAuthenticated, getRecruiter);
router.post('/send-message', isAuthenticated, sendMessage);
router.put('/update-email/:recruiterId', isAuthenticated, updateRecruiterEmail);
router.get('/inactive-job-recruiters', isAuthenticated, getInactiveJobRecruiters);
router.post('/send-first-job-reminder', isAuthenticated, sendFirstJobReminderEmails);

export default router;