import express from 'express';
import { getUsersList, getUser, getAllApplication } from '../../controllers/admin/userStats.controller.js';

const router = express.Router();
// Define routes
router.get('/user-stats', getUsersList);
router.get('/getUser/:userId', getUser);
router.get('/user-all-application/:userId', getAllApplication);

export default router;