import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Full name of the person contacting
    },
    email: {
      type: String,
      required: true, // Email of the person contacting
    },
    message: {
      type: [String],
      required: true, // Message content
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

export const Contact = mongoose.model("Contact", contactSchema);