import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Lock, Mail, Loader2 } from "lucide-react";
import zorvynLogo from "../assets/images/zorvyn_logo.png";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        credentials,
      );

      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.error || "Connection refused by Zorvyn Gateway.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] w-full max-w-md border border-slate-100">
        <div className="text-center mb-10">
          {/* LOGO INTEGRATION */}
          <img
            src={zorvynLogo}
            alt="Zorvyn Logo"
            className="h-16 mx-auto mb-6 object-contain drop-shadow-sm"
          />
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">
            ZORVYN <span className="text-blue-600">FINANCE</span>
          </h1>
          <p className="text-slate-400 font-bold text-[10px] mt-2 uppercase tracking-[0.3em]">
            Secure Analyst Portal
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 text-xs p-4 rounded-r-xl mb-6 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative group">
            <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
            <input
              name="email"
              type="email"
              placeholder="Analyst Email"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              onChange={handleChange}
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-4 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
            <input
              name="password"
              type="password"
              placeholder="Access Key"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              "AUTHORIZE SESSION"
            )}
          </button>
        </form>
        {/* ADD THIS CODE RIGHT HERE */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            New to the Terminal?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 transition-colors ml-1"
            >
              Register Analyst
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
