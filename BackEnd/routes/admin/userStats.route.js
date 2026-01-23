// routes/admin/userStats.route.js
import express from "express";
import {
  getUserStats,
  getUsersList,
  getUser,
  getAllApplication,
  updateUser,
} from "../../controllers/admin/userStats.controller.js";
import isAuthenticated from "../../middlewares/isAuthenticated.js";
import { bulkDeleteUsers } from "../../controllers/admin/bulkDelete.controller.js";
// import { User } from "../../models/user.model.js";

const router = express.Router();

router.get("/get-stats", isAuthenticated, getUserStats);
router.get("/user-stats", isAuthenticated, getUsersList);
router.get("/getUser/:userId", isAuthenticated, getUser);
router.get("/user-all-application/:userId", isAuthenticated, getAllApplication);
router.put("/updateUser/:userId", isAuthenticated, updateUser);
router.delete("/bulk-delete", isAuthenticated, bulkDeleteUsers);

// helper route to fix missing lastActiveAt (keep or remove as needed)
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
