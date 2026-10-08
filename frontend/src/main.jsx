 
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "./context/ThemeContext";
import store, { persistor } from "./redux/store";
import axios from "axios";
import "./index.css";

// Global axios interceptor for mixed auth strategy (cookies + localStorage)
axios.interceptors.request.use((config) => {
  config.withCredentials = true;
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const root = document.getElementById("root");

// Expose token getter for Chrome Extension
window.__getGreatHireToken = function () {
  try {
    const state = store.getState();
    const authState = state.auth;

    if (authState && authState.user) {
      if (authState.user.token) return authState.user.token;
    }

    const storedToken = localStorage.getItem("token");
    if (storedToken) return storedToken;

    return null;
  } catch (e) {
    console.error("Error getting token:", e);
    return null;
  }
};

ReactDOM.createRoot(root).render(
  <ThemeProvider>
    <HelmetProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </HelmetProvider>
  </ThemeProvider>
);