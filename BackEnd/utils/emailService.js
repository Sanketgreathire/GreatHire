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

export const sendCompanyProfileReminderEmail = async (recruiterEmail, recruiterName) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recruiterEmail,
    subject: "Complete Your Company Profile - GreatHire",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #1D4ED8; margin-bottom: 20px; text-align: center;">Great<span style="color: #333;">Hire</span></h2>
          
          <p style="color: #555; line-height: 1.6;">Dear ${recruiterName},</p>
          
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

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Company profile reminder email sent to ${recruiterEmail}`);
    return true;
  } catch (error) {
    console.error(`❌ Error sending reminder email to ${recruiterEmail}:`, error.message);
    return false;
  }
};

export const sendFirstJobReminderEmail = async (recruiterEmail, recruiterName, companyName) => {
  const dashboardLink = "https://greathire.in/recruiter/dashboard/post-job";
  const mailOptions = {
    from: `"GreatHire" <${process.env.EMAIL_USER}>`,
    to: recruiterEmail,
    subject: "Get Started with Your First Job Posting 🚀",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #1D4ED8; text-align: center;">Great<span style="color: #333;">Hire</span></h2>

          <p style="color: #555; line-height: 1.6;">Hi <strong>${recruiterName}</strong>,</p>

          <p style="color: #555; line-height: 1.6;">
            We noticed that your account with <strong>${companyName}</strong> is active, and you're all set to start hiring—great to have you onboard!
          </p>

          <p style="color: #555; line-height: 1.6;">
            If you haven't had a chance yet, posting your first job is the best way to connect with top talent and begin building your hiring pipeline.
          </p>

          <div style="background-color: #f0f7ff; padding: 15px; border-left: 4px solid #1D4ED8; margin: 20px 0; border-radius: 5px;">
            <p style="color: #333; font-weight: bold; margin: 0 0 8px 0;">Here's what you can do next:</p>
            <ul style="color: #555; margin: 0; padding-left: 20px; line-height: 1.8;">
              <li>Create and publish your first job listing</li>
              <li>Reach qualified candidates faster</li>
              <li>Manage applications easily from your dashboard</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${dashboardLink}" target="_blank"
               style="background-color: #1D4ED8; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              👉 Post Your First Job Now
            </a>
          </div>

          <p style="color: #555; line-height: 1.6;">
            If you need any help getting started, feel free to reach out—we're happy to assist.
          </p>

          <p style="color: #555; line-height: 1.6; margin-top: 30px;">
            Best regards,<br/>
            <strong>Team GreatHire</strong>
          </p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">This is an automated message from GreatHire. Please do not reply to this email.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ First job reminder email sent to ${recruiterEmail}`);
    return true;
  } catch (error) {
    console.error(`❌ Error sending first job reminder to ${recruiterEmail}:`, error.message);
    return false;
  }
};

