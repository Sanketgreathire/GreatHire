import express from "express";
import {
  getUserStats,
  getUsersList,
  getUser,
  getAllApplication,
} from "../../controllers/admin/userStats.controller.js";
import isAuthenticated from "../../middlewares/isAuthenticated.js";

const router = express.Router();
// Define routes
router.get("/get-stats", isAuthenticated, getUserStats);
router.get("/user-stats", isAuthenticated, getUsersList);
router.get("/getUser/:userId", isAuthenticated, getUser);
router.get("/user-all-application/:userId", isAuthenticated, getAllApplication);

export default router;
