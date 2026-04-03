import React, { useEffect, useState } from "react";
import axios from "axios";
import { Landmark, Trash2, Filter, DollarSign } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const TransactionTable = ({ onSelectRecord, refreshTrigger }) => {
  const [records, setRecords] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("");

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = typeFilter
        ? `${API_BASE_URL}/api/records?type=${typeFilter}`
        : `${API_BASE_URL}/api/records`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords(res.data);
    } catch (err) {
      console.error("Error fetching ledger:", err);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [refreshTrigger, typeFilter]);
  const handleDelete = async (e, recordId) => {
    e.stopPropagation();
    if (
      !window.confirm("Are you sure you want to delete this financial record?")
    )
      return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/records/${recordId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords(records.filter((r) => r._id !== recordId));
      onSelectRecord(null);
    } catch (err) {
      alert("Error deleting record");
    }
  };

  const filteredRecords = records.filter((r) => {
    if (statusFilter === "all") return true;
    return r.status === statusFilter;
  });

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Landmark className="text-blue-600 w-5 h-5" /> Transaction Ledger
        </h2>

        <div className="flex flex-wrap gap-3">
          {/* --- NEW: TYPE FILTERS (Income/Expense) --- */}
          <div className="flex bg-gray-100 p-1 rounded-xl">
            {["", "income", "expense"].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${
                  typeFilter === t
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-400"
                }`}
              >
                {t === "" ? "All" : t}
              </button>
            ))}
          </div>

          {/* --- STATUS FILTERS --- */}
          <div className="flex gap-1">
            {["all", "verified", "flagged"].map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all uppercase border ${
                  statusFilter === f
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-400 border-gray-100"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredRecords.length === 0 && (
          <p className="text-center text-gray-400 py-10 text-sm italic">
            No transactions found.
          </p>
        )}

        {filteredRecords.map((r) => (
          <div
            key={r._id}
            onClick={() => onSelectRecord(r)}
            className="flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-all group"
          >
            <div className="flex items-center space-x-3">
              <div
                className={`p-2 rounded-lg transition-colors ${
                  r.type === "income"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 truncate w-48">
                  {r.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-[10px] font-mono text-gray-400">
                    {new Date(r.createdAt).toLocaleDateString()} • {r.category}
                  </p>

                  {/* SHOW ANALYST NAME IF IT EXISTS */}
                  {r.createdBy?.name && (
                    <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-md font-black uppercase tracking-tighter border border-blue-100/50">
                      ID: {r.createdBy.name}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p
                  className={`text-sm font-bold ${r.type === "income" ? "text-green-600" : "text-gray-800"}`}
                >
                  {r.type === "income" ? "+" : "-"}${r.amount.toLocaleString()}
                </p>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    r.status === "verified"
                      ? "bg-green-100 text-green-600"
                      : r.status === "flagged"
                        ? "bg-red-100 text-red-600"
                        : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {r.status}
                </span>
              </div>

              <button
                onClick={(e) => handleDelete(e, r._id)}
                className="p-1.5 rounded-md text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                title="Delete Entry"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionTable;
