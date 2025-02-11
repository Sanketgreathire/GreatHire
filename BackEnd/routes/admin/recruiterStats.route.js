import express from 'express';
import { getRecruitersList, getRecruiter, getAllApplication } from '../../controllers/admin/recruiterStats.controller.js';

const router = express.Router();
// Define routes
router.get('/recruiter-stats', getRecruitersList);
router.get('/getUser/:userId', getRecruiter);
router.get('/user-all-application/:userId', getAllApplication);

export default router;