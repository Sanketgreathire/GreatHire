import JobReport from "../models/jobReport.model.js";
import { Contact } from "../models/contact.model.js";
import { check, validationResult } from "express-validator";
import nodemailer from "nodemailer";

// this will return all unseen notification count to admin
export const getUnseenNotificationsCount = async (req, res) => {
  try {
    // Count unseen job reports
    const unseenJobReportsCount = await JobReport.countDocuments({
      status: "unseen",
    });

    // Count unseen contact messages
    const unseenContactsCount = await Contact.countDocuments({
      status: "unseen",
    });

    // Total unseen notifications
    const totalUnseenNotifications =
      unseenJobReportsCount + unseenContactsCount;

    return res.status(200).json({ success: true, totalUnseenNotifications });
  } catch (error) {
    console.error("Error fetching unseen notifications:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// this will return all unseen Messages admin
export const getUnseenMessages = async (req, res) => {
  try {
    // job reports and populate user and job details
    const jobReports = await JobReport.find({ status: "unseen" })
      .populate("userId", "fullname emailId phoneNumber")
      .populate("jobId", "jobDetails")
      .lean();

    //contact messages
    const contacts = await Contact.find({ status: "unseen" }).lean();

    // Map job report messages with required fields:
    // - User: fullname, emailId.email, phoneNumber.number
    // - Job: jobDetails.title, jobDetails.companyName
    // - Also include reportTitle and description
    const jobReportMessages = jobReports.map((report) => ({
      id: report._id,
      type: "job_report",
      user: {
        fullname: report.userId?.fullname,
        email: report.userId?.emailId?.email,
        phone: report.userId?.phoneNumber?.number,
      },
      job: {
        jobId: report.jobId?._id,
        title: report.jobId?.jobDetails?.title,
        companyName: report.jobId?.jobDetails?.companyName,
      },
      reportTitle: report.reportTitle,
      description: report.description,
      createdAt: report.createdAt,
    }));

    // Map contact messages with the provided details
    const contactMessages = contacts.map((contact) => ({
      id: contact._id,
      type: "contact",
      name: contact.name,
      email: contact.email,
      phoneNumber: contact.phoneNumber,
      message: contact.message,
      createdAt: contact.createdAt,
    }));

    // Combine and sort messages by createdAt (most recent first)
    const messages = [...jobReportMessages, ...contactMessages].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// return all message list which have been seen by admin
export const getMessages = async (req, res) => {
  try {
    // job reports and populate user and job details
    const jobReports = await JobReport.find({})
      .populate("userId", "fullname emailId phoneNumber")
      .populate("jobId", "jobDetails")
      .lean();

    //contact messages
    const contacts = await Contact.find({}).lean();

    // Map job report messages with required fields:
    // - User: fullname, emailId.email, phoneNumber.number
    // - Job: jobDetails.title, jobDetails.companyName
    // - Also include reportTitle and description
    const jobReportMessages = jobReports.map((report) => ({
      id: report._id,
      type: "job_report",
      user: {
        fullname: report.userId?.fullname,
        email: report.userId?.emailId?.email,
        phone: report.userId?.phoneNumber?.number,
      },
      job: {
        jobId: report.jobId?._id,
        title: report.jobId?.jobDetails?.title,
        companyName: report.jobId?.jobDetails?.companyName,
      },
      reportTitle: report.reportTitle,
      description: report.description,
      createdAt: report.createdAt,
    }));

    // Map contact messages with the provided details
    const contactMessages = contacts.map((contact) => ({
      id: contact._id,
      type: "contact",
      name: contact.name,
      email: contact.email,
      phoneNumber: contact.phoneNumber,
      message: contact.message,
      createdAt: contact.createdAt,
    }));

    // Combine and sort messages by createdAt (most recent first)
    const messages = [...jobReportMessages, ...contactMessages].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// mark all unseen message as seen in jobreport and contact
export const markAsSeen = async (req, res) => {
  try {
    // Update all unseen job reports to "seen"
    await JobReport.updateMany({ status: "unseen" }, { status: "seen" });

    // Update all unseen contact messages to "seen"
    await Contact.updateMany({ status: "unseen" }, { status: "seen" });

    return res.status(200).json({
      success: true,
      message: "All unseen notifications have been marked as seen.",
    });
  } catch (error) {
    console.error("Error marking notifications as seen:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error: Unable to update notifications.",
    });
  }
};

// Controller to delete a single contact message by msgId
export const deleteContact = [
  // Input validation
  check("msgId").isMongoId().withMessage("Invalid message ID"),

  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { msgId } = req.params;

      // find Contact my msgId and delete
      const deletedContact = await Contact.findByIdAndDelete(msgId);

      if (!deletedContact) {
        return res
          .status(404)
          .json({ success: false, message: "Contact message not found." });
      }

      return res.status(200).json({
        success: true,
        message: "Contact message deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting contact message:", error);
      return res.status(500).json({
        success: false,
        message: "Server error while deleting contact message.",
      });
    }
  }
];

// Controller to delete a single job report by msgId
export const deleteJobReport = async (req, res) => {
  try {
    const { msgId } = req.params; // message id

    if (!msgId) {
      return res
        .status(400)
        .json({ success: false, message: "Message ID is required." });
    }

    // delete job report by id
    const deletedJobReport = await JobReport.findByIdAndDelete(msgId);
    
    if (!deletedJobReport) {
      return res
        .status(404)
        .json({ success: false, message: "Job report not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Job report deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting job report:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting job report.",
    });
  }
};

// Controller to delete all messages from both Contact and JobReport models
export const deleteAllMessages = async (req, res) => {
  try {
    await Promise.all([Contact.deleteMany({}), JobReport.deleteMany({})]);

    return res.status(200).json({
      success: true,
      message: "All messages deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting all messages:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting all messages.",
    });
  }
};

// Controller to send email reply to Message
export const sendReplyToMessage = async (req, res) => {
  const { msgId, type, replyMessage } = req.body;
  console.log(req.body);

  try {
    let email = "";
    let name = "";
    let subject = "Reply from GreatHire Support";

    if (type === "contact") {
      const contact = await Contact.findById(msgId);
      if (!contact) {
        return res.status(404).json({ success: false, message: "Contact message not found." });
      }
      email = contact.email;
      name = contact.name;
    } else if (type === "job_report") {
      const report = await JobReport.findById(msgId).populate("userId", "fullname emailId.email");
      if (!report || !report.userId?.emailId?.email) {
        return res.status(404).json({ success: false, message: "Job report not found." });
      }
      email = report.userId.emailId.email;
      name = report.userId.fullname;
    } else {
      return res.status(400).json({ success: false, message: "Invalid message type." });
    }

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
            ${replyMessage}
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
