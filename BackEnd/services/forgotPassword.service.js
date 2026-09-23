import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

/**
 * Safely decodes secrets that may be Base64-encoded or prefixed with base64:
 */
const decodeSecret = (val) => {
  if (!val) return "";
  const trimmed = val.replace(/^["']|["']$/g, "").trim();
  if (trimmed.startsWith("base64:")) {
    try {
      return Buffer.from(trimmed.slice(7), "base64").toString("utf8");
    } catch (_) {
      return trimmed;
    }
  }
  if (/^[A-Za-z0-9+/]+={1,2}$/.test(trimmed)) {
    try {
      const decoded = Buffer.from(trimmed, "base64").toString("utf8");
      if (/^[\x20-\x7E]+$/.test(decoded)) {
        return decoded;
      }
    } catch (_) {}
  }
  return trimmed;
};

/**
 * Resolves Forgot Password email credentials from:
 * 1. FORGOT_PASSWORD_BASE64 (Base64 JSON containing { user, pass })
 * 2. Dedicated env variables (FORGOT_PASSWORD_EMAIL_USER & encoded/plaintext FORGOT_PASSWORD_EMAIL_PASS)
 * 3. Fallback env variables (EMAIL_USER & EMAIL_PASS)
 */
export const resolveForgotPasswordCredentials = () => {
  // 1. Check full Base64 hash object
  const base64Config = (process.env.FORGOT_PASSWORD_BASE64 || process.env.FORGOT_PASSWORD_HASH || "").replace(/^["']|["']$/g, "").trim();
  if (base64Config) {
    try {
      const decodedStr = Buffer.from(base64Config, "base64").toString("utf8");
      const parsed = JSON.parse(decodedStr);
      if (parsed.user && parsed.pass) {
        return {
          user: parsed.user.trim(),
          pass: parsed.pass.trim(),
          isDedicated: true,
        };
      }
    } catch (e) {
      console.warn("[ForgotPassword] Failed to decode FORGOT_PASSWORD_BASE64:", e.message);
    }
  }

  // 2. Check dedicated variables
  const dedicatedUser = (process.env.FORGOT_PASSWORD_EMAIL_USER || "").replace(/^["']|["']$/g, "").trim();
  const rawDedicatedPass = (process.env.FORGOT_PASSWORD_EMAIL_PASS || process.env.FORGOT_PASSWORD_EMAIL_PASS_BASE64 || "").replace(/^["']|["']$/g, "").trim();
  const dedicatedPass = decodeSecret(rawDedicatedPass);

  if (dedicatedUser && dedicatedPass) {
    return {
      user: dedicatedUser,
      pass: dedicatedPass,
      isDedicated: true,
    };
  }

  // 3. Fallback to default email credentials
  const defaultUser = (process.env.EMAIL_USER || "").replace(/^["']|["']$/g, "").trim();
  const rawDefaultPass = (process.env.EMAIL_PASS || "").replace(/^["']|["']$/g, "").trim();
  const defaultPass = decodeSecret(rawDefaultPass);

  if (defaultUser && defaultPass) {
    return {
      user: defaultUser,
      pass: defaultPass,
      isDedicated: false,
    };
  }

  return {
    user: "",
    pass: "",
    isDedicated: false,
  };
};

/**
 * Get nodemailer transporter configured specifically for the Forgot Password service.
 * Supports dedicated credentials:
 *   - FORGOT_PASSWORD_BASE64 (Base64 JSON)
 *   - FORGOT_PASSWORD_EMAIL_USER / FORGOT_PASSWORD_EMAIL_PASS (encoded or plain)
 *   - Falls back gracefully to EMAIL_USER / EMAIL_PASS
 */
export const getForgotPasswordTransporter = () => {
  const { user, pass } = resolveForgotPasswordCredentials();

  if (!user || !pass) {
    throw new Error(
      "Forgot Password email service is not configured. Please set FORGOT_PASSWORD_EMAIL_USER and FORGOT_PASSWORD_EMAIL_PASS (or FORGOT_PASSWORD_BASE64) in your environment."
    );
  }

  // Custom SMTP host and port if provided
  if (process.env.FORGOT_PASSWORD_HOST) {
    const port = Number(process.env.FORGOT_PASSWORD_PORT) || 465;
    const isSecure = process.env.FORGOT_PASSWORD_SECURE !== undefined
      ? process.env.FORGOT_PASSWORD_SECURE === "true" || process.env.FORGOT_PASSWORD_SECURE === true
      : port === 465;

    return nodemailer.createTransport({
      host: process.env.FORGOT_PASSWORD_HOST.trim(),
      port,
      secure: isSecure,
      auth: { user, pass },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
    });
  }

  // Default provider (Gmail or custom service name)
  const service = (process.env.FORGOT_PASSWORD_SERVICE || "Gmail").trim();
  return nodemailer.createTransport({
    service,
    auth: { user, pass },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });
};

/**
 * Returns safe public details about the currently active Forgot Password email configuration.
 */
export const getForgotPasswordConfig = () => {
  const creds = resolveForgotPasswordCredentials();
  const activeUser = creds.user;
  const fromName = process.env.FORGOT_PASSWORD_FROM_NAME || "GreatHire Support";
  const fromEmail = (process.env.FORGOT_PASSWORD_FROM_EMAIL || activeUser || process.env.SUPPORT_EMAIL || "").trim();
  const service = process.env.FORGOT_PASSWORD_HOST
    ? `Custom SMTP (${process.env.FORGOT_PASSWORD_HOST}:${process.env.FORGOT_PASSWORD_PORT || 465})`
    : (process.env.FORGOT_PASSWORD_SERVICE || "Gmail");

  return {
    isConfigured: Boolean(activeUser),
    usingDedicatedEmail: creds.isDedicated,
    senderEmail: activeUser ? `${activeUser.slice(0, 3)}***@${activeUser.split("@")[1] || ""}` : "Not configured",
    fromHeader: `"${fromName}" <${fromEmail}>`,
    service,
    tokenExpiry: process.env.FORGOT_PASSWORD_TOKEN_EXPIRY || "1h",
  };
};

/**
 * Verifies the connection and authentication with the email server.
 */
export const verifyForgotPasswordConfig = async () => {
  const transporter = getForgotPasswordTransporter();
  return await transporter.verify();
};

/**
 * Generates the responsive HTML email template for password reset.
 */
export const buildForgotPasswordEmailHtml = ({ userName, resetURL, expiryMinutes = 15 }) => {
  const currentYear = new Date().getFullYear();
  const greeting = userName && userName.trim()
    ? `Hello <strong>${userName.trim()}</strong>,`
    : `Hello,`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your GreatHire Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f3f4f6; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" max-width="580" cellspacing="0" cellpadding="0" border="0" style="max-width: 580px; width: 100%; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04); overflow: hidden; border: 1px solid #e5e7eb;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px; text-align: center; background: linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%);">
              <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                Great<span style="color: #60a5fa;">Hire</span>
              </h1>
              <p style="margin: 6px 0 0; font-size: 13px; color: #dbeafe; letter-spacing: 0.2px;">
                Connecting Skills with Opportunity
              </p>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding: 36px 32px 28px; color: #374151;">
              <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 700; color: #111827;">
                Reset Your Password
              </h2>
              
              <p style="margin: 0 0 14px; font-size: 15px; line-height: 1.6; color: #4b5563;">
                ${greeting}
              </p>
              
              <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #4b5563;">
                We received a request to reset the password for your GreatHire account. Click the button below to choose a new password:
              </p>

              <!-- Action Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 28px 0;">
                <tr>
                  <td align="center">
                    <a href="${resetURL}" target="_blank" style="display: inline-block; background-color: #1d4ed8; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; padding: 14px 34px; border-radius: 8px; box-shadow: 0 2px 4px rgba(29, 78, 216, 0.25);">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Notice Box -->
              <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 6px; padding: 14px 16px; margin: 24px 0 20px;">
                <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #1e40af;">
                  ⏱️ <strong>Note:</strong> This link is valid for <strong>${expiryMinutes} minutes</strong>. For your security, it can only be used once.
                </p>
              </div>

              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 28px 0 20px;">

              <p style="margin: 0; font-size: 13px; color: #9ca3af; line-height: 1.5;">
                🛡️ If you did not request a password reset, please disregard this email. Your password will remain unchanged and your account is completely safe.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px 28px; background-color: #f9fafb; border-top: 1px solid #f3f4f6; text-align: center;">
              <p style="margin: 0 0 6px; font-size: 13px; color: #6b7280;">
                Need assistance? Contact our support team at
                <a href="mailto:${process.env.SUPPORT_EMAIL || 'support@greathire.in'}" style="color: #1d4ed8; text-decoration: none; font-weight: 500;">${process.env.SUPPORT_EMAIL || 'support@greathire.in'}</a>
              </p>
              <p style="margin: 6px 0 0; font-size: 12px; color: #9ca3af;">
                © ${currentYear} GreatHire. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

/**
 * Sends a password reset email using the configured Forgot Password email service.
 *
 * @param {Object} options
 * @param {string} options.toEmail - Recipient email
 * @param {string} options.userName - Recipient full name
 * @param {string} options.resetToken - Generated JWT reset token
 * @param {string} [options.resetURL] - Explicit reset URL, or auto-generated from FRONTEND_URL
 * @returns {Promise<{ success: boolean, messageId?: string, error?: string }>}
 */
export const sendForgotPasswordEmail = async ({ toEmail, userName, resetToken, resetURL }) => {
  try {
    const transporter = getForgotPasswordTransporter();

    const frontendBase = (process.env.FRONTEND_URL || "https://greathire.in")
      .replace(/^["']|["']$/g, "")
      .trim()
      .replace(/\/+$/, "") || "https://greathire.in";
    const url = resetURL || `${frontendBase}/reset-password/${resetToken}`;

    const fromName = process.env.FORGOT_PASSWORD_FROM_NAME || "GreatHire Support";
    const activeSender = (process.env.FORGOT_PASSWORD_EMAIL_USER || process.env.EMAIL_USER || "").trim();
    const fromEmail = (process.env.FORGOT_PASSWORD_FROM_EMAIL || activeSender || process.env.SUPPORT_EMAIL || "").trim();

    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: toEmail,
      subject: "Reset Your Password - GreatHire",
      html: buildForgotPasswordEmailHtml({
        userName,
        resetURL: url,
        expiryMinutes: 60,
      }),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [ForgotPasswordService] Password reset email sent to ${toEmail}. MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ [ForgotPasswordService] Failed to send password reset email to ${toEmail}:`, error.message);
    throw error;
  }
};

export default {
  getForgotPasswordTransporter,
  getForgotPasswordConfig,
  verifyForgotPasswordConfig,
  buildForgotPasswordEmailHtml,
  sendForgotPasswordEmail,
};
