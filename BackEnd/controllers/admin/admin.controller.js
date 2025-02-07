import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Recruiter } from "../models/recruiter.model.js";
import { Admin } from "../models/admin.model.js";

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password } = req.body;

    // Validate required fields
    if (!fullname || !email || !phoneNumber || !password) {
      return res.status(200).json({
        message: "Something is missing",
      });
    }

    // Validate fullname length
    if (fullname.length < 3) {
      return res.status(200).json({
        message: "Fullname must be at least 3 characters long.",
        success: false,
      });
    }
    // Validate password length
    if (password.length < 8) {
      return res.status(200).json({
        message: "Password must be at least 8 characters long.",
        success: false,
      });
    }

    // Check if user already exists
    let userExists =
      (await User.findOne({ email })) ||
      (await Recruiter.findOne({ email })) ||
      (await Admin.findOne({ email }));

    if (userExists) {
      return res.status(200).json({
        message: "Account already exists.",
        success: false,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    let newUser = await Admin.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    // Remove sensitive information before sending the response
    const userWithoutPassword = await Admin.findById(newUser._id).select(
      "-password"
    );

    const tokenData = {
      userId: userWithoutPassword._id,
    };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    // cookies strict used...
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "strict",
      })
      .json({
        message: "Account created successfully.",
        success: true,
        user: userWithoutPassword,
      });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

//login section...
export const login = async (req, res) => {
  try {
    const { email, password } = req.body.data;
    if (!email || !password) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }
    //check mail is correct or not...
    let user =
      (await User.findOne({ email })) ||
      (await Recruiter.findOne({ email })) ||
      (await Admin.findOne({ email }));

    if (!user) {
      return res.status(200).json({
        message: "Account Not found.",
        success: false,
      });
    }
    //checking password is correct or not...
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(200).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }
    const tokenData = {
      userId: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const userWithoutPassword = await Admin.findById(newUser._id).select(
      "-password"
    );

    // cookies strict used...
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome ${user.fullname}`,
        user: userWithoutPassword,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};
