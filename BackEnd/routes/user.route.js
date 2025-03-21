import express from "express";
import {
  login,
  logout,
  register,
  updateProfile,
  googleLogin,
  sendMessage,
  forgotPassword,
  resetPassword,
  deleteAccount,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";
import { validateUser } from "../middlewares/userValidator.js";
import { validateLogin } from "../middlewares/loginValidator.js";
import { validateProfileUpdate } from "../middlewares/profileValidator.js";
import { validateContactUsForm } from "../middlewares/contactValidator.js";

const router = express.Router();

router.route("/register").post(singleUpload,validateUser, register);
router.route("/login").post(validateLogin, login);
router.route("/googleLogin").post(googleLogin);

router.route("/profile/update").put(
  isAuthenticated,
  (req, res, next) => {
    singleUpload(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message }); // Handle multer errors
      }
      next();
    });
  },
  validateProfileUpdate,
  updateProfile
);

router.route("/sendMessage").post(validateContactUsForm, sendMessage);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);

router.route("/logout").get(isAuthenticated, logout);
router.route("/delete").delete(isAuthenticated, deleteAccount);

export default router;
