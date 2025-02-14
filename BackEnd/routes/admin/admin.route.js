import express from "express";
import { register, login } from "../../controllers/admin/admin.controller.js";
import { validateUser } from "../../middlewares/userValidator.js";
import { validateLogin } from "../../middlewares/loginValidator.js";
import isAuthenticated from "../../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/register", isAuthenticated, validateUser, register);
router.post("/login", validateLogin, login);

export default router;
