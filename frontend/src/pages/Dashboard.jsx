import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Context & Hooks
import { AuthContext } from "../context/AuthContext";
import { useSocket } from "../hooks/useSocket";

// Components
import AddEntry from "../components/AddEntry";
import EntryDetails from "../components/EntryDetails";
import TransactionTable from "../components/TransactionTable";

// Assets & Icons
import zorvynLogo from "../assets/images/zorvyn_logo.png";
import {
  LogOut,
  LayoutDashboard,
  ShieldAlert,
  Loader2,
  Landmark,
  Edit2,
  Check,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const [currentRecordId, setCurrentRecordId] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [tempIncome, setTempIncome] = useState(user?.declaredIncome || 0);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netBalance: 0,
  });

  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem("token");
      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await axios.get(`${API_BASE_URL}/api/records/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSummary(res.data);
    } catch (err) {
      console.error("Error fetching summary:", err);
    }
  };

  // Real-time Audit Socket Hook
  const { progress, status, setStatus, setProgress, auditStep } =
    useSocket(currentRecordId);

  /**
   * REFRESH LISTENER
   * Automatically refreshes the transaction ledger when an audit completes
   */
  useEffect(() => {
    fetchSummary(); // Initial fetch on load
    if (status === "verified" || status === "flagged") {
      fetchSummary(); // Refresh totals when audit finishes
      setRefreshKey((prev) => prev + 1);
    }
  }, [status]);

  /**
   * DATA FETCHING
   * Retrieves full record details when selected or updated
   */
  useEffect(() => {
    if (!currentRecordId) return;

    const fetchRecordStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const API_BASE_URL =
          import.meta.env.VITE_API_URL || "http://localhost:5000";

        // Handle both object and ID string formats
        const id =
          typeof currentRecordId === "object"
            ? currentRecordId?._id
            : currentRecordId;

        const res = await axios.get(`${API_BASE_URL}/api/records/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSelectedRecord(res.data);
        setStatus(res.data.status);
        setProgress(res.data.progress || 0);
      } catch (err) {
        console.error("Error fetching audit data:", err);
      }
    };

    fetchRecordStatus();
  }, [currentRecordId, status, setStatus, setProgress]);
  useEffect(() => {
    if (user?.declaredIncome) {
      setTempIncome(user.declaredIncome);
    }
    // Debugging: Check the console (F12) to see if role is an object or string
    console.log("Current user role object:", user?.role);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleUpdateIncome = async () => {
    try {
      const token = localStorage.getItem("token");
      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5000";

      await axios.put(
        `${API_BASE_URL}/api/auth/update-income`,
        { income: Number(tempIncome) },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setIsEditingIncome(false);
      // Refresh the page to update the AuthContext and the Summary numbers
      window.location.reload();
    } catch (err) {
      console.error("Update failed", err);
      alert("Error updating income");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen bg-gray-50/50">
      {/* --- REBRANDED HEADER --- */}
      {/* --- REBRANDED HEADER --- */}
      <header className="mb-8 flex justify-between items-center bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <img src={zorvynLogo} alt="Finance" className="h-10 w-auto" />
          <div className="h-8 w-[1px] bg-gray-200 hidden sm:block"></div>
          <div>
            <h1 className="text-xl font-black text-gray-900 leading-none tracking-tight">
              FINANCE <span className="text-blue-600">FINANCE</span>
            </h1>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">
              Audit Terminal v2.4
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* --- ADMIN TERMINAL BUTTON (ADD THIS) --- */}
          {/* Change the logic to check for the string "admin" */}
          {(user?.role === "admin" ||
            user?.role?.name?.toLowerCase() === "admin") && (
            <button
              onClick={() => {
                console.log("Admin Button Clicked!");
                navigate("/admin");
              }}
              className="relative z-50 px-4 py-2 bg-red-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-md flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" />
              Admin Terminal
            </button>
          )}

          <div className="text-right hidden md:block">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
              Active Analyst
            </p>
            <p className="text-sm font-bold text-gray-700">
              {user?.name || "Standard User"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* --- SUMMARY SECTION (Requirement #3) --- */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-2xl text-green-600">
            <Landmark className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Total Income
            </p>
            {isEditingIncome ? (
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="number"
                  className="w-full bg-gray-50 border-none text-lg font-black text-gray-900 focus:ring-2 focus:ring-blue-100 rounded-lg p-1"
                  value={tempIncome}
                  autoFocus
                  onChange={(e) => setTempIncome(e.target.value)}
                />
                <button
                  onClick={handleUpdateIncome}
                  className="p-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-900">
                  $
                  {(
                    (summary.totalIncome || 0) + (user?.declaredIncome || 0)
                  ).toLocaleString()}
                </h3>
                <button
                  onClick={() => setIsEditingIncome(true)}
                  className="p-2 hover:bg-gray-50 rounded-xl text-gray-300 hover:text-blue-600 transition-colors"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 rounded-2xl text-red-600">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Total Expenses
            </p>
            <h3 className="text-xl font-black text-gray-900">
              ${summary.totalExpenses?.toLocaleString()}
            </h3>
          </div>
        </div>

        <div className="bg-blue-600 p-6 rounded-[2rem] shadow-lg shadow-blue-200 flex items-center gap-4">
          <div className="p-3 bg-blue-500 rounded-2xl text-white">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest">
              Net Balance
            </p>
            <h3 className="text-xl font-black text-white">
              $
              {(
                (user?.declaredIncome || 0) +
                (summary.totalIncome || 0) -
                (summary.totalExpenses || 0)
              ).toLocaleString()}
            </h3>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* --- LEFT COLUMN: INPUT & LEDGER --- */}
        <div className="lg:col-span-7 space-y-6">
          <section>
            {/* RBAC Gate: Only Non-Viewers can add entries */}
            {user?.role?.name !== "viewer" ? (
              <AddEntry
                onEntrySuccess={(record) => {
                  // 1. Set the ID to trigger the socket/fetcher
                  setCurrentRecordId(record._id);

                  // 2. Immediately set the record data so the sidebar shows up
                  setSelectedRecord(record);

                  // 3. Refresh the ledger list
                  setRefreshKey((prev) => prev + 1);
                }}
              />
            ) : (
              <div className="p-8 bg-white border-2 border-dashed border-gray-200 rounded-[2rem] text-center">
                <p className="text-gray-400 font-bold text-sm italic">
                  Read-Only Analyst Access (Viewer Mode)
                </p>
              </div>
            )}

            {/* LIVE AUDIT PROGRESS */}
            {currentRecordId &&
              (status === "analyzing" || status === "verifying") && (
                <div className="mt-4 p-5 bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-500/5 animate-pulse">
                  <div className="flex justify-between mb-3">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      {auditStep || "Initializing Neural Engine..."}
                    </span>
                    <span className="text-xs font-bold text-blue-600">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="w-full bg-blue-50 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full transition-all duration-700 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
          </section>

          <section>
            <TransactionTable
              refreshTrigger={refreshKey}
              onSelectRecord={(record) => {
                setSelectedRecord(null); // Clear previous selection for snappy feel
                setCurrentRecordId(record?._id || record);
              }}
            />
          </section>
        </div>

        {/* --- RIGHT COLUMN: CONTEXTUAL SIDEBAR --- */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 min-h-[500px] sticky top-6">
            {selectedRecord &&
            (status === "verified" || status === "flagged") ? (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-2">
                    Risk Assessment Report
                  </h2>
                  <div className="h-1 w-12 bg-blue-600 mx-auto rounded-full"></div>
                </div>
                <EntryDetails record={selectedRecord} />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-20 px-6">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-200">
                  {currentRecordId ? (
                    <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
                  ) : (
                    <Landmark className="w-10 h-10" />
                  )}
                </div>
                <h3 className="text-gray-900 font-black text-lg mb-2">
                  {currentRecordId
                    ? "AI Audit in Progress"
                    : "No Ledger Entry Selected"}
                </h3>
                <p className="text-sm leading-relaxed text-gray-400 max-w-[280px]">
                  {currentRecordId
                    ? "Finance AI is currently validating this transaction against compliance databases."
                    : "Select an entry from the ledger to view the detailed risk assessment and audit trails."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
