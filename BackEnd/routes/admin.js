import express from "express";
import { register, login, logout, getAdminList, removeAccount } from "../controllers/admin/admin.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/list", getAdminList);
router.delete("/remove/:userId", removeAccount);

export default router;