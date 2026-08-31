// Test script to verify transcript extraction from Bland.ai API
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

// Sample Bland.ai responses to test different transcript formats
const sampleResponses = {
  format1: {
    transcript: "AI: Hello, welcome to the interview.\nCandidate: Hi, thank you for having me.",
    recording_url: "https://example.com/recording.mp3",
    status: "completed",
  },
  format2: {
    messages: [
      { role: "assistant", content: "Hello, welcome to the interview.", timestamp: Date.now() },
      { role: "user", content: "Hi, thank you for having me.", timestamp: Date.now() + 1000 },
    ],
    recording_url: "https://example.com/recording.mp3",
    status: "completed",
  },
  format3: {
    analysis: {
      transcript: "AI: What is your experience with Node.js?\nCandidate: I have 5 years of experience.",
    },
    recording_url: "https://example.com/recording.mp3",
    status: "completed",
  },
};

// Function to extract transcript (mirrors backend logic)
function extractTranscript(callData) {
  let transcript = "";

  if (callData.transcript) {
    transcript = callData.transcript;
  } else if (callData.messages && Array.isArray(callData.messages)) {
    transcript = callData.messages
      .map((m) => {
        const role = m.role === "assistant" ? "AI Agent" : "Candidate";
        const time = m.timestamp ? ` [${new Date(m.timestamp).toLocaleTimeString()}]` : "";
        return `${role}${time}:\n${m.content}`;
      })
      .join("\n\n---\n\n");
  } else if (callData.analysis?.transcript) {
    transcript = callData.analysis.transcript;
  } else if (callData.messages_processed) {
    transcript = callData.messages_processed.map((m) => `${m.speaker || "Speaker"}:\n${m.text}`).join("\n\n---\n\n");
  }

  if (!transcript) {
    transcript = callData.recording_url
      ? "⏳ Transcript is being processed. Please check back in a few moments."
      : "No transcript available for this call.";
  }

  return transcript.trim();
}

// Test each format
console.log("🧪 Testing Transcript Extraction\n");
console.log("=" + "=".repeat(50) + "\n");

Object.entries(sampleResponses).forEach(([format, data]) => {
  console.log(`📝 Testing ${format}:`);
  const extracted = extractTranscript(data);
  console.log(extracted);
  console.log("\n" + "-".repeat(52) + "\n");
});

// Test with real Bland.ai API (if BLAND_CALL_ID is provided)
if (process.env.BLAND_CALL_ID && process.env.BLAND_API_KEY) {
  console.log("🔄 Fetching real call from Bland.ai...\n");
  const callId = process.env.BLAND_CALL_ID;

  fetch(`https://api.bland.ai/v1/calls/${callId}`, {
    headers: {
      authorization: process.env.BLAND_API_KEY,
    },
  })
    .then((res) => res.json())
    .then((callData) => {
      console.log("✅ Bland.ai Response Keys:", Object.keys(callData));
      console.log("\nExtracted Transcript:");
      console.log(extractTranscript(callData));
    })
    .catch((err) => {
      console.error("❌ Error fetching from Bland.ai:", err.message);
    });
} else {
  console.log("ℹ️  To test with a real Bland.ai call, set BLAND_CALL_ID and BLAND_API_KEY in .env\n");
}
