import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
  companyName: { type: String },
  jobProfile: { type: String },
  duration: { type: String },
  experienceDetails: { type: String },
  currentlyWorking: { type: Boolean, default: false },
  currentCTC: { type: String, default: ""}, // only relevant if currentlyWorking = true
  noticePeriod: { type: String, default: ""},
});

const userSchema = new mongoose.Schema(
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
    alternatePhone: {
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
      default: "student",
    },
    address: {
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      country: {
        type: String,
      },
      pincode: {
        type: Number,
        min: 100000,   // minimum 6-digit pincode in India
        max: 999999,
        required: false,
      }
    },
    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
    profile: {
      language: {
        type: [String],
        default: [],
      },
      category: {
        type: [String],
        default: [],
      },
      coverLetter: {
        type: String,
      },
      bio: { type: String },

       // ✅ New field for fresher vs experience
      hasExperience: {
        type: Boolean,
        default: false,
      },
      experiences: [experienceSchema], // if fresher → keep this []

      skills: [{ type: String }],
      resume: { type: String }, // URL for the resume
      resumeOriginalName: { type: String },
      profilePhoto: {
        type: String,
        default: "",
      },
      gender: {
        type: String,
        enum: ["Male","Female","Other"],
        default: "Female",
      },
      qualification: {
        type: String,
        enum: [
         "","Post Graduation", "Under Graduation", "M.Sc. Computer Science","B.Sc. Computer Science", "M.Sc. Information Technology", "B.Sc. Information Technology", "B.Tech", "M.Tech", "MBA", "MCA", "B.Sc", "M.Sc", "B.Com", "M.Com",
          "Diploma", "12th Pass", "10th Pass", "Others"
        ],
        default: "", 
      },
      otherQualification: {
        type: String,
        default: ""
      },
      documents: {
      type: [String],   // e.g. ["PAN Card", "Aadhar Card", "Passport"]
      default: [],
    },
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
