import React from "react";

export default function ManagerPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#0F233D] via-[#122C4D] to-[#07101E] border border-whitedove-slate shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-2xl">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Manager Dashboard</h1>
            <p className="text-sm text-white/60">Executive control panel</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-4 py-2 text-sm bg-green-500/20 text-green-400 rounded-full border border-green-500/30">● Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
          <p className="text-sm text-white/60">Total Revenue</p>
          <p className="text-2xl font-bold text-white mt-1">SLE 0.00</p>
        </div>
        <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
          <p className="text-sm text-white/60">Total Sales</p>
          <p className="text-2xl font-bold text-white mt-1">0</p>
        </div>
        <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
          <p className="text-sm text-white/60">Products</p>
          <p className="text-2xl font-bold text-white mt-1">0</p>
        </div>
        <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
          <p className="text-sm text-white/60">Users</p>
          <p className="text-2xl font-bold text-white mt-1">0</p>
        </div>
      </div>
    </div>
  );
}
