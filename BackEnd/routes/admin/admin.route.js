import express from "express";
import {
  register,
  login,
  getAdminList,
  removeAccount
} from "../../controllers/admin/admin.controller.js";
import { validateUser } from "../../middlewares/userValidator.js";
import { validateLogin } from "../../middlewares/loginValidator.js";
import isAuthenticated from "../../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/register", isAuthenticated, validateUser, register);
router.post("/login", validateLogin, login);
router.get("/getAdmin-list", isAuthenticated, getAdminList);
router.delete("/remove-admin/:userId", isAuthenticated, removeAccount);

export default router;
