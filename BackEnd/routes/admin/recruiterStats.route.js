import express from 'express';
import { getRecruitersList, getRecruiter, getRecrutierStats, getAllRecruitersList } from '../../controllers/admin/recruiterStats.controller.js';

const router = express.Router();
// Define routes
router.get('/get-stats', getRecrutierStats);
router.get("/getAllRecruiter-stats", getAllRecruitersList);
router.get('/recruiter-stats/:companyId', getRecruitersList);
router.get('/getUser/:userId', getRecruiter);

export default router;