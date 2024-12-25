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
    taxId: {
      type: String,
    },
    businessFile: {
      type: String, // Store the file path or URL
    },
    bussinessFileName: {
      type: String,
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
  },
  { timestamps: true }
);

export const Company = mongoose.model("Company", companySchema);
