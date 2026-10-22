import axios from "axios";
import { Recruiter } from "../models/recruiter.model.js";

// Converts "7385217483", "917385217483", or "+917385217483" into standard 917385217483.
export const toWhatsAppNumber = (raw) => {
  if (!raw) return null;
  const rawStr = typeof raw === "object" && raw.number ? raw.number : String(raw);
  const text = rawStr.trim();
  const digits = text.replace(/\D/g, "");

  // If starts with +, accept valid international length (10-15 digits)
  if (text.startsWith("+")) return digits.length >= 10 && digits.length <= 15 ? digits : null;
  // Standard 10-digit Indian mobile
  if (digits.length === 10) return `91${digits}`;
  // 12 digits starting with 91
  if (digits.length === 12 && digits.startsWith("91")) return digits;
  if (digits.length > 10 && digits.length <= 15) return digits;
  return null;
};

// Helper to format Meta CRM API URL with required API version (e.g. v20.0)
export const getWhatsAppApiUrl = () => {
  let url = (process.env.WHATSAPP_API_URL || "https://crmapi.com.bot/api/meta").trim();
  if (!/\/v\d+(\.\d+)?$/i.test(url)) {
    url = `${url.replace(/\/+$/, "")}/v20.0`;
  }
  return url;
};

// Generic function to send approved WhatsApp template messages via Meta CRM API
export const sendWhatsAppTemplate = async ({ phone, templateName, params = [], languageCode = "en" }) => {
  try {
    const to = toWhatsAppNumber(phone);
    if (!to) {
      console.log(`WhatsApp ${templateName} skipped: invalid phone number (${phone})`);
      return { success: false, reason: "invalid_phone" };
    }

    const apiUrl = getWhatsAppApiUrl();
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const token = process.env.WHATSAPP_TOKEN;

    if (!phoneId || !token) {
      console.error("WhatsApp credentials missing in environment variables.");
      return { success: false, reason: "missing_credentials" };
    }

    const url = `${apiUrl}/${phoneId}/messages`;

    const payload = {
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: {
        name: templateName,
        language: { code: languageCode },
        ...(params && params.length > 0
          ? {
              components: [
                {
                  type: "body",
                  parameters: params.map((p) => ({ type: "text", text: String(p ?? "") })),
                },
              ],
            }
          : {}),
      },
    };

    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log(`WhatsApp template [${templateName}] sent successfully to ${to}:`, response.data);
    return { success: true, data: response.data };
  } catch (err) {
    const errorDetails = err.response?.data || err.message;
    console.error(`WhatsApp template [${templateName}] failed to send to ${phone}:`, errorDetails);
    return { success: false, error: errorDetails };
  }
};

// Send direct text WhatsApp message
export const sendWhatsAppText = async ({ phone, text }) => {
  try {
    const to = toWhatsAppNumber(phone);
    if (!to) {
      console.log(`WhatsApp text skipped: invalid phone number (${phone})`);
      return { success: false, reason: "invalid_phone" };
    }

    const apiUrl = getWhatsAppApiUrl();
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const token = process.env.WHATSAPP_TOKEN;

    if (!phoneId || !token) {
      console.error("WhatsApp credentials missing in environment variables.");
      return { success: false, reason: "missing_credentials" };
    }

    const url = `${apiUrl}/${phoneId}/messages`;

    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "text",
      text: { preview_url: false, body: text },
    };

    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log(`WhatsApp text message sent successfully to ${to}:`, response.data);
    return { success: true, data: response.data };
  } catch (err) {
    const errorDetails = err.response?.data || err.message;
    console.error(`WhatsApp text message failed to send to ${phone}:`, errorDetails);
    return { success: false, error: errorDetails };
  }
};

// ==========================================
// 1. RECRUITER NOTIFICATIONS
// ==========================================

/**
 * 1. Welcome on Signup
 * Trigger: Recruiter signup successful
 *
 * 🎉 Welcome to GreatHire, {{recruiterName}}!
 * Your recruiter account has been created successfully.
 * You can now post jobs, review applications, discover candidates, and manage your hiring process.
 * We're excited to help you find the right talent!
 * — Team GreatHire
 */
export const sendWhatsAppRecruiterWelcome = async (recruiter) => {
  const phone = recruiter?.phoneNumber?.number || recruiter?.phoneNumber || recruiter?.phone;
  const recruiterName = recruiter?.fullname || "Recruiter";

  // Try the new rich template first (exact user template)
  let templateRes = await sendWhatsAppTemplate({
    phone,
    templateName: "recruiter_welcome_v2",
    params: [recruiterName],
  });

  // Fallback to previous approved template if v2 is still pending Meta approval
  if (!templateRes.success) {
    templateRes = await sendWhatsAppTemplate({
      phone,
      templateName: "welcome_recruiter",
      params: [recruiterName],
    });
  }

  return templateRes;
};

/**
 * 2. Job Posted
 * Trigger: Job successfully published
 *
 * ✅ Hi {{recruiterName}},
 * Your job has been posted successfully on GreatHire!
 * 💼 Job Title: {{jobTitle}}
 * 🏢 Company: {{companyName}}
 * 📍 Location: {{jobLocation}}
 * 📌 Status: Published
 * Candidates can now view and apply for this opportunity.
 * Manage your job post and applications from your recruiter dashboard.
 * — Team GreatHire
 */
export const sendWhatsAppJobPosted = async ({ phone, recruiterName, jobTitle, companyName, jobLocation }) => {
  const name = recruiterName || "Recruiter";
  const title = jobTitle || "Job";
  const company = companyName || "GreatHire";
  const location = jobLocation || "Remote / On-site";

  // Try the new rich template first (exact user template with all 4 fields)
  let templateRes = await sendWhatsAppTemplate({
    phone,
    templateName: "recruiter_job_posted_v2",
    params: [name, title, company, location],
  });

  // Fallback to previous template if v2 is still pending Meta review
  if (!templateRes.success) {
    templateRes = await sendWhatsAppTemplate({
      phone,
      templateName: "job_posted_recruiter",
      params: [name, title],
    });
  }

  return templateRes;
};

/**
 * 3. New Applicant
 * Trigger: Candidate applies to recruiter's job
 *
 * 📩 Hi {{recruiterName}},
 * You have received a new job application on GreatHire!
 * 👤 Candidate: {{candidateName}}
 * 💼 Job Title: {{jobTitle}}
 * 📅 Applied On: {{applicationDate}}
 * Review the candidate's profile and application from your recruiter dashboard.
 * Log in to GreatHire to take the next step in your hiring process.
 * — Team GreatHire
 */
export const sendWhatsAppNewApplicant = async ({ phone, recruiterName, candidateName, jobTitle, applicationDate }) => {
  const name = recruiterName || "Recruiter";
  const candidate = candidateName || "A candidate";
  const title = jobTitle || "your job";
  const appliedDate =
    applicationDate ||
    new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  // Try the new rich template first (exact user template with candidate & appliedDate)
  let templateRes = await sendWhatsAppTemplate({
    phone,
    templateName: "recruiter_new_applicant_v2",
    params: [name, candidate, title, appliedDate],
  });

  // Fallback to previous template if v2 is still pending Meta review
  if (!templateRes.success) {
    templateRes = await sendWhatsAppTemplate({
      phone,
      templateName: "new_applicant_recruiter",
      params: [name, candidate, title],
    });
  }

  return templateRes;
};

// ==========================================
// 2. JOBSEEKER NOTIFICATIONS (Preserved)
// ==========================================

export const sendWhatsAppWelcome = (user) =>
  sendWhatsAppTemplate({
    phone: user?.phoneNumber?.number || user?.phoneNumber,
    templateName: "welcome_jobseeker",
    params: [user?.fullname || "Jobseeker"],
  });

export const sendWhatsAppApplicationSent = ({ phone, name, jobTitle, companyName }) =>
  sendWhatsAppTemplate({
    phone,
    templateName: "application_sent_jobseeker",
    params: [name || "there", jobTitle || "the job", companyName || "the company"],
  });

const STATUS_TEXT = {
  Pending: "Under review",
  "Interview Schedule": "Interview scheduled",
  Shortlisted: "Shortlisted",
  Rejected: "Not selected",
};

export const sendWhatsAppStatusUpdate = ({ phone, name, jobTitle, status }) =>
  sendWhatsAppTemplate({
    phone,
    templateName: "application_status_update",
    params: [name || "there", jobTitle || "the job", STATUS_TEXT[status] || status],
  });

// Unified application notification handler (Jobseeker + Recruiter)
export const notifyApplicationWhatsApp = async ({ applicant, job, applicationDate }) => {
  try {
    const jobTitle = job?.jobDetails?.title || "";
    const companyName = job?.jobDetails?.companyName || "";

    // 1. Notify Jobseeker (if opted in)
    if (applicant?.whatsappOptIn) {
      sendWhatsAppApplicationSent({
        phone: applicant.phoneNumber?.number || applicant.phoneNumber,
        name: applicant.fullname,
        jobTitle,
        companyName,
      });
    }

    // 2. Notify Recruiter (if opted in)
    const recruiter = await Recruiter.findById(job?.created_by);
    if (recruiter?.whatsappOptIn) {
      const formattedDate = applicationDate
        ? new Date(applicationDate).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });

      sendWhatsAppNewApplicant({
        phone: recruiter.phoneNumber?.number || recruiter.phoneNumber,
        recruiterName: recruiter.fullname,
        candidateName: applicant?.fullname || "A candidate",
        jobTitle,
        applicationDate: formattedDate,
      });
    }
  } catch (err) {
    console.error("WhatsApp application notify failed:", err.message);
  }
};