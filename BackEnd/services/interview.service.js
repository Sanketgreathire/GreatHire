import axios from "axios";

export const startInterviewCall = async (phone, questions) => {
  const response = await axios.post(
    "https://api.bland.ai/v1/calls",
    { phone_number: phone, task: questions },
    { headers: { Authorization: `Bearer ${process.env.BLAND_API_KEY}` } }
  );
  return response.data;
};
