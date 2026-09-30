import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,                 // true only for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send "you have a new message" email — NOTIFICATION ONLY.
 * The email does NOT contain the message content.
 * Replies are discarded (no-reply address).
 */
export const sendOfflineMessageNotification = async ({
  to,
  recipientName,
  senderName,
  conversationId,
}) => {
  try {
    if (!to || !to.includes("@")) {
      console.log(`⚠️ [Email] Invalid recipient email: "${to}" — skipping`);
      return;
    }

    const url = `${process.env.FRONTEND_URL}/messages`;

    const info = await transporter.sendMail({
      from: `"GreatHire" <${process.env.SMTP_USER}>`,
      to,
      replyTo: "no-reply@greathire.com",   // discourage replies
      subject: `New message from ${senderName} on GreatHire`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">Hi ${recipientName},</h2>
          <p>You have a <strong>new message</strong> from <strong>${senderName}</strong> on GreatHire.</p>
          <p>For security and privacy reasons, we don't include the message content in emails.</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${url}"
               style="display:inline-block; padding:14px 28px; background:#2563eb; color:#ffffff;
                      text-decoration:none; border-radius:6px; font-weight:600; font-size:15px;">
              Log In to Read Message
            </a>
          </div>

          <p style="color: #6b7280; font-size: 13px;">
            ⚠️ <strong>Please do not reply to this email.</strong><br>
            To respond, log in to GreatHire and reply from the chat portal.
          </p>

          <hr style="border:none; border-top:1px solid #e5e7eb; margin: 24px 0;">

          <p style="color:#9ca3af; font-size:11px;">
            This is an automated notification. Replies to this address are not monitored.<br>
            You received this because someone sent you a message while you were offline.
          </p>
        </div>
      `,
    });

    
  } catch (error) {
    console.error(`❌ [Email] Failed for ${to}:`, error.message);
  }
};