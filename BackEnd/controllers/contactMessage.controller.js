import nodemailer from "nodemailer";

// Create transporter based on email provider
const createTransporter = () => {
  const provider = process.env.EMAIL_PROVIDER || "gmail";

  switch (provider) {
    case "gmail":
      return nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

    case "outlook":
      return nodemailer.createTransport({
        host: "smtp.office365.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

    case "smtp":
      return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

    default:
      throw new Error("Invalid EMAIL_PROVIDER specified");
  }
};

const transporter = createTransporter();

// Send contact form message via email
export const sendContactMessage = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, message } = req.body;

    // Validate required fields
    if (!fullname || !email || !phoneNumber || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate message length
    if (message.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Message cannot exceed 500 characters",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
      });
    }

    // Validate phone number format (basic check)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number format",
      });
    }

    // Email content for HR team
    const mailOptionsToHR = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: [ "sanketbabde@greathire.in", "tanmai.dev077@greathire.in" ],
      replyTo: email,
      subject: `New Contact Form Submission from ${fullname}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; color: white; border-radius: 12px 12px 0 0; text-align: center;">
            <h2 style="margin: 0; font-size: 28px;">New Contact Form Submission</h2>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">From GreatHire Website</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; color: #333; width: 120px;">Name:</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; color: #666;">${escapeHtml(fullname)}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">Email:</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">
                  <a href="mailto:${escapeHtml(email)}" style="color: #667eea; text-decoration: none;">${escapeHtml(email)}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">Phone:</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">
                  <a href="tel:${phoneNumber}" style="color: #667eea; text-decoration: none;">${escapeHtml(phoneNumber)}</a>
                </td>
              </tr>
            </table>
            
            <div style="margin-top: 30px;">
              <h3 style="color: #333; margin-top: 0; margin-bottom: 15px; font-size: 18px;">Message:</h3>
              <div style="background: white; padding: 20px; border-left: 5px solid #667eea; color: #555; line-height: 1.6; word-wrap: break-word; white-space: pre-wrap;">
                ${escapeHtml(message)}
              </div>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #999;">
              <p style="margin: 5px 0;">
                <strong>Submitted:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} (IST)
              </p>
              <p style="margin: 5px 0;">
                <strong>IP Address:</strong> ${getClientIp() || 'N/A'}
              </p>
            </div>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; border-radius: 0 0 12px 12px; font-size: 12px; text-align: center;">
            <p style="margin: 0;">GreatHire © ${new Date().getFullYear()}. All rights reserved.</p>
            <p style="margin: 5px 0 0 0; opacity: 0.8;">This is an automated email. Please do not reply to this address.</p>
          </div>
        </div>
      `,
    };

    // Email content for user confirmation
    const mailOptionsToUser = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: "We've Received Your Message - GreatHire",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; color: white; border-radius: 12px 12px 0 0; text-align: center;">
            <h2 style="margin: 0; font-size: 28px;">Thank You for Contacting GreatHire!</h2>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none;">
            <p style="color: #333; font-size: 16px;">Hi <strong>${escapeHtml(fullname)}</strong>,</p>
            
            <p style="color: #666; line-height: 1.8; font-size: 14px;">
              Thank you for reaching out to us. We have received your message and our team will review it shortly.
            </p>
            
            <div style="background: #e8f4f8; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #333; font-weight: bold;">⏱️ Response Time</p>
              <p style="margin: 10px 0 0 0; color: #666;">
                We typically respond to all inquiries within <strong>24 hours</strong> during business days (Monday - Friday, 9:00 AM - 6:00 PM IST).
              </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 25px 0;">
            
            <h3 style="color: #333; margin-top: 0; font-size: 16px;">📞 Contact Information:</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; color: #666;">📍 <strong>Office:</strong></td>
                <td style="padding: 8px 0; color: #666;">Hyderabad, Telangana, India</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">📞 <strong>Phone:</strong></td>
                <td style="padding: 8px 0;">
                  <a href="tel:+918328192093" style="color: #667eea; text-decoration: none;">+91-8328192093</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">⏰ <strong>Hours:</strong></td>
                <td style="padding: 8px 0; color: #666;">Mon–Fri: 9:00 AM – 6:00 PM | Sat: 10:00 AM – 4:00 PM</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">📧 <strong>Email:</strong></td>
                <td style="padding: 8px 0;">
                  <a href="mailto:hr@babde.tech" style="color: #667eea; text-decoration: none;">hr@babde.tech</a>
                </td>
              </tr>
            </table>

            <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                If you need immediate assistance, feel free to call us directly during business hours.
              </p>
            </div>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; border-radius: 0 0 12px 12px; font-size: 12px; text-align: center;">
            <p style="margin: 0;">GreatHire © ${new Date().getFullYear()}. All rights reserved.</p>
            <p style="margin: 5px 0 0 0; opacity: 0.8;">This is an automated email. Please do not reply to this address.</p>
          </div>
        </div>
      `,
    };

    // Send emails
    const results = await Promise.all([
      transporter.sendMail(mailOptionsToHR),
      transporter.sendMail(mailOptionsToUser),
    ]);

    console.log("✅ Emails sent successfully");
    console.log("   HR Email:", results[0].messageId);
    console.log("   User Confirmation:", results[1].messageId);

    return res.status(200).json({
      success: true,
      message: "Message sent successfully! We'll respond within 24 hours.",
      messageId: results[0].messageId,
    });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Helper function to escape HTML special characters
function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Helper function to get client IP
function getClientIp() {
  // This would need to be passed from middleware
  return null;
}