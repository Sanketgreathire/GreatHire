import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "./context/ThemeContext";
import store, { persistor } from "./redux/store";
import { Toaster } from "react-hot-toast";
import "./index.css";

const root = document.getElementById("root");

// Expose token getter for Chrome Extension
window.__getGreatHireToken = function() {
  try {
    // Get token from Redux store state
    const state = store.getState();
    const authState = state.auth;
    
    // Try multiple possible locations
    if (authState && authState.user) {
      // Token might be in user object
      if (authState.user.token) return authState.user.token;
    }
    
    // Check if there's a token in localStorage (for compatibility)
    const storedToken = localStorage.getItem('token');
    if (storedToken) return storedToken;
    
    return null;
  } catch (e) {
    console.error('Error getting token:', e);
    return null;
  }
};

// Use createRoot with concurrent features for better scheduling
ReactDOM.createRoot(root).render(
  <ThemeProvider>
    <HelmetProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
          <Toaster
            position="bottom-right"
            reverseOrder={false}
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
              },
            }}
          />
        </PersistGate>
      </Provider>
    </HelmetProvider>
  </ThemeProvider>
);
