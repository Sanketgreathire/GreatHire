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
export const deleteContact = async (req, res) => {
  try {
    const { msgId } = req.params;
    if (!msgId) {
      return res
        .status(400)
        .json({ success: false, message: "Message ID is required." });
    }

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
    return res
      .status(500)
      .json({
        success: false,
        message: "Server error while deleting contact message.",
      });
  }
};

// Controller to delete a single job report by msgId
export const deleteJobReport = async (req, res) => {
  try {
    const { msgId } = req.params;
    console.log(msgId)
    if (!msgId) {
      return res
        .status(400)
        .json({ success: false, message: "Message ID is required." });
    }

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
    return res
      .status(500)
      .json({
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
    return res
      .status(500)
      .json({
        success: false,
        message: "Server error while deleting all messages.",
      });
  }
};
