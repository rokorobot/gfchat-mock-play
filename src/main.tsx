import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import "./index.css";

// main.tsx entry point with preview mode enabled
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Preview mode ensures profile + token are mocked so you can see the app without backend */}
    <AuthProvider preview>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
