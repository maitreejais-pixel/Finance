import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import TransactionTable from "../components/TransactionTable";
import AdminUserPanel from "../components/AdminUserPanel";
import { ShieldAlert, Database, ArrowLeft } from "lucide-react";
import { useNavigate, Navigate } from "react-router-dom"; // 1. Added Navigate here

export default function AdminConsole() {
  const { user, loading } = useContext(AuthContext); // 2. Added loading from context
  const navigate = useNavigate();

  // --- SECURITY BLOCK START ---
  // If the app is still checking the token, show nothing (prevents "Access Denied" flash)
  if (loading) return null;

  // If the user isn't an admin, redirect them back to the standard dashboard immediately
  if (user?.role !== "admin") {
    console.log("Access Denied: User role is", user?.role);
    return <Navigate to="/dashboard" replace />;
  }
  // --- SECURITY BLOCK END ---

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen bg-gray-50/30">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-3 bg-white rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-gray-900 leading-none tracking-tight">
              FINANCE <span className="text-red-600">ADMIN TERMINAL</span>
            </h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] mt-2">
              System Wide Governance & Audit
            </p>
          </div>
        </div>

        <div className="bg-red-600 text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-lg shadow-red-600/20">
          <ShieldAlert className="w-5 h-5" />
          <span className="text-sm font-black uppercase tracking-widest">
            Master Auth Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: GLOBAL DATA */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Database className="text-blue-600 w-5 h-5" /> Global Financial
                Ledger
              </h2>
              {/* Optional: Add a small badge to show it's a "Global" view */}
              <span className="bg-blue-50 text-blue-600 text-[9px] font-black px-2 py-1 rounded uppercase">
                Cross-Analyst Data
              </span>
            </div>

            <TransactionTable
              onSelectRecord={(rec) => console.log("Admin viewing:", rec)}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: USER DIRECTORY */}
        <div className="lg:col-span-4">
          <AdminUserPanel />
        </div>
      </div>
    </div>
  );
}
