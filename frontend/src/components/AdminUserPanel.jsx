import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, ShieldCheck, Activity } from "lucide-react";

export default function AdminUserPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const API_BASE_URL =
          import.meta.env.VITE_API_URL || "https://zorvyn-finance.onrender.com";

        const res = await axios.get(`${API_BASE_URL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Admin Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 uppercase tracking-tight">
          <Users className="text-red-600 w-5 h-5" /> Registered Analysts
        </h2>
        <span className="bg-red-50 text-red-600 text-[10px] font-black px-2 py-1 rounded-lg">
          {users.length} TOTAL
        </span>
      </div>

      <div className="space-y-3">
        {loading ? (
          <p className="text-gray-400 text-xs italic">
            Syncing user database...
          </p>
        ) : (
          users.map((u) => (
            <div
              key={u._id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-200 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-xs font-bold text-gray-400 border border-gray-100">
                  {u.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{u.name}</p>
                  <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">
                    {u.role?.name || "No Role"}
                  </p>
                </div>
              </div>
              <Activity className="w-4 h-4 text-green-400" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
