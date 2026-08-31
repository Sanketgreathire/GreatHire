const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

export const sendNewJobMatchEmail = async ({
  email,
  fullname,
  jobId,
  jobTitle,
  companyName,
  matchPercentage,
}) => {
  try {
    // IMPORTANT:
    // Replace this route if your actual frontend job-details route is different.
    const jobUrl = `https://greathire.in/jobs/${jobId}`;

    console.log("========== BREVO EMAIL DEBUG ==========");
console.log("Candidate Email:", email);
console.log("Candidate Name:", fullname);
console.log("Job Title:", jobTitle);
console.log("Match Percentage:", matchPercentage);
console.log("BREVO KEY EXISTS:", !!process.env.BREVO_API_KEY);
console.log("BREVO SENDER:", process.env.BREVO_SENDER_EMAIL);
console.log("======================================");

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
  method: "POST",

  headers: {
    "Content-Type": "application/json",
    "api-key": process.env.BREVO_API_KEY,
  },

  body: JSON.stringify({
    sender: {
      email: process.env.BREVO_SENDER_EMAIL,
      name: process.env.BREVO_SENDER_NAME,
    },

    to: [
      {
        email,
        name: fullname || "Job Seeker",
      },
    ],

    subject: `New Job Matching Your Profile - ${jobTitle}`,

    htmlContent: `
  <div style="
    font-family: Arial, sans-serif;
    line-height: 1.6;
    max-width: 600px;
    margin: auto;
    padding: 20px;
    background-color: #f5f5f5;
  ">

    <div style="
      background-color: white;
      padding: 30px;
      border-radius: 10px;
    ">

      <h2 style="color:#1D4ED8;">
        New Job Matching Your Profile 🎯
      </h2>

      <p>
        Hello <strong>${fullname || "Job Seeker"}</strong>,
      </p>

      <p>
        A new job has been posted that matches your
        profile based on your skills and experience.
      </p>

      <div style="
        background:#f0f7ff;
        padding:15px;
        border-radius:6px;
        margin:20px 0;
      ">

        <p>
          <strong>Job:</strong> ${jobTitle}
        </p>

        <p>
          <strong>Company:</strong> ${companyName || "GreatHire"}
        </p>

        <p>
          <strong>Match:</strong> ${matchPercentage}%
        </p>

      </div>

      <div style="
        text-align:center;
        margin:30px 0;
      ">

        <a
          href="${jobUrl}"
          target="_blank"
          style="
            display:inline-block;
            background-color:#1D4ED8;
            color:white;
            padding:13px 30px;
            text-decoration:none;
            border-radius:6px;
            font-weight:bold;
          "
        >
          APPLY NOW
        </a>

      </div>

      <p>
        Click the button above to view the job and apply
        directly on GreatHire.
      </p>

      <p>
        Best regards,<br/>
        <strong>GreatHire Team</strong>
      </p>

    </div>
  </div>
`,
  }),
});

    if (!response.ok) {
      const errorData = await response.text();

      throw new Error(
        `Brevo API error ${response.status}: ${errorData}`
      );
    }

    console.log("✅ EMAIL ACCEPTED BY BREVO");
console.log("📧 EMAIL SENT TO:", email);

    console.log(
      `✅ Job match email sent to ${email} (${matchPercentage}% match)`
    );

    return true;

  } catch (error) {
    console.error(
      `❌ Failed to send job match email to ${email}:`,
      error.message
    );

    return false;
  }
};