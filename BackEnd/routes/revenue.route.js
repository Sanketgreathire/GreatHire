import express from "express";
import { storeRevenue } from "../controllers/revenue.controller.js";

const router = express.Router();

router.post("/store-revenue", storeRevenue);

export default router;
