import { Application } from "../models/application.model.js";
import { startInterviewCall } from "../services/interview.service.js";

export const startInterview = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    const questions = `
Ask candidate about:

1. Technical skills
2. Experience
3. Problem solving
4. Communication

Keep interview under 10 minutes.
`;

    const call = await startInterviewCall(application.applicantPhone, questions);

    console.log("Application:", application._id);
    console.log("Phone:", application.applicantPhone);
    console.log("Bland call response:", call);

    application.aiInterview.status = "Scheduled";
    application.aiInterview.blandCallId = call.call_id;
    await application.save();

    return res.json({ success: true, call });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
