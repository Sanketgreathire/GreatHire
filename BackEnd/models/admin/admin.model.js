import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    phoneNumber: {
      type: String,
      required: true,
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
