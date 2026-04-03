import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { PlusCircle, DollarSign, FileText } from "lucide-react";

export default function AddEntry({ onEntrySuccess }) {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "expense",
    category: "Groceries",
  });
  const [submitting, setSubmitting] = useState(false);
  const { token } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;

    setSubmitting(true);
    try {
      const authToken = token || localStorage.getItem("token");
      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5000";

      // We send JSON now, not FormData, matching our new entries.js route
      const res = await axios.post(`${API_BASE_URL}/api/records`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Notify parent component (FinanceDashboard) to start tracking audit progress
      onEntrySuccess(res.data);

      // Reset form
      setFormData({
        description: "",
        amount: "",
        type: "expense",
        category: "Groceries",
      });
    } catch (err) {
      console.error("ENTRY ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to add record");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <PlusCircle className="text-blue-600" /> New Transaction
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Description Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <div className="mt-1 relative">
            <FileText className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Monthly Salary or Office Rent"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Amount Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 text-[10px] uppercase font-black">
              Amount ($)
            </label>
            <div className="mt-1 relative">
              <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="number"
                className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Type Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 text-[10px] uppercase font-black">
              Type
            </label>
            <select
              className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* Category Select (Requirement #2) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 text-[10px] uppercase font-black">
              Category
            </label>
            <select
              className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <optgroup label="Income Sources">
                <option value="Salary">Full-time Salary 💰</option>
                <option value="Freelance">Freelance/Contract 💻</option>
                <option value="Investment">Investments 📈</option>
              </optgroup>

              <optgroup label="Fixed Expenses">
                <option value="Rent">Rent/Mortgage 🏠</option>
                <option value="Utilities">Utilities ⚡</option>
                <option value="Subscription">Subscriptions 🔄</option>
              </optgroup>

              <optgroup label="Variable Expenses">
                <option value="Groceries">Groceries 🛒</option>
                <option value="Dining Out">Dining Out 🍽️</option>
                <option value="Transport">Transport 🚗</option>
                <option value="Entertainment">Entertainment 🎬</option>
                <option value="Shopping">General Shopping 🛍️</option>
              </optgroup>

              <optgroup label="Other">
                <option value="Other">Miscellaneous 🌀</option>
              </optgroup>
            </select>
          </div>
        </div>
        <button
          disabled={submitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors disabled:bg-gray-400"
        >
          {submitting ? "Processing..." : "Submit for Audit"}
        </button>
      </form>
    </div>
  );
}
