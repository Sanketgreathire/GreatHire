import mongoose from "mongoose";


const digitalmarketerSchema = new mongoose.Schema(
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
      default: "Owner",
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



export const DigitalMarketer = mongoose.model("DigitalMarketer", digitalmarketerSchema);
