'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/store/app-store';
import SqlModal from './SqlModal';
import { 
  Zap, 
  ShieldCheck, 
  UserCheck, 
  Database, 
  Store, 
  LayoutDashboard, 
  Activity, 
  ChevronDown,
  Phone,
  MapPin
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { profiles, currentProfile, setCurrentProfile, isRealtimeActive } = useApp();
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0B192C]/90 backdrop-blur-md border-b border-whitedove-slate/60 shadow-lg">
        {/* Top Company Info Bar */}
        <div className="bg-[#07101E] px-4 py-1 text-xs text-slate-300 border-b border-whitedove-slate/40 hidden md:block">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <span className="flex items-center text-amber-400 font-medium">
                <Zap className="w-3.5 h-3.5 mr-1" />
                POWER YOU CAN TRUST, SERVICE YOU DESERVE
              </span>
              <span className="flex items-center text-slate-400">
                <MapPin className="w-3.5 h-3.5 mr-1 text-slate-500" />
                446 Bai Bureh Road, Wellington, Freetown, Sierra Leone
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="flex items-center text-slate-300">
                <Phone className="w-3.5 h-3.5 mr-1 text-amber-400" />
                +232 79 419 105 / +232 34 592 373
              </span>
              <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide border border-amber-500/30">
                CEO: Achmed Thoronka
              </span>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Branding */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-200 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
                <svg className="w-6 h-6 text-[#0B192C]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-lg font-bold font-heading text-white tracking-tight">WHITE DOVE</span>
                  <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wider">
                    SL
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                  Electrical & Engineering Company
                </p>
              </div>
            </Link>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center space-x-1 bg-[#07101E]/80 p-1 rounded-xl border border-whitedove-slate/50">
              <Link
                href="/dashboard/seller"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                  pathname.includes('/seller')
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-whitedove-slate/40'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Seller POS</span>
              </Link>
              <Link
                href="/dashboard/manager"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                  pathname.includes('/manager')
                    ? 'bg-gradient-to-r from-blue-600 to-whitedove-blue text-white shadow-md font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-whitedove-slate/40'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Manager Dashboard</span>
              </Link>
            </nav>

            {/* Right Controls: Realtime Status, SQL Setup, Role Switcher */}
            <div className="flex items-center space-x-3">
              
              {/* WebSocket Realtime Badge */}
              <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Realtime Active</span>
              </div>

              {/* Database SQL Setup Trigger */}
              <button
                onClick={() => setShowSqlModal(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-whitedove-slate/60 hover:bg-whitedove-slate text-amber-300 border border-amber-500/30 transition-colors shadow-sm"
                title="View Database Schema & SQL Setup Script"
              >
                <Database className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">DB Setup SQL</span>
              </button>

              {/* Active Profile Role Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl bg-[#11223A] border border-whitedove-slate/80 hover:border-amber-500/50 transition-all text-left shadow-sm"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    currentProfile.role === 'manager' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-amber-500 text-slate-950'
                  }`}>
                    {currentProfile.full_name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-xs">
                    <p className="font-bold text-white leading-none">{currentProfile.full_name}</p>
                    <p className="text-[10px] text-slate-400 capitalize mt-0.5">
                      {currentProfile.role === 'manager' ? 'Executive Manager' : 'Sales Representative'}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Profile Switcher Menu */}
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#0F233D] border border-whitedove-slate shadow-2xl z-50 py-2 divide-y divide-whitedove-slate/50">
                    <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Switch Role & Active Account
                    </div>
                    
                    <div className="py-1">
                      <p className="px-3 py-1 text-[10px] font-bold text-amber-400 uppercase">Managers</p>
                      {profiles.filter(p => p.role === 'manager').map(p => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setCurrentProfile(p);
                            setShowProfileDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-whitedove-slate/50 ${
                            currentProfile.id === p.id ? 'bg-blue-900/40 text-amber-300 font-bold' : 'text-slate-200'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <ShieldCheck className="w-4 h-4 text-blue-400" />
                            <span>{p.full_name}</span>
                          </div>
                          {currentProfile.id === p.id && <span className="text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded">Active</span>}
                        </button>
                      ))}
                    </div>

                    <div className="py-1">
                      <p className="px-3 py-1 text-[10px] font-bold text-emerald-400 uppercase">Sellers</p>
                      {profiles.filter(p => p.role === 'seller').map(p => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setCurrentProfile(p);
                            setShowProfileDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-whitedove-slate/50 ${
                            currentProfile.id === p.id ? 'bg-amber-900/30 text-amber-300 font-bold' : 'text-slate-200'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <UserCheck className="w-4 h-4 text-emerald-400" />
                            <span>{p.full_name}</span>
                          </div>
                          {currentProfile.id === p.id && <span className="text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded">Active</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </header>

      {/* SQL Setup Modal */}
      <SqlModal isOpen={showSqlModal} onClose={() => setShowSqlModal(false)} />
    </>
  );
}
