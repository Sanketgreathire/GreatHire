import JobReport from "../models/jobReport.model.js";
import { Contact } from "../models/contact.model.js";

export const getUnseenNotifications = async (req, res) => {
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
