import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendRejectionEmail = async (applicantEmail, applicantName, jobTitle, companyName) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: applicantEmail,
    subject: `Application Update - ${jobTitle} at ${companyName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Application Status Update</h2>
          
          <p style="color: #555; line-height: 1.6;">Dear ${applicantName},</p>
          
          <p style="color: #555; line-height: 1.6;">
            Thank you for your interest in the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.
          </p>
          
          <p style="color: #555; line-height: 1.6;">
            After careful consideration, we regret to inform you that we have decided to move forward with other candidates 
            whose qualifications more closely match our current needs.
          </p>
          
          <p style="color: #555; line-height: 1.6;">
            We appreciate the time and effort you invested in your application. Your profile has been added to our talent 
            pool, and we will keep you in mind for future opportunities that match your skills and experience.
          </p>
          
          <div style="background-color: #f0f7ff; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0;">
            <p style="color: #333; margin: 0; font-style: italic;">
              "Every rejection is a redirection to something better." 🌟
            </p>
          </div>
          
          <p style="color: #555; line-height: 1.6;">
            We encourage you to continue exploring other opportunities on GreatHire and wish you the very best in your job search.
          </p>
          
          <p style="color: #555; line-height: 1.6; margin-top: 30px;">
            Best regards,<br>
            <strong>The GreatHire Team</strong>
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            This is an automated message from GreatHire. Please do not reply to this email.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Rejection email sent to ${applicantEmail}`);
    return true;
  } catch (error) {
    console.error(`❌ Error sending rejection email to ${applicantEmail}:`, error.message);
    return false;
  }
};

export default { sendRejectionEmail };
