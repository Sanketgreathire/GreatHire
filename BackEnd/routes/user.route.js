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
  sendOtp,  
  verifyOtp 
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";
import { validateUser } from "../middlewares/userValidator.js";
import { validateLogin } from "../middlewares/loginValidator.js";
import { validateProfileUpdate } from "../middlewares/profileValidator.js";
import { validateContactUsForm } from "../middlewares/contactValidator.js";
import { updateLastActive } from "../middlewares/updateLastActive.js";

const router = express.Router();

router.route("/register").post(validateUser, updateLastActive, register);
router.route("/login").post(validateLogin, updateLastActive, login);
router.route("/googleLogin").post(updateLastActive, googleLogin);



router.route("/profile/update").put(
  isAuthenticated,    
  updateLastActive,
  (req, res, next) => {
    singleUpload(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  validateProfileUpdate,
  updateProfile,
);

router.route("/sendMessage").post(validateContactUsForm, updateLastActive, sendMessage);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(updateLastActive, resetPassword);

router.route("/logout").get(updateLastActive, logout);

router.route("/delete").delete(isAuthenticated, updateLastActive, deleteAccount);


// add after existing login route
router.route("/send-otp").post(sendOtp);
router.route("/verify-otp").post(verifyOtp);




export default router;