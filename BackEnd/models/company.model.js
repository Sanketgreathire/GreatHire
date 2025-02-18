import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      unique: true,
    },
    companyWebsite: {
      type: String,
    },
    industry: {
      type: String,
    },
    address: {
      streetAddress: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      postalCode: { type: String },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    adminEmail: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    phone: {
      type: String,
    },
    CIN: {
      type: String,
      required: true,
      unique: true,
    },
    businessFile: {
      type: String, // Store the file path or URL
    },
    bussinessFileName: {
      type: String,
    },
    maxJobPosts: {
      type: Number,
      default: 10, // Default for Free plan
      validate: {
        validator: function (v) {
          return v === null || v >= 0; // Allow null for unlimited
        },
        message: "maxJobPosts must be null or a non-negative number",
      },
    },

    creditedForCandidates: {
      type: Number,
      default: 35,
      validate: {
        validator: function (v) {
          return v === null || v >= 0; // Allow null for unlimited
        },
        message: "Credited For Candidates must be null or a non-negative number",
      },
    },
    userId: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Company = mongoose.model("Company", companySchema);
