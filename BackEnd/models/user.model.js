import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
  companyName: { type: String },
  jobProfile: { type: String },
  duration: { type: String },
  experienceDetails: { type: String },
  currentlyWorking: { type: Boolean, default: false },
  currentCTC: { type: String, default: "" },
  noticePeriod: { type: String, default: "" },
});

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },

    emailId: {
      email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, "Please enter a valid email address"],
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
      otp: {
        type: String,
        default: null,
      },
      otpExpiry: {
        type: Date,
        default: null,
      },
    },

    phoneNumber: {
      number: {
        type: String,
      },
      isVerified: {
        type: Boolean,
      },
    },

    alternatePhone: {
      number: {
        type: String,
      },
      isVerified: {
        type: Boolean,
      },
    },

    password: {
      type: String,
    },

    role: {
      type: String,
      default: "student",
    },

    address: {
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      country: {
        type: String,
      },
      pincode: {
        type: Number,
        min: 100000,
        max: 999999,
        required: false,
      },
    },

    lastActiveAt: {
      type: Date,
      default: Date.now,
    },

    isFirstLogin: {
      type: Boolean,
      default: true,
    },

    profile: {
      language: {
        type: [String],
        default: [],
      },
      category: {
        type: [String],
        default: [],
      },
      coverLetter: {
        type: String,
      },
      bio: {
        type: String,
      },

      hasExperience: {
        type: Boolean,
        default: false,
      },

      experiences: [experienceSchema],

      skills: [{ type: String }],

      resume: { type: String },
      resumeOriginalName: { type: String },

      profilePhoto: {
        type: String,
        default: "",
      },

      gender: {
        type: String,
        enum: ["", "Not Select", "Male", "Female", "Other"],
        default: "Not Select",
      },

      qualification: {
        type: String,
        enum: [
          "",
          "Post Graduation",
          "Under Graduation",
          "M.Sc. Computer Science",
          "B.Sc. Computer Science",
          "M.Sc. Information Technology",
          "B.Sc. Information Technology",
          "B.Tech",
          "M.Tech",
          "MBA",
          "MCA",
          "B.Sc",
          "M.Sc",
          "B.Com",
          "M.Com",
          "Diploma",
          "12th Pass",
          "10th Pass",
          "Others",
        ],
        default: "",
      },

      otherQualification: {
        type: String,
        default: "",
      },

      documents: {
        type: [String],
        default: [],
      },
    },
  },
  { timestamps: true }
);

/* ============================
   ✅ ADDED – DO NOT REMOVE
   ============================ */

// ✅ Index for correct email lookup
//userSchema.index({ "emailId.email": 1 }, { unique: true });

// ✅ Virtual field so `user.email` works safely
userSchema.virtual("email").get(function () {
  return this.emailId?.email;
});

export const User = mongoose.model("User", userSchema);
