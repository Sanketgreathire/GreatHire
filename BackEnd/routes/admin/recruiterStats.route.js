import express from 'express';
import { getRecruitersList, getRecruiter, getRecrutierStats, getAllRecruitersList } from '../../controllers/admin/recruiterStats.controller.js';
import isAuthenticated from '../../middlewares/isAuthenticated.js';

const router = express.Router();
// Define routes
router.get('/get-stats', isAuthenticated, getRecrutierStats);
router.get("/getAllRecruiter-stats", isAuthenticated, getAllRecruitersList);
router.get('/recruiter-stats/:companyId', isAuthenticated, getRecruitersList);
router.get('/getUser/:userId', isAuthenticated, getRecruiter);

export default router;