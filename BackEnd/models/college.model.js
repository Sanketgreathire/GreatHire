import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema(
  {
    collegeName: { type: String, required: true, unique: true, trim: true },
    fullName:    { type: String, default: "" },
    emailId: {
      email:      { type: String, required: true, unique: true },
      isVerified: { type: Boolean, default: false },
    },
    phoneNumber: { type: String, default: "" },
    password:    { type: String, required: true },
    role:        { type: String, default: "college" },
    address:     { type: String, default: "" },
    website:     { type: String, default: "" },
    tpo:         { type: String, default: "" },
    tpoEmail:    { type: String, default: "" },
    tpoPhone:    { type: String, default: "" },
    naac:        { type: String, default: "" },
    established: { type: Number, default: null },
    type:        { type: String, default: "" },
    profile: {
      profilePhoto: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export const College = mongoose.model("College", collegeSchema);
