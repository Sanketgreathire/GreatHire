// utils/gemini.js
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function fetchJobResultsFromQuery(query, jobsList) {
    const prompt = `
    You are a chatbot for a job platform. A user asked: "${query}". 
    Based on the job list below, show relevant job openings.

    Job List:
    ${JSON.stringify(jobsList, null, 2)}

    Show relevant results in a friendly format.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
    });

    return response.text();
}
