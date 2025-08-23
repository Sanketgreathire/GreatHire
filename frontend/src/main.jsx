import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './redux/store.js';
import { NotificationProvider } from './context/NotificationContext.jsx';

// Create root and render the application
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* Wrap the entire app with NotificationProvider */}
        <NotificationProvider>
          <App />
          <Toaster
            position="bottom-right"
            reverseOrder={false}
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
              },
            }}
          />
        </NotificationProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);