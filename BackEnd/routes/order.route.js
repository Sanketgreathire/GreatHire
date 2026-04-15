import express from "express";
import {
  createOrderForJobPlan,
  createOrderForCandidatePlan,
} from "../controllers/order.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Define your routes here
router.post(
  "/create-order-for-jobplan",
  isAuthenticated,
  createOrderForJobPlan
);
router.post(
  "/create-order-for-candidateplan",
  isAuthenticated,
  createOrderForCandidatePlan
);

export default router;
