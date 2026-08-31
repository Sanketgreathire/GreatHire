import Groq from "groq-sdk";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let groq;
const getGroq = () => {
  if (!groq) groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return groq;
};

export const calculateMatchScore = async (resumeText, jobTitle, jobDescription, skills) => {
  const prompt = `
Analyze candidate resume against this job.

Job Title:
${jobTitle}

Job Description:
${jobDescription}

Required Skills:
${skills.join(", ")}

Resume:
${resumeText}

Return JSON:

{
 "matchScore": 0-100,
 "skillsMatched": [],
 "missingSkills": []
}
`;

  // If configured to use a local model, call it and robustly extract JSON
  if (process.env.USE_LOCAL_MODEL === "1") {
    const { generateChatCompletion, _findJsonSubstring } = await import(path.join(__dirname, "local_llm.js"));
    const raw = await generateChatCompletion({ prompt });
    // try to parse directly first
    try {
      return JSON.parse(raw);
    } catch (e) {
      // attempt to extract JSON block from noisy output
      const parsed = _findJsonSubstring(raw);
      if (parsed) return parsed;
      return { matchScore: 50, skillsMatched: [], missingSkills: [] };
    }
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const maxRetries = 3;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const completion = await getGroq().chat.completions.create({
        model: "openai/gpt-oss-120b",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      });
      try {
        return JSON.parse(completion.choices[0].message.content);
      } catch {
        return { matchScore: 50, skillsMatched: [], missingSkills: [] };
      }
    } catch (err) {
      if (err?.status === 429 && attempt < maxRetries - 1) {
        const retryAfter = parseInt(err?.headers?.["retry-after"] || "10", 10);
        console.warn(`Groq rate limited (calculateMatchScore). Retrying in ${retryAfter}s... (attempt ${attempt + 1}/${maxRetries})`);
        await sleep(retryAfter * 1000);
      } else {
        return { matchScore: 50, skillsMatched: [], missingSkills: [] };
      }
    }
  }
};
