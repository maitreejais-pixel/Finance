import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

/**
 * ZORVYN FINANCE - Entry Point
 * StrictMode is enabled to catch side-effects in development.
 */
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element. Check index.html.");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
