import mongoose from "mongoose";

const recruiterSchema = new mongoose.Schema(
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
      isVerified: { type: Boolean, default: false },
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
      default: "recruiter",
    },
    position: {
      type: String,
      default: "",
    },

    isCompanyCreated: {
      type: Boolean,
      default: false,
    },
    profile: {
      profilePhoto: {
        type: String,
        default: "",
      },
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

export const Recruiter = mongoose.model("Recruiter", recruiterSchema);
