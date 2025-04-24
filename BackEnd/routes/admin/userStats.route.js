import express from "express";
import {
  getUserStats,
  getUsersList,
  getUser,
  getAllApplication,
} from "../../controllers/admin/userStats.controller.js";
import isAuthenticated from "../../middlewares/isAuthenticated.js";
// import updateLastActive from "../middlewares/updateLastActive.js";

const router = express.Router();
// Define routes
router.get("/get-stats", isAuthenticated, getUserStats);
router.get("/user-stats", isAuthenticated, getUsersList);
router.get("/getUser/:userId", isAuthenticated, getUser);
router.get("/user-all-application/:userId", isAuthenticated, getAllApplication);
router.get("/fix-missing-last-active", async (req, res) => {
  try {
    const result = await User.updateMany(
      { lastActiveAt: { $exists: false } },
      { $set: { lastActiveAt: new Date() } }
    );
    res.json({ message: "lastActiveAt fixed", modified: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ message: "Error fixing lastActiveAt", error });
  }
});


export default router;
