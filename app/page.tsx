'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store/app-store';
import { 
  Store, 
  LayoutDashboard, 
  Zap, 
  Sun, 
  ShieldCheck, 
  Activity, 
  Wrench, 
  CheckCircle2, 
  PhoneCall, 
  ArrowRight,
  Database,
  RefreshCw
} from 'lucide-react';

export default function LandingPage() {
  const { totalDailyRevenue, totalDailyItemsSold, lowStockCount, inventory, resetSeedData } = useApp();

  return (
    <div className="space-y-10 animate-fade-in">
      
      {/* Hero Banner Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F233D] via-[#112948] to-[#07101E] border border-whitedove-slate p-8 sm:p-12 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Powering Homes. Empowering Lives.</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
            White Dove Electrical & Engineering <span className="text-gold-gradient block">Management System</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Your trusted partner in Sierra Leone for safe, reliable, and innovative electrical solutions. Real-time Point of Sale, live inventory tracking, automatic stock deduction, and executive manager analytics.
          </p>

          {/* Quick Action Navigation Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            
            <Link
              href="/dashboard/seller"
              className="flex items-center justify-center space-x-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-base shadow-xl shadow-amber-500/25 transition-all group"
            >
              <Store className="w-5 h-5" />
              <span>Seller Point of Sale</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/dashboard/manager"
              className="flex items-center justify-center space-x-3 px-6 py-4 rounded-2xl bg-[#112440] hover:bg-[#162f54] text-white font-bold text-base border border-whitedove-slate/80 shadow-xl transition-all group"
            >
              <LayoutDashboard className="w-5 h-5 text-blue-400" />
              <span>Manager Executive Dashboard</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>

          </div>

        </div>
      </div>

      {/* Live System Metrics Quick Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-[#0F233D] border border-whitedove-slate flex items-center space-x-4 shadow-lg">
          <div className="p-3.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Today's Revenue</p>
            <p className="text-xl font-extrabold text-white font-heading mt-0.5">
              SLE {totalDailyRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F233D] border border-whitedove-slate flex items-center space-x-4 shadow-lg">
          <div className="p-3.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Today's Items Sold</p>
            <p className="text-xl font-extrabold text-white font-heading mt-0.5">
              {totalDailyItemsSold} Units
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F233D] border border-whitedove-slate flex items-center space-x-4 shadow-lg">
          <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Electrical Stock</p>
            <p className="text-xl font-extrabold text-white font-heading mt-0.5">
              {inventory.length} Products
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F233D] border border-whitedove-slate flex items-center space-x-4 shadow-lg">
          <div className={`p-3.5 rounded-xl border ${
            lowStockCount > 0 ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}>
            <Sun className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Low Stock Warnings</p>
            <p className="text-xl font-extrabold text-white font-heading mt-0.5">
              {lowStockCount} Items
            </p>
          </div>
        </div>

      </div>

      {/* Role Cards Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Seller Card */}
        <div className="p-8 rounded-3xl bg-gradient-to-b from-[#0F233D] to-[#0A182B] border border-whitedove-slate space-y-5 hover:border-amber-500/50 transition-all shadow-xl group">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Role 1 • Fast Point-of-Sale</span>
            <h3 className="text-2xl font-bold font-heading text-white mt-1">Seller POS Interface</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Designed for sales representatives on counter terminals and smartphones. Search stock live, record instant sales, apply custom unit rates, automatically deduct inventory, and view personal daily earnings.
            </p>
          </div>
          <ul className="text-xs text-slate-300 space-y-2">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Live electrical inventory search with category filters</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Automatic PostgreSQL database stock deduction</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Instant printable sales receipt voucher</span>
            </li>
          </ul>
          <Link
            href="/dashboard/seller"
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition-all shadow-md"
          >
            <span>Open Seller POS</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Manager Card */}
        <div className="p-8 rounded-3xl bg-gradient-to-b from-[#0F233D] to-[#0A182B] border border-whitedove-slate space-y-5 hover:border-blue-500/50 transition-all shadow-xl group">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Role 2 • Executive Control</span>
            <h3 className="text-2xl font-bold font-heading text-white mt-1">Manager Real-Time Dashboard</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Designed for executives Achmed Thoronka (CEO) & Mariama Sesay. Listen to real-time sales transactions via Supabase WebSockets, manage full inventory, restock items, and track total revenue.
            </p>
          </div>
          <ul className="text-xs text-slate-300 space-y-2">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>Real-time WebSocket pop-up toasts for every sale</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>Full inventory CRUD (Add items, update price, restock)</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>Low-stock alert thresholds (&lt; 5 remaining)</span>
            </li>
          </ul>
          <Link
            href="/dashboard/manager"
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs transition-all shadow-md"
          >
            <span>Open Executive Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

      {/* Seed Reset Bar */}
      <div className="p-4 rounded-2xl bg-[#07101E] border border-whitedove-slate/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <Database className="w-4 h-4 text-amber-400" />
          <span>Need to restore default White Dove demo inventory & sales data?</span>
        </div>
        <button
          onClick={resetSeedData}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-whitedove-slate/60 hover:bg-whitedove-slate text-slate-200 font-semibold transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Demo Seed Data</span>
        </button>
      </div>

    </div>
  );
}
