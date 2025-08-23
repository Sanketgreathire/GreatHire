
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api", // your backend base URL
  withCredentials: true, // if you’re using cookies for auth
});

// Attach token if you’re using JWT
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
