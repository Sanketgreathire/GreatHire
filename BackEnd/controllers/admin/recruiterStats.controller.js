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
      {
      $addFields: {
        joinedFormatted: {
          $concat: [
            {
              // $switch converts the day of the week ($dayOfWeek) from createdAt into a short string (e.g., "Sun", "Mon").
              $switch: {
                branches: [
                  {
                    case: { $eq: [{ $dayOfWeek: "$createdAt" }, 1] },
                    then: "Sun",
                  },
                  {
                    case: { $eq: [{ $dayOfWeek: "$createdAt" }, 2] },
                    then: "Mon",
                  },
                  {
                    case: { $eq: [{ $dayOfWeek: "$createdAt" }, 3] },
                    then: "Tue",
                  },
                  {
                    case: { $eq: [{ $dayOfWeek: "$createdAt" }, 4] },
                    then: "Wed",
                  },
                  {
                    case: { $eq: [{ $dayOfWeek: "$createdAt" }, 5] },
                    then: "Thu",
                  },
                  {
                    case: { $eq: [{ $dayOfWeek: "$createdAt" }, 6] },
                    then: "Fri",
                  },
                  {
                    case: { $eq: [{ $dayOfWeek: "$createdAt" }, 7] },
                    then: "Sat",
                  },
                ],
                default: "N/A",
              },
            },
            ", ",
            {
              // $dateToString formats the date as day, year (e.g., 05, 2024).
              $dateToString: { format: "%d, %Y", date: "$createdAt" },
            },
          ],
        },
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
          joined:"$joinedFormatted",
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
          {
            $lookup: {
              from: "companies",
              localField: "_id",
              foreignField: "userId.user",
              as: "companyDetails",
            },
          },
          {
            $unwind: {
              path: "$companyDetails",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "jobs",
              localField: "_id",
              foreignField: "created_by",
              as: "jobs",
            },
          },
          {
            $project: {
              fullname: 1,
              email: "$emailId.email",
              phone: "$phoneNumber.number",
              position: 1,
              postedJobs: { $size: "$jobs" },
              isActive: 1,
              isBlocked: 1,
              companyName: "$companyDetails.companyName",
              companyId: "$companyDetails._id",
              adminEmail: "$companyDetails.adminEmail",
              creditedForJobs: "$companyDetails.creditedForJobs",
              creditedForCandidates: "$companyDetails.creditedForCandidates",
              maxJobPosts: "$companyDetails.maxJobPosts",
              customCreditsForJobs: "$companyDetails.customCreditsForJobs",
              customCreditsForCandidates: "$companyDetails.customCreditsForCandidates",
              customMaxJobPosts: "$companyDetails.customMaxJobPosts",
              isAdmin: {
                $cond: {
                  if: { $eq: ["$emailId.email", "$companyDetails.adminEmail"] },
                  then: true,
                  else: false,
                },
              },
              joined: {
                $dateToString: {
                  format: "%Y-%m-%d",   // ✅ VALID
                  date: "$createdAt",
                },
              },
              createdAt: 1,
            },
          },
          {
            $sort: { createdAt: -1 }
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
export const updateRecruiterEmail = async (req, res) => {
  try {
    const { recruiterId } = req.params;
    const { email } = req.body;

    // 🔐 Allow only Owner
    if (!req.user || req.user.role !== "Owner") {
      return res.status(403).json({
        success: false,
        message: "Only admin can update recruiter email",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // ✅ Email format validation
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Optional: Check if email already exists (excluding current recruiter)
    const existingEmail = await Recruiter.findOne({
      "emailId.email": email,
      _id: { $ne: recruiterId },
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }

    const updatedRecruiter = await Recruiter.findByIdAndUpdate(
      recruiterId,
      {
        $set: {
          "emailId.email": email,
          "emailId.isVerified": false,
        },
      },
      { new: true }
    );

    if (!updatedRecruiter) {
      return res.status(404).json({
        success: false,
        message: "Recruiter not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Email updated successfully",
      recruiter: updatedRecruiter,
    });
  } catch (error) {
    console.error("Error updating recruiter email:", error);
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

// Bulk send company profile reminder emails to inactive recruiters
export const sendBulkCompanyProfileReminders = async (req, res) => {
  console.log('🔥 Bulk email request received');
  console.log('Request body:', req.body);
  console.log('User:', req.user);
  
  const { recruiterIds } = req.body;

  try {
    // 🔐 Allow only Owner
    if (!req.user || req.user.role !== "Owner") {
      console.log('❌ Access denied. User role:', req.user?.role);
      return res.status(403).json({
        success: false,
        message: "Only admin can send bulk emails",
      });
    }

    if (!recruiterIds || !Array.isArray(recruiterIds) || recruiterIds.length === 0) {
      console.log('❌ Invalid recruiter IDs:', recruiterIds);
      return res.status(400).json({
        success: false,
        message: "Recruiter IDs are required",
      });
    }

    console.log('🔍 Looking for recruiters with IDs:', recruiterIds);

    // Find recruiters by IDs
    const recruiters = await Recruiter.find({
      _id: { $in: recruiterIds },
      isActive: false // Only send to inactive recruiters
    });

    console.log('📋 Found recruiters:', recruiters.length);
    console.log('📋 Recruiter details:', recruiters.map(r => ({ id: r._id, name: r.fullname, email: r.emailId?.email, isActive: r.isActive })));

    if (recruiters.length === 0) {
      console.log('❌ No inactive recruiters found');
      return res.status(404).json({
        success: false,
        message: "No inactive recruiters found",
      });
    }

    console.log('🔧 Setting up email transporter...');
    console.log('Email user:', process.env.EMAIL_USER ? 'Set' : 'Not set');
    console.log('Email pass:', process.env.EMAIL_PASS ? 'Set' : 'Not set');

    // Setup nodemailer - Fix the function name
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Test the connection first
    console.log('🔍 Testing email connection...');
    await transporter.verify();
    console.log('✅ Email connection verified');

    let successCount = 0;
    let failedEmails = [];

    // Send emails to each recruiter
    for (const recruiter of recruiters) {
      try {
        console.log(`📧 Sending email to: ${recruiter.emailId?.email}`);
        
        if (!recruiter.emailId?.email) {
          console.log(`⚠️ Skipping recruiter ${recruiter.fullname} - no email`);
          failedEmails.push(`${recruiter.fullname} (no email)`);
          continue;
        }
        
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: recruiter.emailId.email,
          subject: "Complete Your Company Profile - GreatHire",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
              <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h2 style="color: #1D4ED8; margin-bottom: 20px; text-align: center;">Great<span style="color: #333;">Hire</span></h2>
                
                <p style="color: #555; line-height: 1.6;">Dear ${recruiter.fullname || 'Recruiter'},</p>
                
                <p style="color: #555; line-height: 1.6;">
                  We noticed that your company profile is still inactive. You're just one step away from unlocking access to talented candidates.
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="https://greathire.in/recruiter/dashboard/create-company" target="_blank"
                     style="background-color: #1D4ED8; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                    Complete Profile Now
                  </a>
                </div>
                
                <p style="color: #555; line-height: 1.6;">
                  Please complete your profile to 100% so our team can verify your company and activate your account. Once verified, you'll be able to post jobs for free and connect with qualified professionals who are actively looking for opportunities.
                </p>
                
                <p style="color: #555; line-height: 1.6;">
                  A complete profile not only helps with verification but also improves your visibility and builds trust with potential candidates.
                </p>
                
                <div style="background-color: #f0f7ff; padding: 15px; border-left: 4px solid #1D4ED8; margin: 20px 0; border-radius: 5px;">
                  <p style="color: #333; margin: 0 0 8px 0; font-weight: bold;">Complete your profile here:</p>
                  <p style="color: #1D4ED8; margin: 0;">
                    <a href="https://greathire.in/recruiter/login" style="color: #1D4ED8; text-decoration: none; font-weight: 500;">Recruiter Login: https://greathire.in/recruiter/login</a>
                  </p>
                </div>
                
                <p style="color: #555; line-height: 1.6;">
                  Don't miss the opportunity to attract the right talent for your team. Take a minute to complete your company details and start hiring today.
                </p>
                
                <p style="color: #555; line-height: 1.6; margin-top: 30px;">
                  Best regards,<br>
                  <strong>The GreatHire Team</strong>
                </p>
              </div>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        successCount++;
        console.log(`✅ Bulk reminder email sent to ${recruiter.emailId.email}`);
      } catch (emailError) {
        console.error(`❌ Error sending email to ${recruiter.emailId?.email}:`, emailError.message);
        failedEmails.push(recruiter.emailId?.email || recruiter.fullname);
      }
    }

    console.log(`📊 Email results: ${successCount} sent, ${failedEmails.length} failed`);

    return res.status(200).json({
      success: true,
      message: `Bulk emails sent successfully. ${successCount} sent, ${failedEmails.length} failed.`,
      details: {
        totalSent: successCount,
        totalFailed: failedEmails.length,
        failedEmails: failedEmails
      }
    });
  } catch (error) {
    console.error("❌ Error sending bulk emails:", error);
    console.error("❌ Error stack:", error.stack);
    return res.status(500).json({
      success: false,
      message: "Server error while sending bulk emails.",
      error: error.message,
      details: error.stack
    });
  }
};

