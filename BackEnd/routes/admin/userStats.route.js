import express from 'express';
import { getUsersList, getAllApplication } from '../../controllers/admin/userStats.controller';

const router = express.Router();
// Define routes
router.get('/user-stats', getUsersList);
router.get('/user-all-application/:userId', getAllApplication);

// Export the router as the default export
module.exports = router;