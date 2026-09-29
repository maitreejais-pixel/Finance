import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { User, Mail, Lock, ShieldPlus, Loader2 } from "lucide-react";
// Import your specific asset here
import zorvynLogo from "../assets/images/zorvyn_logo.png";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Security keys do not match.");
    }

    setLoading(true);
    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5000";

      await axios.post(`${API_BASE_URL}/api/auth/register`, {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
      });

      // Using a cleaner notification than a standard alert
      navigate("/login", {
        state: {
          message: "Credentials provisioned successfully. Please log in.",
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Provisioning failed. Contact system admin.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] w-full max-w-xl border border-slate-100">
        <div className="text-center mb-10">
          {/* LOGO INTEGRATION */}
          <img
            src={zorvynLogo}
            alt="Finance Logo"
            className="h-14 mx-auto mb-6 object-contain"
          />
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">
            JOIN <span className="text-blue-600">FINANCE</span>
          </h1>
          <p className="text-slate-400 font-bold text-[10px] mt-2 uppercase tracking-[0.3em]">
            Analyst Onboarding Portal
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 text-xs p-4 rounded-r-xl mb-6 font-medium animate-in fade-in duration-300">
            {error}
          </div>
        )}

        <form
          onSubmit={handleRegister}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="relative group">
            <User className="absolute left-4 top-4 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
            <input
              name="firstName"
              type="text"
              placeholder="First Name"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              onChange={handleChange}
              required
            />
          </div>

          <div className="relative group">
            <User className="absolute left-4 top-4 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
            <input
              name="lastName"
              type="text"
              placeholder="Last Name"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              onChange={handleChange}
              required
            />
          </div>

          <div className="relative group md:col-span-2">
            <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
            <input
              name="email"
              type="email"
              placeholder="Corporate Email Address"
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
              placeholder="Create Password"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              onChange={handleChange}
              required
            />
          </div>

          <div className="relative group">
            <ShieldPlus className="absolute left-4 top-4 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 mt-4 bg-slate-900 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:bg-slate-400"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> PROVISIONING...
              </>
            ) : (
              "REGISTER ANALYST"
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-tight">
            Already registered?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              Sign In to Terminal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
