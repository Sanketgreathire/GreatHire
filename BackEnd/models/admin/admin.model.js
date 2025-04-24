import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
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
      default: "admin",
    },
    profile: {
      profilePhoto: {
        type: String,
        default: "",
      },
    },
  },
  { timestamps: true }
);

export const Admin = mongoose.model("Admin", adminSchema);
