
// this package help to encrypt the password
import bcrypt from "bcryptjs";
// this package help to create token and provide user authentication by token
import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";
import { Recruiter } from "../models/recruiter.model.js";
import { Admin } from "../models/admin/admin.model.js";
import { Contact } from "../models/contact.model.js";
// this model help to blacklist recent logout token
import { BlacklistToken } from "../models/blacklistedtoken.model.js";

import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";
// help in google login
import { oauth2Client } from "../utils/googleConfig.js";
import axios from "axios";
// this one give us validationResult when req object will validate by express-validator
import { validationResult } from "express-validator";
// help in send email
import nodemailer from "nodemailer";
import { Application } from "../models/application.model.js";
import notificationService from "../utils/notificationService.js";

// this controller help in user registration
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password } = req.body;

    // Validate fullname
    if (!fullname || fullname.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Full name must be at least 3 characters long.",
      });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format.",
      });
    }

    // Validate phone number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number. It must be 10 digits starting with 6–9.",
      });
    }

    // Validate password
    if (!password || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    // Check existing email
    const existingEmail = await User.findOne({ "emailId.email": email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "This email is already used by someone",
      });
    }

    // Check existing phone number
    const existingPhone = await User.findOne({
      "phoneNumber.number": phoneNumber,
    });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "This phone number is already used by someone",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      fullname,
      emailId: { email },
      phoneNumber: { number: phoneNumber },
      password: hashedPassword,
      lastActiveAt: new Date(),
    });

    // Fetch user without password
    const userWithoutPassword = await User.findById(user._id).select(
      "-password"
    );

    // Create JWT token
    const tokenData = { userId: userWithoutPassword._id };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    // Send cookie + response
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
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
      success: false,
      message: "Internal Server Error",
    });
  }
};


//login section...
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }
    // check validation of email and password by express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //check mail is correct or not...
    let user =
      (await User.findOne({ "emailId.email": email })) ||
      (await Recruiter.findOne({
        "emailId.email": email,
      }));

    if (!user) {
      return res.status(200).json({
        message: "Account Not found.",
        success: false,
      });
    }

    //checking/comparing the password is correct or not...
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(200).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    await user.save();

    // ✅ Send welcome notification on login
    try {
      await notificationService.notifyWelcome({
        userId: user._id,
        userType: user.role,
        name: user.fullname
      });
    } catch (notificationError) {
      console.error('Error sending welcome notification:', notificationError);
    }

    const tokenData = {
      userId: user._id,
    };
    // generate the token using JWT 
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const isCompanyCreated = user.isCompanyCreated || false;
    const position = user.position || "";
    const isActive = user.isActive || null;

    //return user
    user = {
      _id: user._id,
      fullname: user.fullname,
      emailId: user.emailId,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
      address: user.address,
      lastActiveAt: user.lastActiveAt,
      isFirstLogin: user.isFirstLogin,
      isCompanyCreated,
      position,
      isActive,
    };

    // sending cookies from server to client with response
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

// Job seeker specific login
export const jobseekerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    // Only search in User collection for job seekers
    let user = await User.findOne({ "emailId.email": email });

    if (!user) {
      return res.status(200).json({
        message: "Job seeker account not found.",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(200).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    await user.save();

    try {
      await notificationService.notifyWelcome({
        userId: user._id,
        userType: user.role,
        name: user.fullname
      });
    } catch (notificationError) {
      console.error('Error sending welcome notification:', notificationError);
    }

    const tokenData = { userId: user._id };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      fullname: user.fullname,
      emailId: user.emailId,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
      address: user.address,
      lastActiveAt: user.lastActiveAt,
      isFirstLogin: user.isFirstLogin,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

// Recruiter specific login
export const recruiterLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    // Only search in Recruiter collection for recruiters
    let user = await Recruiter.findOne({ "emailId.email": email });

    if (!user) {
      return res.status(200).json({
        message: "Recruiter account not found.",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(200).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    await user.save();

    try {
      await notificationService.notifyWelcome({
        userId: user._id,
        userType: user.role,
        name: user.fullname
      });
    } catch (notificationError) {
      console.error('Error sending welcome notification:', notificationError);
    }

    const tokenData = { userId: user._id };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const isCompanyCreated = user.isCompanyCreated || false;
    const position = user.position || "";
    const isActive = user.isActive || null;

    user = {
      _id: user._id,
      fullname: user.fullname,
      emailId: user.emailId,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
      lastActiveAt: user.lastActiveAt,
      isFirstLogin: user.isFirstLogin,
      isCompanyCreated,
      position,
      isActive,
      plan: user.plan || "FREE",
      subscriptionStatus: user.subscriptionStatus || "INACTIVE",
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

// login by google
export const googleLogin = async (req, res) => {
  try {
    // this code from frontend which is given by google during google login
    let { code, role } = req.body;

    if (!code) {
      return res
        .status(200)
        .json({ message: "Authorization code is required" });
    }

    // Exchange authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Fetch user information from Google
    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`
    );

    const googleUser = userRes.data;

    // Check if user already exists

    let user =
      (await User.findOne({ "emailId.email": googleUser.email }).select(
        "-password"
      )) ||
      (await Recruiter.findOne({ "emailId.email": googleUser.email }).select(
        "-password"
      )) ||
      (await Admin.findOne({ "emailId.email": googleUser.email }).select(
        "-password"
      ));

    if (user) {
      if (role && role !== user.role) {
        res.status(200).json({
          message: "Account already exist!",
          success: false,
        });
      }

      // Update lastActiveAt and set isFirstLogin to false for existing users
      await User.findByIdAndUpdate(
        user._id,
        {
          $set: {
            lastActiveAt: new Date(),
            isFirstLogin: false,
          },
        },
        { new: true }
      );


      const tokenData = {
        userId: user._id,
      };
      // generating token with jwt sign with 1 day expiry time
      const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
        expiresIn: "1d",
      });

      // return cookies with response
      return res
        .status(200)
        .cookie("token", token, {
          maxAge: 1 * 24 * 60 * 60 * 1000,
          httpsOnly: true,
          sameSite: "strict",
        })
        .json({
          message: `Welcome back ${user.fullname}`,
          user,
          success: true,
        });
    }

    if (!role) role = "student";

    // If user doesn't exist, create a new one
    user = new User({
      fullname: googleUser.name || googleUser.given_name || "No Name",
      emailId: {
        email: googleUser.email, // Set email from Google user data
        isVerified: true, // Google-authenticated users are usually verified
      },
      phoneNumber: {
        number: "", // No phone number provided by Google
        isVerified: false, // Default to false since no phone verification
      },
      password: "", // No password for Google-authenticated users
      role: role, // Use the provided role
      profile: {
        profilePhoto: googleUser.picture || "",
      },
    });

    await user.save();

    const tokenData = {
      userId: user._id,
    };
    // generating token with jwt sign with 1 day expiry time
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    // return cookies with response
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome ${user.fullname}`,
        user,
        success: true,
      });
  } catch (err) {
    console.error("Error during Google Login:", err.message);
    return res.status(500).json({
      message: "Google Login failed",
      error: err.message,
    });
  }
};

// Logout Section

export const logout = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (token) {
      // Decode the token to get user ID
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const userId = decoded.userId;

      // Update lastActiveAt for both User and Recruiter collections
      await Promise.all([
        User.findByIdAndUpdate(userId, { $set: { lastActiveAt: new Date() } }),
        Recruiter.findByIdAndUpdate(userId, { $set: { lastActiveAt: new Date() } })
      ]);

      // Blacklist the token
      await BlacklistToken.create({ token });
    }

    return res
      .status(200)
      .cookie("token", "", {
        maxAge: 0,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: "Logged out successfully.",
        success: true,
      });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({
      message: "An error occurred during logout. Please try again later.",
      success: false,
    });
  }
};


// for uploading services
export const uploadResumeToCloudinary = async (fileBuffer, fileName) => {
  try {
    return await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          public_id: fileName,
          folder: "resumes",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(fileBuffer);
    });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Error uploading resume to Cloudinary");
  }
};

//this controller  update the profile of user
export const updateProfile = async (req, res) => {
  try {
    const {
      fullname,
      email,
      phoneNumber,
      alternatePhone,
      city,
      state,
      country,
      pincode,
      gender,
      qualification,
      otherQualification,
      category,
      language,
      bio,
      skills,
      documents,
    } = req.body;
    console.log(req.body);
    const { profilePhoto, resume } = req.files; // Access files from req.files
    //console.log(req.files);
    const userId = req.id;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is missing in the request.",
        success: false,
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    }

    // finding the user by userId
    let user = await User.findById(userId);

    // if not user return user not found
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

     if (documents) {
      user.profile.documents = Array.isArray(documents) ? documents : [documents];
    }

    // Upload profile photo if provided
    if (profilePhoto && profilePhoto.length > 0) {
      // fetching data uri of file
      const fileUri = getDataUri(profilePhoto[0]);
      // upload file to cloudnary
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      // set cloudResponse.secure_url to user profile photo
      user.profile.profilePhoto = cloudResponse.secure_url;
    }

    // Upload resume if provided
    if (resume && resume.length > 0) {
      console.log("Uploading resume:", resume[0].originalname);

      try {
        // ✅ Upload resume to Cloudinary using the function
        const cloudResponse = await uploadResumeToCloudinary(
          resume[0].buffer,
          resume[0].originalname
        );

        user.profile.resume = cloudResponse.secure_url;
        user.profile.resumeOriginalName = resume[0].originalname;
      } catch (error) {
        console.error("Resume Upload Error:", error);
        return res.status(500).json({
          message: "Failed to upload resume.",
          success: false,
        });
      }
    }


    // checking is skillsArray is array by Array.isArray(variable)
    const skillsArray = Array.isArray(skills)
      ? skills
      : skills?.split(",").map((skill) => skill.trim()) || [];

    if (fullname && user.fullname !== fullname) user.fullname = fullname;

    if (city) user.address.city = city;
    if (state) user.address.state = state;
    if (country) user.address.country = country;
    if (pincode) user.address.pincode = pincode;

    // Updating gender 
    if (gender && user.profile.gender !== gender) user.profile.gender = gender;

    // Updating qualification + otherQualification
    if (qualification && user.profile.qualification !== qualification) {
      user.profile.qualification = qualification;

      if (qualification === "Others") {
        // Save the additional text field
        user.profile.otherQualification = otherQualification || "";
      } else {
        // Clear it if not "Others"
        user.profile.otherQualification = "";
      }
    }

    // ✅ Robustly normalize category into an array
    let categoryArray = [];
    if (Array.isArray(category)) {
      categoryArray = category;
    } else if (typeof category === "string") {
      // could be "Education" (single), "Education,Manufacturing", or '["Education","Manufacturing"]'
      try {
        const parsed = JSON.parse(category);
        if (Array.isArray(parsed)) {
          categoryArray = parsed;
        } else if (parsed) {
          categoryArray = String(parsed).split(",").map((c) => c.trim()).filter(Boolean);
        }
      } catch {
        categoryArray = category.split(",").map((c) => c.trim()).filter(Boolean);
      }
    }
    if (categoryArray.length > 0) {
      user.profile.category = categoryArray;
    }

    // ✅ Robustly normalize category into an array
    let languageArray = [];
    if (Array.isArray(language)) {
      languageArray = language;
    } else if (typeof language === "string") {
      try {
        const parsed = JSON.parse(language);
        if (Array.isArray(parsed)) {
          languageArray = parsed;
        } else if (parsed) {
          languageArray = String(parsed).split(",").map((c) => c.trim()).filter(Boolean);
        }
      } catch {
        languageArray = language.split(",").map((c) => c.trim()).filter(Boolean);
      }
    }
    if (languageArray.length > 0) {
      user.profile.language = languageArray;
    }

    if (email && user.emailId.email !== email) {
      // Check if the email already exists in the database
      const existingUser = await User.findOne({ "emailId.email": email });

      if (existingUser) {
        return res.status(401).json({
          message: "Email already exist!",
          success: false,
        });
      }

      // If the email does not exist, update it
      user.emailId.email = email;
      user.emailId.isVerified = false;
    }
    if (phoneNumber && user.phoneNumber.number !== phoneNumber) {
      user.phoneNumber.number = phoneNumber;
      user.phoneNumber.isVerified = false;
    }
    // Alternate phone update
    if (alternatePhone && user.alternatePhone?.number !== alternatePhone) {
      // Make sure alternatePhone object exists
      if (!user.alternatePhone) {
        user.alternatePhone = { number: "", isVerified: false };
      }
      user.alternatePhone.number = alternatePhone;
      user.alternatePhone.isVerified = false; // reset verification for alt number
    }

    if (bio && user.profile.bio !== bio) user.profile.bio = bio;
    // ✅ Normalize experiences into an array
    let experiencesArray = [];
    if (req.body.experiences) {
      try {
        experiencesArray =
          typeof req.body.experiences === "string"
            ? JSON.parse(req.body.experiences)
            : req.body.experiences;
      } catch (err) {
        console.error("Error parsing experiences:", err);
        experiencesArray = [];
      }
    }

    // ✅ If Fresher (No experience selected)
    if (Array.isArray(experiencesArray) && experiencesArray.length === 0) {
      user.profile.experiences = []; // overwrite old experiences
    } else if (Array.isArray(experiencesArray) && experiencesArray.length > 0) {
      user.profile.experiences = experiencesArray;
    }

    if (skillsArray.length) user.profile.skills = skillsArray;

    // Mark as not first login after profile update
    user.isFirstLogin = false;

    await user.save();

    // extract user without password
    const updatedUser = await User.findById(userId).select("-password");
    return res.status(200).json({
      message: "Profile updated successfully.",
      user: updatedUser,
      success: true,
    });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    return res.status(500).json({
      message: "An error occurred while updating the profile.",
      error: error.message,
      success: false,
    });
  }
};

// this controller send message from contact section of website
export const sendMessage = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, message } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    }

    // Set up transporter for sending email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER, // Access from .env
        pass: process.env.EMAIL_PASS, // Access from .env
      },
    });

    // Define the email options
    const mailOptions = {
      from: email,
      to: "sanketbabde@greathire.in",
      subject: `Message from ${fullname}`,
      text: `${message}\nContact: ${phoneNumber}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    await Contact.create({
      name: fullname,
      email,
      phoneNumber,
      message,
    });

    return res.status(200).json({
      success: true,
      message: "our team will be in touch with you soon!",
    });
  } catch (err) {
    console.error("Error sending message:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while sending the message.",
    });
  }
};

// this controller use when user forgot the password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    let user =
      (await User.findOne({ "emailId.email": email })) ||
      (await Recruiter.findOne({ "emailId.email": email })) ||
      (await Admin.findOne({ "emailId.email": email }));

    if (!user) {
      return res.status(200).json({
        message: "User not found with this email.",
        success: false,
      });
    }

    // Create a token with a 5-minute expiry
    const resetToken = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "5m",
    });

    // Generate reset URL
    const resetURL = `http://localhost:5173/reset-password/${resetToken}`;

    // Setup nodemailer
    const transporter = nodemailer.createTransport({
      service: "Gmail", // or your email service provider
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password
      },
    });

    const mailOptions = {
      from: `"GreatHire Support" <${process.env.SUPPORT_EMAIL}>`,
      to: email,
      subject: "Reset Your Password",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f7fc; padding: 30px; max-width: 600px; margin: auto; border-radius: 10px; border: 1px solid #ddd;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2>Great<span style="color: #1D4ED8;">Hire</span></h2>
            <p style="color: #555;">Connecting Skills with Opportunity - Your Next Great Hire Awaits!</p>
          </div>
    
          <h3 style="color: #333;">Hi ${user.fullname},</h3>
          <p style="color: #555;">We received a request to reset your password. If you made this request, please click the button below to reset your password:</p>
    
          <div style="text-align: center; margin: 20px 0;">
            <a href="${resetURL}" target="_blank" style="background-color: #1D4ED8; color: #fff; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-size: 16px;">
              Reset Password
            </a>
          </div>
    
          <p style="color: #555;">
            Please note: This link will expire in 5 minutes. If you didn’t request this reset, you can ignore this email.
          </p>
    
          <div style="border-top: 1px solid #ddd; margin-top: 30px; padding-top: 20px; text-align: center;">
            <p style="font-size: 14px; color: #888;">If you need help, feel free to reach out to our support team.</p>
          </div>
    
          <div style="text-align: center; margin-top: 20px;">
            <p style="font-size: 14px; color: #aaa;">© ${new Date().getFullYear()} GreatHire. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: "Password reset link sent successfully.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// this controller reset the password of user
export const resetPassword = async (req, res) => {
  try {
    const { decoded, newPassword } = req.body;

    let user =
      (await User.findById(decoded.userId)) ||
      (await Recruiter.findById(decoded.userId)) ||
      (await Admin.findById(decoded.userId));

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    // Validate password type and length
    if (typeof newPassword !== "string" || newPassword.length < 8) {
      return res.status(400).json({
        message: "Password must be a string and at least 8 characters long.",
        success: false,
      });
    }

    // Hash new password my hashing 10 times
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      message: "Password reset successfully.",
      success: true,
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// deleting account of user by self or admin
export const deleteAccount = async (req, res) => {
  const { email } = req.body;
  const userId = req.id; // Logged-in user ID
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  try {
    // Validate input
    if (!email) {
      return res.status(400).json({
        message: "Email is required to delete an account.",
        success: false,
      });
    }

    // test the  email is valid or not
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid Email.",
        success: false,
      });
    }

    // Check if the user exists
    const user = await User.findOne({ "emailId.email": email });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    // Check if the logged-in user is either an Admin or the user themselves
    const admin = await Admin.findById(userId);
    const isSelf = user._id.toString() === userId;

    // either amdin can delete account of user or user can delete own account
    if (!admin && !isSelf) {
      return res.status(403).json({
        message: "You are not authorized to delete this account.",
        success: false,
      });
    }

    // Remove all applications associated with the user
    await Application.deleteMany({ applicant: user._id });

    // Delete the user
    await User.findOneAndDelete({ "emailId.email": email });

    // If the user is deleting their own account, remove their token
    if (isSelf) {
      return res
        .status(200)
        .cookie("token", "", {
          maxAge: 0,
          httpOnly: true,
          sameSite: "strict",
        })
        .json({
          message: "Your account has been deleted successfully.",
          success: true,
        });
    }

    // If an admin deletes another user's account, just send a success response
    return res.status(200).json({
      message: "User account deleted successfully.",
      success: true,
    });
  } catch (err) {
    console.error("Error in deleteAccount:", err);

    return res.status(500).json({
      message: "An error occurred while deleting the account.",
      error: err.message,
      success: false,
    });
  }
};
// ---------------- OTP LOGIN ----------------

// Step 1: Send OTP to email
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    let user =
      (await User.findOne({ "emailId.email": email })) ||
      (await Recruiter.findOne({ "emailId.email": email })) ||
      (await Admin.findOne({ "emailId.email": email }));

    if (!user) {
      return res.status(200).json({ success: false, message: "User not found" });
    }

    //  Check if OTP already exists and not expired
    if (user.emailId.otp && Date.now() < user.emailId.otpExpiry) {
      const remainingTime = Math.ceil((user.emailId.otpExpiry - Date.now()) / 1000); // in sec
      return res.status(400).json({
        success: false,
        message: `OTP already sent. Please wait ${remainingTime} seconds before resending.`,
      });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP + expiry (5 min)
    user.emailId.otp = otp;
    user.emailId.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"GreatHire OTP" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP for Login",
      html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #eaeaea; padding: 20px; border-radius: 8px; background-color: #f9f9f9;">
      
      <h2 style="color: #1d4ed8; text-align: center;">Your Secure OTP for GreatHire Login</h2>
      
      <p style="font-size: 16px; color: #555;">Hi there,</p>
      
      <p style="font-size: 16px; color: #555;">
        We’re glad to have you at <strong>GreatHire</strong>! Use the One-Time Password (OTP) below to access your account:
      </p>
      
      <div style="text-align: center; margin: 20px 0;">
        <span style="display: inline-block; font-size: 24px; color: #1d4ed8; font-weight: bold; border: 2px dashed #1d4ed8; padding: 10px 20px; border-radius: 8px;">
          ${otp}
        </span>
      </div>
      
      <p style="font-size: 16px; color: #555;">
        This code will <strong>expire in 5 minutes</strong>. Please keep it confidential to protect your account.
      </p>
      
      <p style="font-size: 16px; color: #555;">
       If you did not request for this OTP, please contact our support team at <a href="mailto:hr@babde.tech?subject=">hr@babde.tech</a> immediately.
      </p>
      
      <br>
      <p style="font-size: 16px; color: #555;">
        Warm regards,<br><strong>GreatHire Support Team</strong>
      </p>
      
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #eaeaea;" />
      
      <p style="font-size: 14px; color: #999; text-align: center;">
        © ${new Date().getFullYear()} GreatHire. All rights reserved.
      </p>
    </div>
  `,
});

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully. It will expire in 5 minutes.",
    });
  } catch (err) {
    console.error("Send OTP Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// Step 2: Verify OTP (Original function - kept for backward compatibility)
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    let user =
      (await User.findOne({ "emailId.email": email })) ||
      (await Recruiter.findOne({ "emailId.email": email })) ||
      (await Admin.findOne({ "emailId.email": email }));

    if (!user || !user.emailId.otp) {
      return res.status(400).json({ success: false, message: "Invalid request" });
    }

    if (user.emailId.otp !== otp || Date.now() > user.emailId.otpExpiry) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // Clear OTP
    user.emailId.otp = null;
    user.emailId.otpExpiry = null;
    await user.save();

    try {
      await notificationService.notifyWelcome({
        userId: user._id,
        userType: user.role,
        name: user.fullname
      });
    } catch (notificationError) {
      console.error('Error sending welcome notification:', notificationError);
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" });

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        success: true,
        message: `Welcome ${user.fullname}`,
        user: {
          _id: user._id,
          fullname: user.fullname,
          emailId: user.emailId,
          role: user.role,
        },
      });
  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Step 2: Verify OTP for Job Seekers
export const verifyJobseekerOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    // Only search in User collection
    let user = await User.findOne({ "emailId.email": email });

    if (!user || !user.emailId.otp) {
      return res.status(400).json({ success: false, message: "Invalid request" });
    }

    if (user.emailId.otp !== otp || Date.now() > user.emailId.otpExpiry) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // Clear OTP
    user.emailId.otp = null;
    user.emailId.otpExpiry = null;
    await user.save();

    try {
      await notificationService.notifyWelcome({
        userId: user._id,
        userType: user.role,
        name: user.fullname
      });
    } catch (notificationError) {
      console.error('Error sending welcome notification:', notificationError);
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" });

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        success: true,
        message: `Welcome ${user.fullname}`,
        user: {
          _id: user._id,
          fullname: user.fullname,
          emailId: user.emailId,
          role: user.role,
        },
      });
  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Step 2: Verify OTP for Recruiters
export const verifyRecruiterOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    // Only search in Recruiter collection
    let user = await Recruiter.findOne({ "emailId.email": email });

    if (!user || !user.emailId.otp) {
      return res.status(400).json({ success: false, message: "Invalid request" });
    }

    if (user.emailId.otp !== otp || Date.now() > user.emailId.otpExpiry) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // Clear OTP
    user.emailId.otp = null;
    user.emailId.otpExpiry = null;
    await user.save();

    try {
      await notificationService.notifyWelcome({
        userId: user._id,
        userType: user.role,
        name: user.fullname
      });
    } catch (notificationError) {
      console.error('Error sending welcome notification:', notificationError);
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" });

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        success: true,
        message: `Welcome ${user.fullname}`,
        user: {
          _id: user._id,
          fullname: user.fullname,
          emailId: user.emailId,
          role: user.role,
          plan: user.plan || "FREE",
          subscriptionStatus: user.subscriptionStatus || "INACTIVE",
        },
      });
  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateUserLanguages = async (req, res) => {
  const { languages } = req.body;

  if (!Array.isArray(languages)) {
    return res.status(400).json({ error: "Languages must be an array of strings." });
  }

  // Sanitize: Trim, capitalize first letter, and remove empty strings
  const cleanLanguages = languages
    .map(lang => {
      if (typeof lang !== "string") return null;
      const trimmed = lang.trim();
      return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase(); // Capitalize
    })
    .filter(lang => lang && lang.length > 0);

  try {
    const user = await User.findByIdAndUpdate(
      // req.user._id,
       req.id,
      { "profile.languages": cleanLanguages.length ? cleanLanguages : ["Not Specified"] },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ message: "Languages updated successfully.", languages: user.profile.languages });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};
































// // this package help to encrypt the password
// import bcrypt from "bcryptjs";
// // this package help to create token and provide user authentication by token
// import jwt from "jsonwebtoken";

// import { User } from "../models/user.model.js";
// import { Recruiter } from "../models/recruiter.model.js";
// import { Admin } from "../models/admin/admin.model.js";
// import { Contact } from "../models/contact.model.js";
// // this model help to blacklist recent logout token
// import { BlacklistToken } from "../models/blacklistedtoken.model.js";

// import cloudinary from "../utils/cloudinary.js";
// import getDataUri from "../utils/dataUri.js";
// // help in google login
// import { oauth2Client } from "../utils/googleConfig.js";
// import axios from "axios";
// // this one give us validationResult when req object will validate by express-validator
// import { validationResult } from "express-validator";
// // help in send email
// import nodemailer from "nodemailer";
// import { Application } from "../models/application.model.js";

// // this controller help in user registration
// export const register = async (req, res) => {
//   try {
//     const { fullname, email, phoneNumber, password } = req.body;

//     // 1. Check if email already exists
//     const existingEmail = await User.findOne({ "emailId.email": email });
//     if (existingEmail) {
//       return res.status(400).json({
//         success: false,
//         message: "This email is already used by someone",
//       });
//     }

//     // 2. Check if phone number already exists
//     const existingPhone = await User.findOne({ "phoneNumber.number": phoneNumber });
//     if (existingPhone) {
//       return res.status(400).json({
//         success: false,
//         message: "This phone number is already used by someone",
//       });
//     }

//     // 3. Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // 4. Create user
//     const user = await User.create({
//       fullname,
//       emailId: { email },
//       phoneNumber: { number: phoneNumber },
//       password: hashedPassword,
//       lastActiveAt: new Date(),
//     });
//     newUser.lastActiveAt = new Date();
//     await newUser.save();

//     // Remove sensitive information before sending the response
//     const userWithoutPassword = await User.findById(newUser._id).select(
//       "-password"
//     );

//     // creating a token data by user id and creating a token by jwt sign in by token data and secret key
//     const tokenData = {
//       userId: userWithoutPassword._id,
//     };
//     // creating a token with expiry time 1 day
//     const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
//       expiresIn: "1d",
//     });

//     // cookies strict used...
//     return res
//       .status(200)
//       .cookie("token", token, {
//         maxAge: 1 * 24 * 60 * 60 * 1000,
//         httpsOnly: true,
//         sameSite: "strict",
//       })
//       .json({
//         message: "Account created successfully.",
//         success: true,
//         user: userWithoutPassword,
//       });
//   } catch (error) {
//     console.error("Error during registration:", error);
//     return res.status(500).json({
//       message: "Internal Server Error",
//     });
//   }
// };

// //login section...
// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({
//         message: "Something is missing",
//         success: false,
//       });
//     }
//     // check validation of email and password by express-validator
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     //check mail is correct or not...
//     let user =
//       (await User.findOne({ "emailId.email": email })) ||
//       (await Recruiter.findOne({
//         "emailId.email": email,
//       }));

//     if (!user) {
//       return res.status(200).json({
//         message: "Account Not found.",
//         success: false,
//       });
//     }

//     //checking/comparing the password is correct or not...
//     const isPasswordMatch = await bcrypt.compare(password, user.password);
//     if (!isPasswordMatch) {
//       return res.status(200).json({
//         message: "Incorrect email or password.",
//         success: false,
//       });
//     }

// await user.save();

//     const tokenData = {
//       userId: user._id,
//     };
//     // generate the token using JWT 
//     const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
//       expiresIn: "1d",
//     });

//     const isCompanyCreated = user.isCompanyCreated || false;
//     const position = user.position || "";
//     const isActive = user.isActive || null;

//     //return user
//     user = {
//       _id: user._id,
//       fullname: user.fullname,
//       emailId: user.emailId,
//       phoneNumber: user.phoneNumber,
//       role: user.role,
//       profile: user.profile,
//       address: user.address,
//       lastActiveAt: user.lastActiveAt,
//       isFirstLogin: user.isFirstLogin,
//       isCompanyCreated,
//       position,
//       isActive,
//     };

//     // sending cookies from server to client with response
//     return res
//       .status(200)
//       .cookie("token", token, {
//         maxAge: 1 * 24 * 60 * 60 * 1000,
//         httpsOnly: true,
//         sameSite: "strict",
//       })
//       .json({
//         message: `Welcome ${user.fullname}`,
//         user,
//         success: true,
//       });
//   } catch (error) {
//     console.log(error);
//   }
// };

// // login by google
// export const googleLogin = async (req, res) => {
//   try {
//     // this code from frontend which is given by google during google login
//     let { code, role } = req.body;

//     if (!code) {
//       return res
//         .status(200)
//         .json({ message: "Authorization code is required" });
//     }

//     // Exchange authorization code for tokens
//     const { tokens } = await oauth2Client.getToken(code);
//     oauth2Client.setCredentials(tokens);

//     // Fetch user information from Google
//     const userRes = await axios.get(
//       `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`
//     );

//     const googleUser = userRes.data;

//     // Check if user already exists

//     let user =
//       (await User.findOne({ "emailId.email": googleUser.email }).select(
//         "-password"
//       )) ||
//       (await Recruiter.findOne({ "emailId.email": googleUser.email }).select(
//         "-password"
//       )) ||
//       (await Admin.findOne({ "emailId.email": googleUser.email }).select(
//         "-password"
//       ));

//     if (user) {
//       if (role && role !== user.role) {
//         res.status(200).json({
//           message: "Account already exist!",
//           success: false,
//         });
//       }

//       // Update lastActiveAt and set isFirstLogin to false for existing users
//       user.lastActiveAt = new Date();
//       if (user.isFirstLogin) {
//         user.isFirstLogin = false;
//       }
//       await user.save();

//       const tokenData = {
//         userId: user._id,
//       };
//       // generating token with jwt sign with 1 day expiry time
//       const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
//         expiresIn: "1d",
//       });

//       // return cookies with response
//       return res
//         .status(200)
//         .cookie("token", token, {
//           maxAge: 1 * 24 * 60 * 60 * 1000,
//           httpsOnly: true,
//           sameSite: "strict",
//         })
//         .json({
//           message: `Welcome back ${user.fullname}`,
//           user,
//           success: true,
//         });
//     }

//     if (!role) role = "student";

//     // If user doesn't exist, create a new one
//     user = new User({
//       fullname: googleUser.name || googleUser.given_name || "No Name",
//       emailId: {
//         email: googleUser.email, // Set email from Google user data
//         isVerified: true, // Google-authenticated users are usually verified
//       },
//       phoneNumber: {
//         number: "", // No phone number provided by Google
//         isVerified: false, // Default to false since no phone verification
//       },
//       password: "", // No password for Google-authenticated users
//       role: role, // Use the provided role
//       profile: {
//         profilePhoto: googleUser.picture || "",
//       },
//     });

//     await user.save();

//     const tokenData = {
//       userId: user._id,
//     };
//     // generating token with jwt sign with 1 day expiry time
//     const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
//       expiresIn: "1d",
//     });
//     // return cookies with response
//     return res
//       .status(200)
//       .cookie("token", token, {
//         maxAge: 1 * 24 * 60 * 60 * 1000,
//         httpsOnly: true,
//         sameSite: "strict",
//       })
//       .json({
//         message: `Welcome ${user.fullname}`,
//         user,
//         success: true,
//       });
//   } catch (err) {
//     console.error("Error during Google Login:", err.message);
//     return res.status(500).json({
//       message: "Google Login failed",
//       error: err.message,
//     });
//   }
// };

// // Logout Section

// export const logout = async (req, res) => {
//   try {
//     const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

//     if (token) {
//       // Decode the token to get user ID (assuming your token includes `id`)
//       const decoded = jwt.verify(token, process.env.SECRET_KEY);
//       const userId = decoded.userId; // ✅ declare userId here

//       // ✅ Update lastActiveAt
//       await User.findByIdAndUpdate(userId, {
//         $set: { lastActiveAt: new Date() },
//       });

//       // ✅ Blacklist the token
//       await BlacklistToken.create({ token });
//     }

//     return res
//       .status(200)
//       .cookie("token", "", {
//         maxAge: 0,
//         httpOnly: true,  // Ensuring security by keeping it HTTP only
//         sameSite: "strict",
//       })
//       .json({
//         message: "Logged out successfully.",
//         success: true,
//       });
//   } catch (error) {
//     console.error("Logout Error:", error);
//     return res.status(500).json({
//       message: "An error occurred during logout. Please try again later.",
//       success: false,
//     });
//   }
// };


// // for uploading services
// export const uploadResumeToCloudinary = async (fileBuffer, fileName) => {
//   try {
//     return await new Promise((resolve, reject) => {
//       cloudinary.uploader.upload_stream(
//         {
//           resource_type: "raw",
//           public_id: fileName,
//           folder: "resumes",
//         },
//         (error, result) => {
//           if (error) reject(error);
//           else resolve(result);
//         }
//       ).end(fileBuffer);
//     });
//   } catch (error) {
//     console.error("Cloudinary Upload Error:", error);
//     throw new Error("Error uploading resume to Cloudinary");
//   }
// };

// //this controller  update the profile of user
// export const updateProfile = async (req, res) => {
//   try {
//     const {
//       fullname,
//       email,
//       phoneNumber,
//       alternatePhone,
//       city,
//       state,
//       country,
//       pincode,
//       gender,
//       qualification,
//       otherQualification,
//       category,
//       language,
//       bio,
//       skills,
//       documents,
//     } = req.body;
//     console.log(req.body);
//     const { profilePhoto, resume } = req.files; // Access files from req.files
//     //console.log(req.files);
//     const userId = req.id;

//     if (!userId) {
//       return res.status(400).json({
//         message: "User ID is missing in the request.",
//         success: false,
//       });
//     }

//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       console.log(errors);
//       return res.status(400).json({ errors: errors.array() });
//     }

//     // finding the user by userId
//     let user = await User.findById(userId);

//     // if not user return user not found
//     if (!user) {
//       return res.status(404).json({
//         message: "User not found.",
//         success: false,
//       });
//     }

//      if (documents) {
//       user.profile.documents = Array.isArray(documents) ? documents : [documents];
//     }

//     // Upload profile photo if provided
//     if (profilePhoto && profilePhoto.length > 0) {
//       // fetching data uri of file
//       const fileUri = getDataUri(profilePhoto[0]);
//       // upload file to cloudnary
//       const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
//       // set cloudResponse.secure_url to user profile photo
//       user.profile.profilePhoto = cloudResponse.secure_url;
//     }

//     // Upload resume if provided
//     if (resume && resume.length > 0) {
//       console.log("Uploading resume:", resume[0].originalname);

//       try {
//         // ✅ Upload resume to Cloudinary using the function
//         const cloudResponse = await uploadResumeToCloudinary(
//           resume[0].buffer,
//           resume[0].originalname
//         );

//         user.profile.resume = cloudResponse.secure_url;
//         user.profile.resumeOriginalName = resume[0].originalname;
//       } catch (error) {
//         console.error("Resume Upload Error:", error);
//         return res.status(500).json({
//           message: "Failed to upload resume.",
//           success: false,
//         });
//       }
//     }


//     // checking is skillsArray is array by Array.isArray(variable)
//     const skillsArray = Array.isArray(skills)
//       ? skills
//       : skills?.split(",").map((skill) => skill.trim()) || [];

//     if (fullname && user.fullname !== fullname) user.fullname = fullname;

//     if (city) user.address.city = city;
//     if (state) user.address.state = state;
//     if (country) user.address.country = country;
//     if (pincode) user.address.pincode = pincode;

//     // Updating gender 
//     if (gender && user.profile.gender !== gender) user.profile.gender = gender;

//     // Updating qualification + otherQualification
//     if (qualification && user.profile.qualification !== qualification) {
//       user.profile.qualification = qualification;

//       if (qualification === "Others") {
//         // Save the additional text field
//         user.profile.otherQualification = otherQualification || "";
//       } else {
//         // Clear it if not "Others"
//         user.profile.otherQualification = "";
//       }
//     }

//     // ✅ Robustly normalize category into an array
//     let categoryArray = [];
//     if (Array.isArray(category)) {
//       categoryArray = category;
//     } else if (typeof category === "string") {
//       // could be "Education" (single), "Education,Manufacturing", or '["Education","Manufacturing"]'
//       try {
//         const parsed = JSON.parse(category);
//         if (Array.isArray(parsed)) {
//           categoryArray = parsed;
//         } else if (parsed) {
//           categoryArray = String(parsed).split(",").map((c) => c.trim()).filter(Boolean);
//         }
//       } catch {
//         categoryArray = category.split(",").map((c) => c.trim()).filter(Boolean);
//       }
//     }
//     if (categoryArray.length > 0) {
//       user.profile.category = categoryArray;
//     }

//     // ✅ Robustly normalize category into an array
//     let languageArray = [];
//     if (Array.isArray(language)) {
//       languageArray = language;
//     } else if (typeof language === "string") {
//       try {
//         const parsed = JSON.parse(language);
//         if (Array.isArray(parsed)) {
//           languageArray = parsed;
//         } else if (parsed) {
//           languageArray = String(parsed).split(",").map((c) => c.trim()).filter(Boolean);
//         }
//       } catch {
//         languageArray = language.split(",").map((c) => c.trim()).filter(Boolean);
//       }
//     }
//     if (languageArray.length > 0) {
//       user.profile.language = languageArray;
//     }

//     if (email && user.emailId.email !== email) {
//       // Check if the email already exists in the database
//       const existingUser = await User.findOne({ "emailId.email": email });

//       if (existingUser) {
//         return res.status(401).json({
//           message: "Email already exist!",
//           success: false,
//         });
//       }

//       // If the email does not exist, update it
//       user.emailId.email = email;
//       user.emailId.isVerified = false;
//     }
//     if (phoneNumber && user.phoneNumber.number !== phoneNumber) {
//       user.phoneNumber.number = phoneNumber;
//       user.phoneNumber.isVerified = false;
//     }
//     // Alternate phone update
//     if (alternatePhone && user.alternatePhone?.number !== alternatePhone) {
//       // Make sure alternatePhone object exists
//       if (!user.alternatePhone) {
//         user.alternatePhone = { number: "", isVerified: false };
//       }
//       user.alternatePhone.number = alternatePhone;
//       user.alternatePhone.isVerified = false; // reset verification for alt number
//     }

//     if (bio && user.profile.bio !== bio) user.profile.bio = bio;
//     // ✅ Normalize experiences into an array
//     let experiencesArray = [];
//     if (req.body.experiences) {
//       try {
//         experiencesArray =
//           typeof req.body.experiences === "string"
//             ? JSON.parse(req.body.experiences)
//             : req.body.experiences;
//       } catch (err) {
//         console.error("Error parsing experiences:", err);
//         experiencesArray = [];
//       }
//     }

//     // ✅ If Fresher (No experience selected)
//     if (Array.isArray(experiencesArray) && experiencesArray.length === 0) {
//       user.profile.experiences = []; // overwrite old experiences
//     } else if (Array.isArray(experiencesArray) && experiencesArray.length > 0) {
//       user.profile.experiences = experiencesArray;
//     }

//     if (skillsArray.length) user.profile.skills = skillsArray;

//     // Mark as not first login after profile update
//     user.isFirstLogin = false;

//     await user.save();

//     // extract user without password
//     const updatedUser = await User.findById(userId).select("-password");
//     return res.status(200).json({
//       message: "Profile updated successfully.",
//       user: updatedUser,
//       success: true,
//     });
//   } catch (error) {
//     console.error("Error in updateProfile:", error);
//     return res.status(500).json({
//       message: "An error occurred while updating the profile.",
//       error: error.message,
//       success: false,
//     });
//   }
// };

// // this controller send message from contact section of website
// export const sendMessage = async (req, res) => {
//   try {
//     const { fullname, email, phoneNumber, message } = req.body;

//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       console.log(errors);
//       return res.status(400).json({ errors: errors.array() });
//     }

//     // Set up transporter for sending email
//     const transporter = nodemailer.createTransport({
//       service: "Gmail",
//       auth: {
//         user: process.env.EMAIL_USER, // Access from .env
//         pass: process.env.EMAIL_PASS, // Access from .env
//       },
//     });

//     // Define the email options
//     const mailOptions = {
//       from: email,
//       to: "sanketbabde@greathire.in",
//       subject: `Message from ${fullname}`,
//       text: `${message}\nContact: ${phoneNumber}`,
//     };

//     // Send the email
//     await transporter.sendMail(mailOptions);

//     await Contact.create({
//       name: fullname,
//       email,
//       phoneNumber,
//       message,
//     });

//     return res.status(200).json({
//       success: true,
//       message: "our team will be in touch with you soon!",
//     });
//   } catch (err) {
//     console.error("Error sending message:", err);
//     return res.status(500).json({
//       success: false,
//       message: "An error occurred while sending the message.",
//     });
//   }
// };

// // this controller use when user forgot the password
// export const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;

//     let user =
//       (await User.findOne({ "emailId.email": email })) ||
//       (await Recruiter.findOne({ "emailId.email": email })) ||
//       (await Admin.findOne({ "emailId.email": email }));

//     if (!user) {
//       return res.status(200).json({
//         message: "User not found with this email.",
//         success: false,
//       });
//     }

//     // Create a token with a 5-minute expiry
//     const resetToken = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
//       expiresIn: "5m",
//     });

//     // Generate reset URL
//     const resetURL = `http://localhost:5173/reset-password/${resetToken}`;

//     // Setup nodemailer
//     const transporter = nodemailer.createTransport({
//       service: "Gmail", // or your email service provider
//       auth: {
//         user: process.env.EMAIL_USER, // Your email
//         pass: process.env.EMAIL_PASS, // Your email password
//       },
//     });

//     const mailOptions = {
//       from: `"GreatHire Support" <${process.env.SUPPORT_EMAIL}>`,
//       to: email,
//       subject: "Reset Your Password",
//       html: `
//         <div style="font-family: Arial, sans-serif; background-color: #f4f7fc; padding: 30px; max-width: 600px; margin: auto; border-radius: 10px; border: 1px solid #ddd;">
//           <div style="text-align: center; margin-bottom: 20px;">
//             <h2>Great<span style="color: #1D4ED8;">Hire</span></h2>
//             <p style="color: #555;">Connecting Skills with Opportunity - Your Next Great Hire Awaits!</p>
//           </div>
    
//           <h3 style="color: #333;">Hi ${user.fullname},</h3>
//           <p style="color: #555;">We received a request to reset your password. If you made this request, please click the button below to reset your password:</p>
    
//           <div style="text-align: center; margin: 20px 0;">
//             <a href="${resetURL}" target="_blank" style="background-color: #1D4ED8; color: #fff; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-size: 16px;">
//               Reset Password
//             </a>
//           </div>
    
//           <p style="color: #555;">
//             Please note: This link will expire in 5 minutes. If you didn’t request this reset, you can ignore this email.
//           </p>
    
//           <div style="border-top: 1px solid #ddd; margin-top: 30px; padding-top: 20px; text-align: center;">
//             <p style="font-size: 14px; color: #888;">If you need help, feel free to reach out to our support team.</p>
//           </div>
    
//           <div style="text-align: center; margin-top: 20px;">
//             <p style="font-size: 14px; color: #aaa;">© ${new Date().getFullYear()} GreatHire. All rights reserved.</p>
//           </div>
//         </div>
//       `,
//     };

//     // Send email
//     await transporter.sendMail(mailOptions);

//     return res.status(200).json({
//       message: "Password reset link sent successfully.",
//       success: true,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error", success: false });
//   }
// };

// // this controller reset the password of user
// export const resetPassword = async (req, res) => {
//   try {
//     const { decoded, newPassword } = req.body;

//     let user =
//       (await User.findById(decoded.userId)) ||
//       (await Recruiter.findById(decoded.userId)) ||
//       (await Admin.findById(decoded.userId));

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found.",
//         success: false,
//       });
//     }

//     // Validate password type and length
//     if (typeof newPassword !== "string" || newPassword.length < 8) {
//       return res.status(400).json({
//         message: "Password must be a string and at least 8 characters long.",
//         success: false,
//       });
//     }

//     // Hash new password my hashing 10 times
//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     // Update user password
//     user.password = hashedPassword;
//     await user.save();

//     return res.status(200).json({
//       message: "Password reset successfully.",
//       success: true,
//     });
//   } catch (error) {
//     console.error("Error resetting password:", error);
//     return res.status(500).json({
//       message: "Internal Server Error",
//       success: false,
//     });
//   }
// };

// // deleting account of user by self or admin
// export const deleteAccount = async (req, res) => {
//   const { email } = req.body;
//   const userId = req.id; // Logged-in user ID
//   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

//   try {
//     // Validate input
//     if (!email) {
//       return res.status(400).json({
//         message: "Email is required to delete an account.",
//         success: false,
//       });
//     }

//     // test the  email is valid or not
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({
//         message: "Invalid Email.",
//         success: false,
//       });
//     }

//     // Check if the user exists
//     const user = await User.findOne({ "emailId.email": email });

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found.",
//         success: false,
//       });
//     }

//     // Check if the logged-in user is either an Admin or the user themselves
//     const admin = await Admin.findById(userId);
//     const isSelf = user._id.toString() === userId;

//     // either amdin can delete account of user or user can delete own account
//     if (!admin && !isSelf) {
//       return res.status(403).json({
//         message: "You are not authorized to delete this account.",
//         success: false,
//       });
//     }

//     // Remove all applications associated with the user
//     await Application.deleteMany({ applicant: user._id });

//     // Delete the user
//     await User.findOneAndDelete({ "emailId.email": email });

//     // If the user is deleting their own account, remove their token
//     if (isSelf) {
//       return res
//         .status(200)
//         .cookie("token", "", {
//           maxAge: 0,
//           httpOnly: true,
//           sameSite: "strict",
//         })
//         .json({
//           message: "Your account has been deleted successfully.",
//           success: true,
//         });
//     }

//     // If an admin deletes another user's account, just send a success response
//     return res.status(200).json({
//       message: "User account deleted successfully.",
//       success: true,
//     });
//   } catch (err) {
//     console.error("Error in deleteAccount:", err);

//     return res.status(500).json({
//       message: "An error occurred while deleting the account.",
//       error: err.message,
//       success: false,
//     });
//   }
// };
// // ---------------- OTP LOGIN ----------------

// // Step 1: Send OTP to email
// export const sendOtp = async (req, res) => {
//   try {
//     const { email } = req.body;
//     if (!email) return res.status(400).json({ success: false, message: "Email is required" });

//     let user =
//       (await User.findOne({ "emailId.email": email })) ||
//       (await Recruiter.findOne({ "emailId.email": email })) ||
//       (await Admin.findOne({ "emailId.email": email }));

//     if (!user) {
//       return res.status(200).json({ success: false, message: "User not found" });
//     }

//     //  Check if OTP already exists and not expired
//     if (user.emailId.otp && Date.now() < user.emailId.otpExpiry) {
//       const remainingTime = Math.ceil((user.emailId.otpExpiry - Date.now()) / 1000); // in sec
//       return res.status(400).json({
//         success: false,
//         message: `OTP already sent. Please wait ${remainingTime} seconds before resending.`,
//       });
//     }

//     // Generate new OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     // Save OTP + expiry (5 min)
//     user.emailId.otp = otp;
//     user.emailId.otpExpiry = Date.now() + 5 * 60 * 1000;
//     await user.save();

//     // Send OTP via email
//     const transporter = nodemailer.createTransport({
//       service: "Gmail",
//       auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
//     });

//     await transporter.sendMail({
//       from: `"GreatHire OTP" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "Your OTP for Login",
//       html: `
//     <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #eaeaea; padding: 20px; border-radius: 8px; background-color: #f9f9f9;">
      
//       <h2 style="color: #1d4ed8; text-align: center;">Your Secure OTP for GreatHire Login</h2>
      
//       <p style="font-size: 16px; color: #555;">Hi there,</p>
      
//       <p style="font-size: 16px; color: #555;">
//         We’re glad to have you at <strong>GreatHire</strong>! Use the One-Time Password (OTP) below to access your account:
//       </p>
      
//       <div style="text-align: center; margin: 20px 0;">
//         <span style="display: inline-block; font-size: 24px; color: #1d4ed8; font-weight: bold; border: 2px dashed #1d4ed8; padding: 10px 20px; border-radius: 8px;">
//           ${otp}
//         </span>
//       </div>
      
//       <p style="font-size: 16px; color: #555;">
//         This code will <strong>expire in 5 minutes</strong>. Please keep it confidential to protect your account.
//       </p>
      
//       <p style="font-size: 16px; color: #555;">
//        If you did not request for this OTP, please contact our support team at <a href="mailto:hr@babde.tech?subject=">hr@babde.tech</a> immediately.
//       </p>
      
//       <br>
//       <p style="font-size: 16px; color: #555;">
//         Warm regards,<br><strong>GreatHire Support Team</strong>
//       </p>
      
//       <hr style="margin: 20px 0; border: none; border-top: 1px solid #eaeaea;" />
      
//       <p style="font-size: 14px; color: #999; text-align: center;">
//         © ${new Date().getFullYear()} GreatHire. All rights reserved.
//       </p>
//     </div>
//   `,
// });

//     return res.status(200).json({
//       success: true,
//       message: "OTP sent successfully. It will expire in 5 minutes.",
//     });
//   } catch (err) {
//     console.error("Send OTP Error:", err);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };


// // Step 2: Verify OTP
// export const verifyOtp = async (req, res) => {
//   try {
//     const { email, otp } = req.body;
//     if (!email || !otp) {
//       return res.status(400).json({ success: false, message: "Email and OTP are required" });
//     }

//     let user =
//       (await User.findOne({ "emailId.email": email })) ||
//       (await Recruiter.findOne({ "emailId.email": email })) ||
//       (await Admin.findOne({ "emailId.email": email }));

//     if (!user || !user.emailId.otp) {
//       return res.status(400).json({ success: false, message: "Invalid request" });
//     }

//     if (user.emailId.otp !== otp || Date.now() > user.emailId.otpExpiry) {
//       return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
//     }


//     // Clear OTP
//     user.emailId.otp = null;
//     user.emailId.otpExpiry = null;
//     await user.save();



//     // Generate JWT
//     const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" });

//     return res
//       .status(200)
//       .cookie("token", token, {
//         maxAge: 1 * 24 * 60 * 60 * 1000,
//         httpOnly: true,
//         sameSite: "strict",
//       })
//       .json({
//         success: true,
//         message: `Welcome ${user.fullname}`,
//         user: {
//           _id: user._id,
//           fullname: user.fullname,
//           emailId: user.emailId,
//           role: user.role,
//         },
//       });
//   } catch (err) {
//     console.error("Verify OTP Error:", err);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// export const updateUserLanguages = async (req, res) => {
//   const { languages } = req.body;

//   if (!Array.isArray(languages)) {
//     return res.status(400).json({ error: "Languages must be an array of strings." });
//   }

//   // Sanitize: Trim, capitalize first letter, and remove empty strings
//   const cleanLanguages = languages
//     .map(lang => {
//       if (typeof lang !== "string") return null;
//       const trimmed = lang.trim();
//       return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase(); // Capitalize
//     })
//     .filter(lang => lang && lang.length > 0);

//   try {
//     const user = await User.findByIdAndUpdate(
//       // req.user._id,
//        req.id,
//       { "profile.languages": cleanLanguages.length ? cleanLanguages : ["Not Specified"] },
//       { new: true }
//     );

//     if (!user) {
//       return res.status(404).json({ error: "User not found." });
//     }

//     res.status(200).json({ message: "Languages updated successfully.", languages: user.profile.languages });
//   } catch (err) {
//     res.status(500).json({ error: "Server error", details: err.message });
//   }
// };