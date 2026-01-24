import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false, // Full name of the person contacting
    },
    email: {
      type: String,
      required: false, // Email of the person contacting
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    phoneNumber: {
      type: String,
      required: false, // phoneNumber of the person contacting
    },
    message: {
      type: String,
      required: false, // Message content
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
