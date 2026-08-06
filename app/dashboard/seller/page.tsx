import React from "react";

export default function SellerPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#0F233D] via-[#122C4D] to-[#07101E] border border-whitedove-slate shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-2xl">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Seller Dashboard</h1>
            <p className="text-sm text-white/60">Point of Sale</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-4 py-2 text-sm bg-green-500/20 text-green-400 rounded-full border border-green-500/30">● Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
          <p className="text-sm text-white/60">Today's Revenue</p>
          <p className="text-2xl font-bold text-white mt-1">SLE 0.00</p>
        </div>
        <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
          <p className="text-sm text-white/60">Sales Today</p>
          <p className="text-2xl font-bold text-white mt-1">0</p>
        </div>
        <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
          <p className="text-sm text-white/60">Products</p>
          <p className="text-2xl font-bold text-white mt-1">0</p>
        </div>
        <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
          <p className="text-sm text-white/60">Low Stock</p>
          <p className="text-2xl font-bold text-white mt-1">0</p>
        </div>
      </div>
    </div>
  );
}
