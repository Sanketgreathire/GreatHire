import express from "express";
import {
    login,
    register,
  } from "../controllers/digitalmarketer.controller.js";

import { validateUser } from "../middlewares/userValidator.js";
import { validateLogin } from "../middlewares/loginValidator.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
  

const router = express.Router();

router.post("/register",  validateUser, register);
router.route("/login").post(validateLogin, login);


export default router;