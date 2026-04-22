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

// Minimal loading fallback shown only during redux-persist rehydration
const PersistLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <HelmetProvider>
      <Provider store={store}>
        <PersistGate loading={<PersistLoader />} persistor={persistor}>
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
