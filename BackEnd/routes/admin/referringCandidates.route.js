import express from "express";
import { getReferringCandidates, markRewardShared } from "../../controllers/admin/referringCandidates.controller.js";
import isAuthenticated from "../../middlewares/isAuthenticated.js";

const router = express.Router();

router.get("/", isAuthenticated, getReferringCandidates);
router.put("/:userId/mark-shared", isAuthenticated, markRewardShared);

export default router;
