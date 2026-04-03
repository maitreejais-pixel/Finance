import React from "react";
import { ShieldCheck, AlertTriangle, FileText, Download } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function EntryDetails({ record }) {
  if (!record) return null;

  const isFlagged = record.status === "flagged";
  const isVerified = record.status === "verified";

  return (
    <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2 text-gray-800">
          <FileText className="w-5 h-5 text-blue-600" /> Transaction Audit
        </h3>

        {/* Export Button replacing the 'Play' functionality */}
        <a
          href={`${API_BASE_URL}/api/export/${record._id}`}
          className="flex items-center gap-1 text-xs bg-white border px-3 py-1 rounded-md hover:bg-gray-100 transition-colors"
          download
        >
          <Download className="w-3 h-3" /> Export Statement
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status Card */}
        <div
          className={`p-4 rounded-lg flex items-center gap-3 ${
            isFlagged
              ? "bg-red-50 border border-red-100"
              : "bg-green-50 border border-green-100"
          }`}
        >
          {isFlagged ? (
            <AlertTriangle className="w-8 h-8 text-red-600" />
          ) : (
            <ShieldCheck className="w-8 h-8 text-green-600" />
          )}
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-gray-500">
              Compliance Status
            </p>
            <p
              className={`text-lg font-bold ${isFlagged ? "text-red-700" : "text-green-700"}`}
            >
              {record.status.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Risk Score Display */}
        <div className="p-4 bg-white rounded-lg border border-gray-100">
          <p className="text-xs uppercase tracking-wider font-semibold text-gray-500">
            Risk Assessment Score
          </p>
          <p className="text-xl font-mono font-bold text-gray-800">
            {((record.riskScore || 0) * 100).toFixed(2)}%
          </p>
          <div className="w-full bg-gray-100 h-1.5 mt-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${isFlagged ? "bg-red-500" : "bg-green-500"}`}
              style={{ width: `${(record.riskScore || 0) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          <strong>Note:</strong> This transaction has been processed by the
          Zorvyn AI Audit Engine.
          {isFlagged
            ? " Manual review is required due to high risk parameters."
            : " No anomalies detected."}
        </p>
      </div>
    </div>
  );
}
