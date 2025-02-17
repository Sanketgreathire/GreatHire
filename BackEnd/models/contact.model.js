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
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    phoneNumber: {
      type: String,
      required: true, // phoneNumber of the person contacting
    },
    message: {
      type: [String],
      required: true, // Message content
    },
    status: {
      type: String,
      enum: ["seen", "unseen"],
      default: "unseen",
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

export const Contact = mongoose.model("Contact", contactSchema);
