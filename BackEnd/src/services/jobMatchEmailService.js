// const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

// export const sendNewJobMatchEmail = async ({
//   email,
//   fullname,
//   jobId,
//   jobTitle,
//   companyName,
//   matchPercentage,
// }) => {
//   try {
//     // IMPORTANT:
//     // Replace this route if your actual frontend job-details route is different.
//     // const jobUrl = `https://greathire.in/jobs/${jobId}`;
//     const frontendUrl =
//   process.env.NODE_ENV === "production"
//     ? "https://greathire.in"
//     : "http://localhost:5173";

// const jobUrl = `${frontendUrl}/jobs/${jobId}`;

//     console.log("========== BREVO EMAIL DEBUG ==========");
// console.log("Candidate Email:", email);
// console.log("Candidate Name:", fullname);
// console.log("Job Title:", jobTitle);
// console.log("Match Percentage:", matchPercentage);
// console.log("BREVO KEY EXISTS:", !!process.env.BREVO_API_KEY);
// console.log("BREVO SENDER:", process.env.BREVO_SENDER_EMAIL);
// console.log("======================================");

//     const response = await fetch("https://api.brevo.com/v3/smtp/email", {
//   method: "POST",

//   headers: {
//     "Content-Type": "application/json",
//     "api-key": process.env.BREVO_API_KEY,
//   },

  

//   body: JSON.stringify({
//     sender: {
//       email: process.env.BREVO_SENDER_EMAIL,
//       name: process.env.BREVO_SENDER_NAME,
//     },

//     to: [
//       {
//         email,
//         name: fullname || "Job Seeker",
//       },
//     ],

//     subject: `New Job Matching Your Profile - ${jobTitle}`,

//     htmlContent: `
//   <div style="
//     font-family: Arial, sans-serif;
//     line-height: 1.6;
//     max-width: 600px;
//     margin: auto;
//     padding: 20px;
//     background-color: #f5f5f5;
//   ">

//     <div style="
//       background-color: white;
//       padding: 30px;
//       border-radius: 10px;
//     ">

//       <h2 style="color:#1D4ED8;">
//         New Job Matching Your Profile 🎯
//       </h2>

//       <p>
//         Hello <strong>${fullname || "Job Seeker"}</strong>,
//       </p>

//       <p>
//         A new job has been posted that matches your
//         profile based on your skills and experience.
//       </p>

//       <div style="
//         background:#f0f7ff;
//         padding:15px;
//         border-radius:6px;
//         margin:20px 0;
//       ">

//         <p>
//           <strong>Job:</strong> ${jobTitle}
//         </p>

//         <p>
//           <strong>Company:</strong> ${companyName || "GreatHire"}
//         </p>

//         <p>
//           <strong>Match:</strong> ${matchPercentage}%
//         </p>

//       </div>

//       <div style="
//         text-align:center;
//         margin:30px 0;
//       ">

//         <a
//           href="${jobUrl}"
//           target="_blank"
//           style="
//             display:inline-block;
//             background-color:#1D4ED8;
//             color:white;
//             padding:13px 30px;
//             text-decoration:none;
//             border-radius:6px;
//             font-weight:bold;
//           "
//         >
//           APPLY NOW
//         </a>

//       </div>

//       <p>
//         Click the button above to view the job and apply
//         directly on GreatHire.
//       </p>

//       <p>
//         Best regards,<br/>
//         <strong>GreatHire Team</strong>
//       </p>

//     </div>
//   </div>
// `,
//   }),
// });

// console.log("========== BREVO RESPONSE ==========");
// console.log("HTTP STATUS:", response.status);
// console.log("HTTP STATUS TEXT:", response.statusText);

// const responseText = await response.text();

// console.log("BREVO RESPONSE BODY:", responseText);
// console.log("====================================");

//     if (!response.ok) {
//       const errorData = await response.text();

//       throw new Error(
//         `Brevo API error ${response.status}: ${errorData}`
//       );
//     }

//     console.log("✅ EMAIL ACCEPTED BY BREVO");
// console.log("📧 EMAIL SENT TO:", email);

//     console.log(
//       `✅ Job match email sent to ${email} (${matchPercentage}% match)`
//     );

//     return true;

//   } catch (error) {
//     console.error(
//       `❌ Failed to send job match email to ${email}:`,
//       error.message
//     );

//     return false;
//   }
// };

// import { GoogleGenAI } from "@google/genai";
// import nodemailer from "nodemailer";

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// export const sendNewJobMatchEmail = async ({
//   email,
//   fullname,
//   name,
//   jobId,
//   jobTitle,
//   companyName,
//   matchPercentage,
// }) => {
//   try {
//     const candidateName =
//       fullname || name || "Job Seeker";

//     const frontendUrl =
//       process.env.NODE_ENV === "production"
//         ? "https://greathire.in"
//         : "http://localhost:5173";

//     const jobUrl =
//       `${frontendUrl}/jobs/${jobId}`;

//     console.log(
//       "========== GEMINI + GMAIL EMAIL =========="
//     );

//     console.log(
//       "Candidate Email:",
//       email
//     );

//     console.log(
//       "Candidate Name:",
//       candidateName
//     );

//     console.log(
//       "Job Title:",
//       jobTitle
//     );

//     console.log(
//       "Match Percentage:",
//       matchPercentage
//     );

//     console.log(
//       "GEMINI API KEY EXISTS:",
//       !!process.env.GEMINI_API_KEY
//     );

//     console.log(
//       "GMAIL USER:",
//       process.env.EMAIL_USER
//     );

//     console.log(
//       "=========================================="
//     );

//     // ========================================================
//     // 1. GEMINI GENERATES EMAIL CONTENT
//     // ========================================================

// const prompt = `
// Write the body of a professional job matching notification email.

// Use exactly this structure:

// Hello ${candidateName},

// A new job has been posted that matches your profile based on your skills and experience.

// Job: ${jobTitle}

// Company: ${companyName || "GreatHire"}

// Match: ${matchPercentage}%

// Click the button below to view the job and apply directly on GreatHire.

// Best regards,
// GreatHire Team

// Rules:
// - Use the candidate name: ${candidateName}
// - Do not write "Job Seeker" if a candidate name is provided.
// - Do not include a subject line.
// - Do not include the APPLY NOW button.
// - Do not include the Job URL.
// - Do not use markdown.
// - Do not use emojis.
// - Return only the email body.
// `;

//     const response = await ai.models.generateContent({
//       model: "gemini-3.8-flash",
//       contents: prompt,
//     });

//     const emailBody =
//       response.text?.trim();

//     if (!emailBody) {
//       throw new Error(
//         "Gemini returned empty email content"
//       );
//     }

//     console.log(
//       "✅ GEMINI EMAIL CONTENT GENERATED"
//     );

//     // ========================================================
//     // 2. SEND EMAIL USING GMAIL + NODEMAILER
//     // ========================================================

//     await transporter.sendMail({
//   from: `"GreatHire" <${process.env.EMAIL_USER}>`,

//   to: email,

//   subject: `New Job Matching Your Profile`,

//   text: `
// Hello ${candidateName},

// A new job has been posted that matches your profile based on your skills and experience.

// Job: ${jobTitle}

// Company: ${companyName || "GreatHire"}

// Match: ${matchPercentage}%

// Click the button below to view the job and apply directly on GreatHire.

// Best regards,
// GreatHire Team
//   `,

//   html: `
//     <div
//       style="
//         font-family: Arial, sans-serif;
//         line-height: 1.6;
//         color: #333;
//         max-width: 600px;
//         margin: auto;
//       "
//     >
//       <h2>New Job Matching Your Profile 🎯</h2>

//       <p>
//         Hello <strong>${candidateName}</strong>,
//       </p>

//       <p>
//         A new job has been posted that matches your profile
//         based on your skills and experience.
//       </p>

//       <p>
//         <strong>Job:</strong> ${jobTitle}
//       </p>

//       <p>
//         <strong>Company:</strong> ${companyName || "GreatHire"}
//       </p>

//       <p>
//         <strong>Match:</strong> ${matchPercentage}%
//       </p>

//       <p>
//         Click the button below to view the job and apply directly
//         on GreatHire.
//       </p>

//       <p style="margin: 25px 0;">
//         <a
//           href="${jobUrl}"
//           style="
//             display: inline-block;
//             padding: 12px 24px;
//             background-color: #2563eb;
//             color: white;
//             text-decoration: none;
//             border-radius: 6px;
//             font-weight: bold;
//           "
//         >
//           APPLY NOW
//         </a>
//       </p>

//       <p>
//         Best regards,<br />
//         <strong>GreatHire Team</strong>
//       </p>
//     </div>
//   `,
// });

//     console.log(
//       "✅ EMAIL SENT SUCCESSFULLY"
//     );

//     console.log(
//       `📧 EMAIL SENT TO: ${email}`
//     );

//     console.log(
//       `✅ Job match email sent to ${email} (${matchPercentage}% match)`
//     );

//     return true;

//   } catch (error) {
//     console.error(
//       `❌ Failed to send job match email to ${email}:`,
//       error.message
//     );

//     throw error;
//   }
// };

import { GoogleGenAI } from "@google/genai";
import nodemailer from "nodemailer";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ========================================================
// GEMINI EMAIL GENERATION WITH RETRY
// ========================================================

const generateEmailWithGemini = async (prompt) => {
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(
        `🤖 Gemini attempt ${attempt}/${maxRetries}`
      );

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      const emailBody = response.text?.trim();

      if (!emailBody) {
        throw new Error(
          "Gemini returned empty email content"
        );
      }

      console.log(
        "✅ GEMINI EMAIL CONTENT GENERATED"
      );

      return emailBody;

    } catch (error) {
      console.error(
        `❌ Gemini attempt ${attempt} failed:`,
        error.message
      );

      // Retry only for temporary/server errors
      const errorMessage = error.message || "";

      const isRetryable =
        errorMessage.includes("503") ||
        errorMessage.includes("UNAVAILABLE") ||
        errorMessage.includes("500") ||
        errorMessage.includes("INTERNAL");

      if (!isRetryable) {
        throw error;
      }

      if (attempt < maxRetries) {
        const delay =
          attempt === 1
            ? 5000
            : attempt === 2
            ? 10000
            : 20000;

        console.log(
          `⏳ Retrying Gemini in ${delay / 1000} seconds...`
        );

        await new Promise((resolve) =>
          setTimeout(resolve, delay)
        );
      }
    }
  }

  throw new Error(
    "Gemini failed after all retry attempts"
  );
};

// ========================================================
// SEND NEW JOB MATCH EMAIL
// ========================================================

export const sendNewJobMatchEmail = async ({
  email,
  fullname,
  name,
  jobId,
  jobTitle,
  companyName,
  matchPercentage,
}) => {
  try {
    const candidateName =
      fullname || name || "Job Seeker";

    const frontendUrl =
      process.env.NODE_ENV === "production"
        ? "https://greathire.in"
        : "http://localhost:5173";

    const jobUrl =
      `${frontendUrl}/jobs/${jobId}`;

    console.log(
      "========== GEMINI + GMAIL EMAIL =========="
    );

    console.log(
      "Candidate Email:",
      email
    );

    console.log(
      "Candidate Name:",
      candidateName
    );

    console.log(
      "Job Title:",
      jobTitle
    );

    console.log(
      "Match Percentage:",
      matchPercentage
    );

    console.log(
      "GEMINI API KEY EXISTS:",
      !!process.env.GEMINI_API_KEY
    );

    console.log(
      "GMAIL USER:",
      process.env.EMAIL_USER
    );

    console.log(
      "=========================================="
    );

    // ========================================================
    // 1. GEMINI GENERATES EMAIL CONTENT
    // ========================================================

    const prompt = `
Write the body of a professional job matching notification email.

Use exactly this structure:

Hello ${candidateName},

A new job has been posted that matches your profile based on your skills and experience.

Job: ${jobTitle}

Company: ${companyName || "GreatHire"}

Match: ${matchPercentage}%

Click the button below to view the job and apply directly on GreatHire.

Best regards,
GreatHire Team

Rules:
- Use the candidate name: ${candidateName}
- Do not write "Job Seeker" if a candidate name is provided.
- Do not include a subject line.
- Do not include the APPLY NOW button.
- Do not include the Job URL.
- Do not use markdown.
- Do not use emojis.
- Return only the email body.
`;

    let emailBody;

    try {
      emailBody =
        await generateEmailWithGemini(prompt);

    } catch (geminiError) {
      // ======================================================
      // GEMINI FAILED -> FALLBACK EMAIL
      // ======================================================

      console.warn(
        "⚠️ Gemini unavailable. Using fallback email body."
      );

      emailBody = `
Hello ${candidateName},

A new job has been posted that matches your profile based on your skills and experience.

Job: ${jobTitle}

Company: ${companyName || "GreatHire"}

Match: ${matchPercentage}%

Click the button below to view the job and apply directly on GreatHire.

Best regards,
GreatHire Team
      `.trim();

      console.log(
        "✅ FALLBACK EMAIL BODY CREATED"
      );
    }

    // ========================================================
    // 2. SEND EMAIL USING GMAIL + NODEMAILER
    // ========================================================

    await transporter.sendMail({
      from: `"GreatHire" <${process.env.EMAIL_USER}>`,

      to: email,

      subject: `New Job Matching Your Profile`,

      // Gemini/fallback generated text is actually used here
      text: emailBody,

      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: auto;
          "
        >

          <h2>
            New Job Matching Your Profile 🎯
          </h2>

          <p>
            Hello <strong>${candidateName}</strong>,
          </p>

          <p>
            A new job has been posted that matches your profile
            based on your skills and experience.
          </p>

          <p>
            <strong>Job:</strong> ${jobTitle}
          </p>

          <p>
            <strong>Company:</strong>
            ${companyName || "GreatHire"}
          </p>

          <p>
            <strong>Match:</strong> ${matchPercentage}%
          </p>

          <p>
            Click the button below to view the job and apply directly
            on GreatHire.
          </p>

          <p style="margin: 25px 0;">
            <a
              href="${jobUrl}"
              style="
                display: inline-block;
                padding: 12px 24px;
                background-color: #2563eb;
                color: white;
                text-decoration: none;
                border-radius: 6px;
                font-weight: bold;
              "
            >
              APPLY NOW
            </a>
          </p>

          <p>
            Best regards,<br />
            <strong>GreatHire Team</strong>
          </p>

        </div>
      `,
    });

    console.log(
      "✅ EMAIL SENT SUCCESSFULLY"
    );

    console.log(
      `📧 EMAIL SENT TO: ${email}`
    );

    console.log(
      `✅ Job match email sent to ${email} (${matchPercentage}% match)`
    );

    return true;

  } catch (error) {
    console.error(
      `❌ Failed to send job match email to ${email}:`,
      error.message
    );

    throw error;
  }
};