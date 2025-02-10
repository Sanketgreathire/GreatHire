import express from "express";
import { register, login } from "../../controllers/admin/admin.controller.js";
import { validateUser } from "../../middlewares/userValidator.js";
import { validateLogin } from "../../middlewares/loginValidator.js";

const router = express.Router();

router.post("/register", validateUser, register);
router.post("/login",validateLogin, login);

export default router;
