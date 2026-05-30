import express from "express";
import isAuthenticated from "../../../../middlewares/isAuthenticated.js";
import {
  saveCandidateController,
  saveNotesController,
  getCandidateController,
  updateCandidateController,
  deleteCandidateController
} from "../controllers/extension.controller.js";

const router = express.Router();

router.post("/save-candidate", isAuthenticated, saveCandidateController);

router.post("/save-notes", isAuthenticated, saveNotesController);

router.get("/candidate/:candidateId", isAuthenticated, getCandidateController);

router.put("/candidate/:candidateId", isAuthenticated, updateCandidateController);

router.delete("/candidate/:candidateId", isAuthenticated, deleteCandidateController);

export default router;
