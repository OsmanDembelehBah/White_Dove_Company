"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SellerPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const role = sessionStorage.getItem("userRole");
    const name = sessionStorage.getItem("userName");
    
    if (role !== "seller") {
      router.push("/");
    } else {
      setUserName(name || "Seller");
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.clear();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#050d1a] text-white">
      {/* Header */}
      <div className="bg-[#0d1b30] border-b border-white/10 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#059669] to-[#10b981] rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold">Seller POS</h1>
              <p className="text-sm text-white/50">Welcome, {userName || "Seller"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs border border-green-500/30">
              ● Live
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <p className="text-white/40 text-xs uppercase tracking-wider">Today's Revenue</p>
            <p className="text-2xl font-bold mt-1">SLE 0.00</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <p className="text-white/40 text-xs uppercase tracking-wider">Sales Today</p>
            <p className="text-2xl font-bold mt-1">0</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <p className="text-white/40 text-xs uppercase tracking-wider">Products</p>
            <p className="text-2xl font-bold mt-1">0</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <p className="text-white/40 text-xs uppercase tracking-wider">Low Stock</p>
            <p className="text-2xl font-bold mt-1">0</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/5">
          <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button className="px-4 py-3 bg-[#10b981] hover:bg-[#059669] rounded-lg text-white font-semibold transition">
              💰 New Sale
            </button>
            <button className="px-4 py-3 bg-[#0a3d91] hover:bg-[#1255c4] rounded-lg text-white font-semibold transition">
              📦 View Products
            </button>
            <button className="px-4 py-3 bg-[#F59E0B] hover:bg-[#D97706] rounded-lg text-white font-semibold transition">
              📊 My History
            </button>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="mt-6 text-center text-white/30 text-sm">
          Full seller POS coming soon...
        </div>
      </div>
    </div>
  );
}
