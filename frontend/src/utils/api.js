import axios from "axios";

const API = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || "") + "/api",
  withCredentials: true,
});

// Support mixed auth: attach Authorization header if token exists in localStorage/sessionStorage
API.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
