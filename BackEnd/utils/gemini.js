// utils/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Initialize model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export async function fetchJobResultsFromQuery(query, jobsList) {
    const prompt = `
    You are a chatbot for a job platform. A user asked: "${query}". 
    Based on the job list below, show relevant job openings.

    Job List:
    ${JSON.stringify(jobsList, null, 2)}

    Show relevant results in a friendly format.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
}
