// this file help to perform operation upon company
import { Company } from "../models/company.model.js";
import { User } from "../models/user.model.js";
import { Recruiter } from "../models/recruiter.model.js";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";
import mongoose from "mongoose";
import { BlacklistedCompany } from "../models/blacklistedCompany.model.js";
import { JobSubscription } from "../models/jobSubscription.model.js";
import JobReport from "../models/jobReport.model.js";


// this function authenticate a recruiter by a company id mean is recruiter belong to particular company
export const isUserAssociated = async (companyId, userId) => {
  try {
    // Find the company by its ID
    const company = await Company.findById(companyId);
    if (!company) {
      // If company is not found, you can either throw an error or return false.
      throw new Error("Company not found.");
    }

    // Check if the user is associated with the company.
    // company.userId is expected to be an array of objects where each object has a `user` field.
    const isAssociated = company.userId.some(
      (userObj) => userObj.user.toString() === userId
    );
    if (!isAssociated) {
      // The user is not associated with the company.
      return false;
    }

    // Now, check if the recruiter (user) is active.
    const recruiter = await Recruiter.findById(userId);
    if (!recruiter) {
      throw new Error("Recruiter not found.");
    }

    // Return true only if the recruiter is active.
    return recruiter.isActive;
  } catch (err) {
    console.error("Error in recruiter validation:", err);
    return false;
  }
};

// this controller create the company
export const registerCompany = async (req, res) => {
  try {
    const {
      companyName,
      companyWebsite,
      industry,
      streetAddress,
      city,
      state,
      country,
      postalCode,
      email,
      phone,
      CIN,
      recruiterPosition,
      userEmail,
    } = req.body;
     //  Added validations here for create company fields

    if (!companyName || companyName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Company name must be at least 2 characters long.",
      });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "A valid company email is required.",
      });
    }

    if (!phone || !/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be exactly 10 digits.",
      });
    }

      if (!CIN) {
      return res.status(400).json({
        success: false,
        message: "CIN is required.",
      });
    }

    const cinPattern = /^[A-Z]{1}\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/;

    if (!cinPattern.test(CIN)) {
      let errorMessage = "Invalid CIN format. ";

      if (CIN.length !== 21) {
        errorMessage += `CIN must be exactly 21 characters long (you entered ${CIN.length}). `;
      }
      if (!/^[A-Z]/.test(CIN)) {
        errorMessage += "First character must be an uppercase letter. ";
      }
      if (!/^[A-Z]\d{5}/.test(CIN)) {
        errorMessage += "Characters 2–6 must be digits. ";
      }
      if (!/^[A-Z]\d{5}[A-Z]{2}/.test(CIN)) {
        errorMessage += "Characters 7–8 must be uppercase letters (state code). ";
      }
      if (!/^[A-Z]\d{5}[A-Z]{2}\d{4}/.test(CIN)) {
        errorMessage += "Characters 9–12 must be digits (incorporation year). ";
      }
      if (!/^[A-Z]\d{5}[A-Z]{2}\d{4}[A-Z]{3}/.test(CIN)) {
        errorMessage += "Characters 13–15 must be uppercase letters (company type). ";
      }
      if (!/^[A-Z]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/.test(CIN)) {
        errorMessage += "Characters 16–21 must be digits (registration number). ";
      }

      return res.status(400).json({
        success: false,
        message: errorMessage.trim(),
      });
    }

    if (!companyWebsite || !/^https?:\/\/.+\..+/.test(companyWebsite)) {
      return res.status(400).json({
        success: false,
        message: "Valid company website URL is required.",
      });
    }

    if (!industry) {
      return res.status(400).json({
        success: false,
        message: "Industry is required.",
      });
    }

    if (!streetAddress || !city || !state || !country || !postalCode) {
      return res.status(400).json({
        success: false,
        message: "Complete company address is required.",
      });
    }
    
    //console.log(req.body);   //for testing purpose

    const adminEmail = userEmail;
    // CIN validation function
    // const  isValidCIN = (cin) => {
    //   const cinRegex = /^[A-Z]{1}\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/;
    //   return cinRegex.test(cin);
    // };

    //console.log("is valid true otherwise false :"+isValidCIN(CIN));             //for testing purpose

    // CIN is unique number of a any bussiness
    // if (!isValidCIN(CIN)) {
    //   return res.status(400).json({
    //     message: "Invalid CIN format.",
    //     success: false,
    //   });
    // }

    // Check if any unique field exists in the BlacklistedCompany collection
    const isBlacklisted = await BlacklistedCompany.findOne({
      $or: [{ companyName }, { email }, { adminEmail }, { CIN }],
    });

    //console.log("is blacklisted true otherwise false :"+isBlacklisted);             //for testing purpose

    if (isBlacklisted) {
      return res.status(400).json({
        message: "Company Blacklisted",
        success: false,
      });
    }

    // Check if a company already exists with this email and CIN
    let company = await Company.findOne({ email, adminEmail, CIN });

    //console.log("is company already existed true otherwise false :"+company);             //for testing purpose
          const existingEmail = await Company.findOne({ email });
          if (existingEmail) {
            return res.status(400).json({
              message: "Email is already used by another company.",
              success: false,
            });
          }

          const existingCIN = await Company.findOne({ CIN });
          if (existingCIN) {
            return res.status(400).json({
              message: "CIN is already registered.",
              success: false,
            });
          }

          const existingPhone = await Company.findOne({ phone });
          if (existingPhone) {
            return res.status(400).json({
              message: "Phone number is already used by another company.",
              success: false,
            });
          }
          // Check if company name already exists
          const existingCompanyName = await Company.findOne({ companyName });
          if (existingCompanyName) {
            return res.status(400).json({
              message: "Company name is already registered.",
              success: false,
            });
          }

          // Check if company website already exists
          const existingWebsite = await Company.findOne({ companyWebsite });
          if (existingWebsite) {
            return res.status(400).json({
              message: "Company website is already registered.",
              success: false,
            });
          }

          // Check if industry already exists
          const existingIndustry = await Company.findOne({ industry });
          if (existingIndustry) {
            return res.status(400).json({
              message: "Industry is already registered with another company.",
              success: false,
            });
          }

    // Check if a recruiter exists with this email
    let recruiter = await Recruiter.findOne({ "emailId.email": userEmail });

    //console.log("is recruiter not found true otherwise false :"+recruiter);             //for testing purpose

    if (!recruiter) {
      return res.status(404).json({
        message: "Recruiter not found.",
        success: false,
      });
    }

    recruiter.position = recruiterPosition;
    recruiter.isCompanyCreated = true;
    await recruiter.save();

    let cloudResponse;
    const { businessFile } = req.files;
    if (businessFile && businessFile.length > 0) {
      // Convert file to a URI
      const fileUri = getDataUri(businessFile[0]);

      // Upload to Cloudinary
      cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    } 
    // Create a new company if it doesn't exist
    company = await Company.create({
      companyName,
      companyWebsite,
      industry,
      email,
      adminEmail: userEmail,
      phone,
      CIN,
      userId: [{ user: recruiter._id, isVerified: 0 }], // Add recruiter with `isVerified: false`
      address: {
        streetAddress,
        city,
        state,
        country,
        postalCode,
      },
      businessFile: cloudResponse ? cloudResponse.secure_url : undefined,
      businessFileName: businessFile ? businessFile[0].originalname : undefined,
      maxJobPosts: "Unlimited",
    });

    return res.status(201).json({
      message: "Company registered successfully.",
      // company,
      // recruiter,
      success: true,
    });
  } catch (error) {
    console.error("Error in registering company:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};


//get  company by company id ...
export const getCompanyById = async (req, res) => {
  try {
    const { companyId } = req.body;
    // find company by company id
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        Success: false,
      });
    }
    company.hasSubscription = true;
    await company.save();

    res.status(200).json({ message: "Subscription activated successfully" });
  } catch (error) {
    console.log(error);
  }
};

// this controller return the company according to recruiter id mean which recruiter belong to which recruiter
export const companyByUserId = async (req, res) => {
  const { userId } = req.body; // recrutier id

  try {
    // Validate userId
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Query the company where userId matches
    const company = await Company.findOne({
      userId: { $elemMatch: { user: new mongoose.Types.ObjectId(userId) } },
    });

    if (company) {
      return res.status(200).json({ success: true, company });
    } else {
      return res.status(404).json({
        success: false,
        message: "Company not found for the given user ID.",
      });
    }
  } catch (err) {
    console.error(`Error in fetching company by user ID: ${err}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};
//update company details
export const updateCompany = async (req, res) => {
  try {
    const { companyWebsite, address, industry, email, phone } = req.body;
    const companyId = req.params.id;
    const userId = req.id;

    if (!isUserAssociated(companyId, userId)) {
      return res
        .status(403)
        .json({ message: "You are not authorized", success: false });
    }

    const company = await Company.findById(companyId);
    // Update only provided fields
    if (companyWebsite !== undefined) company.companyWebsite = companyWebsite;
    if (address !== undefined) company.address = address;
    if (industry !== undefined) company.industry = industry;
    if (email !== undefined) company.email = email;
    if (phone !== undefined) company.phone = phone;

    // Save the updated company document
    const updatedCompany = await company.save();

    return res.status(200).json({
      company: updatedCompany,
      message: "Company information updated.",
      success: true,
    });
  } catch (error) {
    console.error("Error updating company:", error);
    return res.status(500).json({
      message: "An error occurred while updating the company.",
      success: false,
    });
  }
};

// this controller update the admin of a company. There is be a single admin of a company always and only admin can select a recruiter as admin from his / her company
export const changeAdmin = async (req, res) => {
  const { email, companyId, adminEmail } = req.body;
  const userId = req.id;

  try {
    // Find the company by ID
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        success: false,
      });
    }

    // Check if the userEmail is equal to the company's admin email
    if (email !== company.adminEmail) {
      return res.status(403).json({
        message: "You are not authorized to change the admin.",
        success: false,
      });
    }

    // Check if the userId exists in the company's userId array
    const userExists = company.userId.some(
      (user) => user.user.toString() === userId
    );

    if (!userExists) {
      return res.status(404).json({
        message: "You are not found in the company.",
        success: false,
      });
    }

    // Change the company's admin email
    company.adminEmail = adminEmail;
    await company.save();

    return res.status(200).json({
      message: "Admin email changed successfully.",
      success: true,
    });
  } catch (error) {
    console.error("Error changing admin:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// return current job plan if company purchased
export const getCurrentPlan = async (req, res) => {
  try {
    const companyId = req.params.id; // Get company ID from request parameters
    const userId = req.id;

    if (!isUserAssociated(companyId, userId)) {
      return res
        .status(403)
        .json({ message: "You are not authorized", success: false });
    }

    // Find the active subscription for the company
    const currentPlan = await JobSubscription.findOne({
      company: companyId,
      status: { $ne: "Hold" }, // Exclude plans with status "Hold"
    }).select("jobBoost expiryDate planName price status purchaseDate");
    // Select only required fields

    res.status(200).json({
      success: true,
      message: "Current active plan retrieved successfully",
      plan: currentPlan,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// This controller will help to get candiadate data mean recruiter can find user or candidate according to their need
export const getCandidateData = async (req, res) => {
  try {
    const {
      jobTitle,
      experience,
      salaryBudget,
      gender,
      qualification,    
      lastActive,
      location,
      skills,
      companyId,
    } = req.query;
    console.log(req.query); // for testing purpose

    const userId = req.id;

    if (!(await isUserAssociated(companyId, userId))) {
      return res.status(403).json({
        message: "You are not authorized",
        success: false,
      });
    }

    const escapeRegex = (str) =>
      typeof str === "string"
        ? str.replace(/[-[\]{}()*+?.,\\^$|#\s><]/g, "\\$&")
        : "";

    const query = {
      "profile.resume": { $exists: true, $ne: "" },
    };

    // Job Title
    if (jobTitle?.trim()) {
      const sanitizedJobTitle = escapeRegex(jobTitle.trim());
      query["profile.experience.jobProfile"] = {
        $regex: new RegExp(`^${sanitizedJobTitle}$`, "i"),
      };
    }

    // Experience
    if (experience) {
      query["profile.experience.duration"] = experience;
    }

    // Salary
    if (salaryBudget) {
      query["profile.expectedCTC"] = salaryBudget;
    }

    // Gender (Assuming you have added gender in schema under profile or user directly)
    if (gender) {
      query["profile.gender"] = new RegExp(`^${escapeRegex(gender)}$`, "i");
    }

    // Qualification (Assuming stored in profile.bio or new field you add)
    if (qualification) {
      query["profile.qualification"] = new RegExp(escapeRegex(qualification), "i");
    }

    // Last Active - days based filter
    if (lastActive) {
      const daysAgo = parseInt(lastActive);
      if (!isNaN(daysAgo)) {
        const sinceDate = new Date();
        sinceDate.setDate(sinceDate.getDate() - daysAgo);
        query["updatedAt"] = { $gte: sinceDate };
      }
    }

    // Location (assumes city/state/country)
    if (location) {
      const sanitizedLocation = escapeRegex(location.trim().toLowerCase());
      const locationRegex = new RegExp(sanitizedLocation, "i");
    
      query.$or = [
        { "address.city": locationRegex },
        { "address.state": locationRegex },
        { "address.country": locationRegex },
      ];
    }
    

    // Skills (array match)
    if (skills) {
      let skillArray = [];
    
      if (typeof skills === "string") {
        skillArray = skills.split(",").map((s) => s.trim().toLowerCase());
      } else if (Array.isArray(skills)) {
        skillArray = skills.map((s) => String(s).trim().toLowerCase());
      }
    
      if (skillArray.length > 0) {
        // Using aggregation expression to match lowercased DB skills
        query.$expr = {
          $setIsSubset: [
            skillArray,
            {
              $map: {
                input: "$profile.skills",
                as: "skill",
                in: { $toLower: "$$skill" },
              },
            },
          ],
        };
      }
    }

    const candidates = await User.find(query).select({
      fullname: 1,
      "profile.experience.jobProfile": 1,
      "profile.skills": 1,
      "profile.experience.duration": 1,
      "profile.expectedCTC": 1,
      "profile.resume": 1,
      "profile.profilePhoto": 1,
      updatedAt: 1,
      address: 1,
    });

    // Add daysAgoLastActive to each candidate
    const enhancedCandidates = candidates
      .map((candidate) => {
        const lastActiveDate = new Date(candidate.updatedAt);
        const now = new Date();
        const diffMs = now - lastActiveDate;

        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(
          (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );

        return {
          ...candidate.toObject(),
          daysAgoLastActive: diffDays,
          hoursAgoLastActive: diffHours,
          lastActiveAgo: `${diffDays} day${diffDays !== 1 ? "s" : ""} ${
            diffHours
          } hour${diffHours !== 1 ? "s" : ""} ago`,
        };
      })
      .sort((a, b) => {
        const totalA = a.daysAgoLastActive * 24 + a.hoursAgoLastActive;
        const totalB = b.daysAgoLastActive * 24 + b.hoursAgoLastActive;
        return totalA - totalB; // most recent first
      });


    res.status(200).json({ success: true, candidates:enhancedCandidates });
  } catch (error) {
    console.error("Error fetching candidate data:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};


// if recruiter finding the candidate and if they view the resume of candidate then one credit decrease 1 Resume === 1 credit
export const decreaseCandidateCredits = async (req, res) => {
  try {
    const companyId = req.params.id;
    const userId = req.id;

    if (!isUserAssociated(companyId, userId)) {
      return res
        .status(403)
        .json({ message: "You are not authorized", success: false });
    }
    const company = await Company.findById(companyId);
    // If creditedForCandidates is null, no need to decrease
    if (company.creditedForCandidates !== null) {
      if (company.creditedForCandidates > 0) {
        company.creditedForCandidates -= 1;
        await company.save();
      }
    }
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Error decreasing candidate credits:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// return all applicants of a company
export const getCompanyApplicants = async (req, res) => {
  try {
    const { companyId } = req.params; // Extract company id 
    const userId = req.id;

    if (!isUserAssociated(companyId, userId)) {
      return res
        .status(403)
        .json({ message: "You are not authorized", success: false });
    }

    // Find all job postings under this company
    const jobIds = await Job.find({ company: companyId }).distinct("_id");

    // Find applications for these jobs in assecending order
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate("applicant") // Only populate applicant details
      .sort({ createdAt: -1 }); // Sort latest first

    res.status(200).json({
      success: true,
      totalApplications: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// this controller report to a particular job by a user if a job found invalid 
export const reportJob = async (req, res) => {
  try {
    const { jobId, reportTitle, description } = req.body;
    const userId = req.id;

    if (!jobId || !userId || !reportTitle) {
      return res
        .status(400)
        .json({ message: "Job ID, User ID, and Report Title are required." });
    }

    if (
      reportTitle === "Other" &&
      (typeof description !== "string" || description.length > 300)
    ) {
      return res
        .status(400)
        .json({ message: "Description should be within 300 characters." });
    }

    const newReport = new JobReport({
      userId,
      jobId,
      reportTitle,
      description: reportTitle === "Other" && !description ? null : description,
    });

    await newReport.save();
    res.status(201).json({
      success: true,
      message: "Report submitted successfully.",
    });
  } catch (err) {
    console.error("Error reporting job:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};
// Temporary test to check pre-save hook
// (async () => {
//   try {
//     const temp = new Company({
//       companyName: "Temp Test Company",
//       email: `temp${Date.now()}@example.com`,
//       adminEmail: `admintemp${Date.now()}@example.com`,
//       CIN: `CIN${Date.now()}`,
//       hasSubscription: true // This should trigger unlimited jobs
//     });

//     await temp.save();
//     console.log("Saved company:", temp);
//     console.log("maxJobPosts value after save:", temp.maxJobPosts);
//   } catch (err) {
//     console.error("Test save error:", err.message);
//   }
// })();

