import Groq from "groq-sdk";

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

  const completion = await getGroq().chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  try {
    return JSON.parse(completion.choices[0].message.content);
  } catch {
    return { matchScore: 50, skillsMatched: [], missingSkills: [] };
  }
};
