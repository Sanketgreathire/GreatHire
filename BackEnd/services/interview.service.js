import axios from "axios";
import Groq from "groq-sdk";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let groq;
const getGroq = () => {
  if (!groq) groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return groq;
};

// Fetch and extract text from resume URL (PDF or DOCX)
export const extractResumeText = async (resumeUrl) => {
  try {
    const response = await axios.get(resumeUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data);
    const contentType = response.headers["content-type"] || "";

    if (contentType.includes("pdf") || resumeUrl.toLowerCase().includes(".pdf")) {
      const data = await pdfParse(buffer);
      return data.text;
    }

    if (
      contentType.includes("wordprocessingml") ||
      resumeUrl.toLowerCase().includes(".docx") ||
      resumeUrl.toLowerCase().includes(".doc")
    ) {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }

    // Fallback: treat as plain text
    return buffer.toString("utf-8");
  } catch (err) {
    console.error("Resume text extraction failed:", err.message);
    return "";
  }
};

// Extract phone number from resume text
export const extractPhoneFromResume = (resumeText) => {
  const match = resumeText?.match(/(\+91[\s-]?)?[6-9]\d{9}/);
  return match ? match[0].replace(/[\s-]/g, "") : null;
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Generate personalized interview questions using Groq or local model
export const generateInterviewQuestions = async (job, resumeText) => {
  const prompt = `
You are an AI interviewer. Generate a concise phone interview script for the following job and candidate resume.

Job Title: ${job.jobDetails.title}
Job Description: ${job.jobDetails.details}
Required Skills: ${job.jobDetails.skills.join(", ")}
Experience Required: ${job.jobDetails.experience}

Candidate Resume:
${resumeText}

Generate 5 personalized interview questions based on:
1. Skills gap between resume and job requirements
2. Candidate's past experience relevance
3. Technical skills required for the role

Return only the questions as a numbered list. Keep it conversational for a phone call.
`;

  // If configured, use a local model (HTTP server or CLI) instead of Groq/remote API
  if (process.env.USE_LOCAL_MODEL === "1") {
    const { generateChatCompletion } = await import(path.join(__dirname, "local_llm.js"));
    const raw = await generateChatCompletion({ prompt });
    return typeof raw === "string" ? raw.trim() : JSON.stringify(raw);
  }

  const maxRetries = 3;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const completion = await getGroq().chat.completions.create({
        model: "openai/gpt-oss-120b",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
      });
      return completion.choices[0].message.content;
    } catch (err) {
      if (err?.status === 429 && attempt < maxRetries - 1) {
        const retryAfter = parseInt(err?.headers?.["retry-after"] || "10", 10);
        console.warn(`Groq rate limited. Retrying in ${retryAfter}s... (attempt ${attempt + 1}/${maxRetries})`);
        await sleep(retryAfter * 1000);
      } else {
        throw err;
      }
    }
  }
};

// Start Bland.ai call
export const startInterviewCall = async (phone, task) => {
  const response = await axios.post(
    "https://api.bland.ai/v1/calls",
    {
      phone_number: phone,
      task,
      voice: "maya",
      max_duration: 10,
      record: true,
    },
    { headers: { Authorization: `Bearer ${process.env.BLAND_API_KEY}` } }
  );
  return response.data;
};
