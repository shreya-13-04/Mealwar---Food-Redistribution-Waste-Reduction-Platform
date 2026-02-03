import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

/**
 * Root Application Component
 * Handles global providers + routing.
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" />} />

          {/* Authentication */}
          <Route path="/register" element={<Register />} />

          {/* Main App */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Catch unknown routes */}
          <Route path="*" element={<Navigate to="/dashboard" />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
