import { Company } from "../../models/company.model.js";
import { Recruiter } from "../../models/recruiter.model.js";
import nodemailer from "nodemailer";

// returning total number of recruiter, total active recruiters, total deactive recruiters
export const getRecrutierStats = async (req, res) => {
  try {
    // Total Recruiters
    const totalRecruiters = await Recruiter.countDocuments();
    // Total Active Recruiters
    const totalActiveRecruiters = await Recruiter.countDocuments({
      isActive: true,
    });
    // Total Deactive Recruiters
    const totalDeactiveRecruiters = await Recruiter.countDocuments({
      isActive: false,
    });

    return res.status(200).json({
      success: true,
      stats: {
        totalRecruiters,
        totalActiveRecruiters,
        totalDeactiveRecruiters,
      },
    });
  } catch (err) {
    console.error("Error fetching recruiter stats:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// returning recruiter list of a particular company.
export const getRecruitersList = async (req, res) => {
  try {
    // Get companyId from the route parameters
    const { companyId } = req.params;

    // Find the company by its ID
    const company = await Company.findById(companyId);
    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    }

    // Extract the recruiter IDs from the company's userId array.
    // Assuming the structure is: userId: [ { user: ObjectId }, ... ]
    const recruiterIds = company.userId.map((u) => u.user);

    // Aggregate recruiters matching the company recruiter IDs
    const recruitersAggregation = await Recruiter.aggregate([
      // Match recruiters whose _id is in the extracted list
      {
        $match: { _id: { $in: recruiterIds } },
      },
      // Lookup jobs created by each recruiter
      {
        $lookup: {
          from: "jobs", // Make sure this matches the actual collection name for jobs
          localField: "_id",
          foreignField: "created_by", // In the Job model, this field indicates the creator recruiter
          as: "jobs",
        },
      },
      // Add a field for the number of posted jobs
      {
        $addFields: {
          postedJobs: { $size: "$jobs" },
        },
      },
      // Project the desired fields
      {
        $project: {
          fullname: 1,
          email: "$emailId.email", // Flatten the nested email field
          phone: "$phoneNumber.number", // Flatten the nested phone number
          position: 1,
          postedJobs: 1,
          isActive: 1, // Recruiter status (active/inactive)
        },
      },
    ]);

    // Map each recruiter to include an "isAdmin" flag based on comparison with company's adminEmail.
    const recruitersWithAdmin = recruitersAggregation.map((recruiter) => ({
      ...recruiter,
      isAdmin: recruiter.email === company.adminEmail,
    }));

    // Compute summary information from the updated recruiters
    const totalRecruiters = recruitersWithAdmin.length;
    const activeRecruiters = recruitersWithAdmin.filter(
      (r) => r.isActive
    ).length;
    const deactiveRecruiters = recruitersWithAdmin.filter(
      (r) => !r.isActive
    ).length;
    const totalJobPosts = recruitersWithAdmin.reduce(
      (sum, r) => sum + (r.postedJobs || 0),
      0
    );

    return res.status(200).json({
      success: true,
      recruiters: recruitersWithAdmin,
      summary: {
        totalRecruiters,
        activeRecruiters,
        deactiveRecruiters,
        totalJobPosts,
      },
    });
  } catch (error) {
    console.error("Error fetching recruiter list:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// returning all recruiter list of all company
export const getAllRecruitersList = async (req, res) => {
  try {
    const recruitersAggregation = await Recruiter.aggregate([
      // Lookup the company details where this recruiter is referenced in the company's userId array
      {
        $lookup: {
          from: "companies", //  Specifies the collection to join (companies).
          let: { recruiterId: "$_id" }, // Defines a local variable (recruiterId) for use in the pipeline.
          // pipeline is series of stages and in one stage perform operation upon document of collection and send result of one stage to another stage
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$$recruiterId", "$userId.user"],//  Finds companies where the recruiterId exists in the userId.user array.
                },
              },
            },
            // Project the fields you need from the company, including adminEmail
            {
              $project: {
                companyName: 1,
                adminEmail: 1,
              },
            },
          ],
          as: "companyDetails", // Stores the result in the companyDetails array.
        },
      },
      // Unwind the companyDetails array (if a recruiter belongs to one company)
      {
        // Converts the companyDetails array to an object.
        $unwind: {
          path: "$companyDetails",
          preserveNullAndEmptyArrays: true, // it keeps companyDetails as null instead of dropping the document.
        },
      },
      // Lookup jobs created by each recruiter
      {
        $lookup: {
          from: "jobs", // Ensure this matches the actual collection name for jobs
          localField: "_id",
          foreignField: "created_by",
          as: "jobs",
        },
      },
      // Add a field counting the number of posted jobs
      {
        $addFields: {
          postedJobs: { $size: "$jobs" },
        },
      },
      // Project the desired fields for output and include adminEmail from companyDetails
      {
        $project: {
          fullname: 1,
          email: "$emailId.email", // flatten the nested email field
          phone: "$phoneNumber.number", // flatten the nested phone number
          position: 1,
          postedJobs: 1,
          isActive: 1,
          companyName: "$companyDetails.companyName",
          companyId: "$companyDetails._id",
          adminEmail: "$companyDetails.adminEmail",
        },
      },
    ]);

    // Map each recruiter to add an "isAdmin" flag based on comparison with company's adminEmail
    const recruitersWithAdmin = recruitersAggregation.map((recruiter) => ({
      ...recruiter,
      isAdmin: recruiter.email === recruiter.adminEmail,
    }));

    return res.status(200).json({
      success: true,
      recruiters: recruitersWithAdmin,
    });
  } catch (error) {
    console.error("Error fetching all recruiters list:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// fetch recruiter details by recruiter id
export const getRecruiter = async (req, res) => {
  try {
    const { userId } = req.params; // recruiter id

    // Validate ObjectId format to prevent errors
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID" });
    }

    // Fetch the user details (excluding sensitive fields like password)
    const user = await User.findById(userId).select("-password").lean();

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Controller to send email reply to recruiter 
export const sendMessage = async (req, res) => {
  const { recruiterId, message } = req.body;
  //console.log(req.body);

  try {
    let email = "";
    let name = "";
    let subject = "Reply from GreatHire Support";

    

    const recruiter = await Recruiter.findById(recruiterId);
    if (!recruiter) return res.status(404).json({ success: false, message: "Recruiter not found" });
    email = recruiter.emailId.email;
    name = recruiter.fullname;
    // You can extend this with saving messages in DB or sending email
    console.log(`Message to ${email} ${name}: ${message}`);

    // Setup nodemailer
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"GreatHire Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2>Great<span style="color: #1D4ED8;">Hire</span></h2>
            <p style="color: #555;">Message from GreatHire Support</p>
          </div>

          <h3 style="color: #333;">Hello ${name},</h3>
          <p style="color: #555;">
            Thank you for reaching out to GreatHire. Please find below our reply:
          </p>
          
          <blockquote style="background-color: #f9f9f9; padding: 10px; border-left: 4px solid #1D4ED8; margin: 20px 0;">
            ${message}
          </blockquote>
          
          <p style="color: #555;">
            If you have further questions, feel free to reach out.
          </p>
          
          <p style="color: #555;">
            Best Regards,<br/>GreatHire Support Team
          </p>

          <div style="margin-top: 20px; text-align: center;">
            <p style="font-size: 14px; color: #aaa;">This is an automated email, please do not reply.</p>
            <p style="font-size: 14px; color: #aaa;">© ${new Date().getFullYear()} GreatHire. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: "Reply sent successfully via email." });
  } catch (error) {
    console.error("Error sending reply:", error);
    return res.status(500).json({ success: false, message: "Server error while sending email." });
  }
};

