import mongoose from "mongoose";

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
    },
    phoneNumber: {
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
    },
    profile: {
      coverLetter: {
        type: String,
      },

      bio: { type: String },
      experience: {
        companyName: {
          type: String,
        },
        jobProfile: {
          type: String,
        },
        duration: {
          type: String,
        },
        experienceDetails: {
          type: String,
        },
      },
      currentCTC: {
        type: String,
        default: 0,
      },
      expectedCTC: {
        type: String,
        default: 0,
      },

      skills: [{ type: String }],
      resume: { type: String }, // URL for the resume
      resumeOriginalName: { type: String },
      profilePhoto: {
        type: String,
        default: "",
      },
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
