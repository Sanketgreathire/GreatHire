/*import axios from "axios";

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

export default API;*/

// import axios from "axios";

// const API = axios.create({
//   baseURL: import.meta.env.VITE_API_URL + "/api",
//   withCredentials: true,
// });

// export default API;

import axios from "axios";

// Origin only (no "/api", no trailing slash). Falls back to "" so the
// Vite dev proxy still works if the variable is missing.
const BASE = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

const API = axios.create({
  baseURL: `${BASE}/api`,
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
