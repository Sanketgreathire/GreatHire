import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendFirstJobReminder = async (req, res) => {
  try {
    const { emails } = req.body;
    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ success: false, message: "No recipients provided." });
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #1D4ED8; text-align: center;">Great<span style="color: #333;">Hire</span></h2>
          <p style="color: #555; font-size: 15px; line-height: 1.8;">Dear Recruiter,</p>
          <p style="color: #555; font-size: 15px; line-height: 1.8;">We noticed you haven't posted your first job yet on <strong>GreatHire</strong>.</p>
          <p style="color: #555; font-size: 15px; line-height: 1.8;">Posting a job is quick and easy — reach thousands of qualified candidates today!</p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="https://greathire.in/recruiter/postjob" style="background-color: #1D4ED8; color: #ffffff; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-size: 15px; font-weight: bold;">Post Your First Job Now</a>
          </div>
          <p style="color: #555; font-size: 15px; line-height: 1.8;">If you have any questions, feel free to reach out to our support team.</p>
          <p style="color: #555; font-size: 15px;">Best regards,<br/>The GreatHire Team</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">This message was sent via GreatHire. Please do not reply to this email.</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"GreatHire Team" <${process.env.EMAIL_USER}>`,
      to: emails.join(", "),
      subject: "Reminder: Post Your First Job on GreatHire",
      html,
    });

    return res.status(200).json({ success: true, message: `First job reminder sent to ${emails.length} recipient(s).` });
  } catch (err) {
    console.error("Error sending first job reminder:", err);
    return res.status(500).json({ success: false, message: "Failed to send reminder.", error: err.message });
  }
};

export const sendBulkEmail = async (req, res) => {
  try {
    const { emails, subject, message } = req.body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ success: false, message: "No recipients provided." });
    }
    if (!subject || !message) {
      return res.status(400).json({ success: false, message: "Subject and message are required." });
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #1D4ED8; text-align: center;">Great<span style="color: #333;">Hire</span></h2>
          <div style="color: #555; line-height: 1.8; font-size: 15px; white-space: pre-line;">${message}</div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">This message was sent via GreatHire. Please do not reply to this email.</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"GreatHire Team" <${process.env.EMAIL_USER}>`,
      to: emails.join(", "),
      subject,
      html,
    });

    return res.status(200).json({ success: true, message: `Email sent to ${emails.length} recipient(s).` });
  } catch (err) {
    console.error("Error sending bulk email:", err);
    return res.status(500).json({ success: false, message: "Failed to send email.", error: err.message });
  }
};
