import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * ZORVYN LIVE AUDIT HOOK
 * Connects to the backend via WebSockets to track real-time
 * transaction verification and risk assessment.
 */
export const useSocket = (recordId) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [auditStep, setAuditStep] = useState("");

  useEffect(() => {
    // 1. Exit if there is no active record to track
    if (!recordId) {
      setProgress(0);
      setStatus("");
      setAuditStep("");
      return;
    }

    // 2. Establish connection to Zorvyn Analytics Engine
    const socket = io(API_BASE_URL, {
      withCredentials: true,
    });

    // 3. Join the secure room for this specific transaction
    socket.emit("join-record-room", recordId);

    // 4. Listen for live audit updates
    socket.on("progress", (data) => {
      // Ensure we are only updating the record currently in focus
      if (data.recordId === recordId) {
        setProgress(data.progress);
        setStatus(data.status); // e.g., 'verifying'
        setAuditStep(data.step); // e.g., 'Checking Merchant ID'
      }
    });

    // 5. Listen for the Final Audit Completion
    socket.on("complete", (data) => {
      if (data.recordId === recordId) {
        setProgress(100);
        setStatus(data.status); // e.g., 'verified' or 'flagged'
        setAuditStep("Audit Complete");
      }
    });

    // 6. Security Cleanup: Disconnect on unmount to prevent memory leaks
    return () => {
      socket.off("progress");
      socket.off("complete");
      socket.disconnect();
    };
  }, [recordId]);

  return { progress, setProgress, status, setStatus, auditStep };
};
