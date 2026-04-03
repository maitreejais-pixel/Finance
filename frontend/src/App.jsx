import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Context & Security
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminConsole from "./pages/AdminConsole";

// Optional: A small loading spinner for the Suspense fallback
const PageLoader = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Suspense handles the "flicker" during component mounting */}
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* --- ROOT REDIRECT --- */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* --- PUBLIC AUTH ROUTES --- */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* --- PROTECTED ANALYST ROUTES --- */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminConsole />
                </ProtectedRoute>
              }
            />

            {/* --- 404 GATEKEEPER --- */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}
