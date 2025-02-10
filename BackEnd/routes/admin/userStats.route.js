import express from 'express';
import { getUserStats, getAllApplication } from '../../controllers/admin/userStats.controller';

const router = express.Router();
// Define routes
router.get('/user-stats', getUserStats);
router.get('/user-all-application/:userId', getAllApplication);

// Export the router as the default export
module.exports = router;