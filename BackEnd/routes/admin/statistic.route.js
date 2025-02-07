import express from "express";
const router = express.Router();
import { getStatisticForAdmin, getApplicationsDataByYear } from "../../controllers/admin/statistic.controller.js";

router.get("/get-stats",getStatisticForAdmin)
router.get("/applications", getApplicationsDataByYear);

export default router;
