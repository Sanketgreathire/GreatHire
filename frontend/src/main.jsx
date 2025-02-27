import React from "react"; 

// React DOM for rendering components
import ReactDOM from "react-dom/client"; 

// Main application component
import App from "./App.jsx"; 

// Global CSS styles
import "./index.css"; 

// Toast notifications for user feedback
import { Toaster } from "react-hot-toast"; 

// Redux for state management
// Redux provider for global state management
import { Provider } from "react-redux"; 

// PersistGate to persist Redux store
import { PersistGate } from "redux-persist/integration/react"; 

// Redux store and persistor configuration
import store, { persistor } from "./redux/store.js"; 

// Rendering the application into the root element
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}> {/* Provides Redux store to the application */}
    <PersistGate loading={null} persistor={persistor}> {/* Ensures persisted state is loaded before rendering */}
      <App /> {/* Main App component */}
      <Toaster
        position="bottom-right" // Positioning toast notifications at the bottom-right
        reverseOrder={false} // Toasts appear in the order they are triggered
        toastOptions={{
          duration: 3000, // Toast disappears after 3 seconds
        }}
      />
    </PersistGate>
  </Provider>
);
