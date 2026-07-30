'use client';

import React, { useEffect } from 'react';
import { useApp } from '@/lib/store/app-store';
import { Zap, X, ShoppingCart, UserCheck } from 'lucide-react';

export default function RealtimeToast() {
  const { realtimeToast, dismissToast } = useApp();

  useEffect(() => {
    if (realtimeToast) {
      const timer = setTimeout(() => {
        dismissToast();
      }, 7000); // Dismiss after 7s
      return () => clearTimeout(timer);
    }
  }, [realtimeToast, dismissToast]);

  if (!realtimeToast) return null;

  const { sale } = realtimeToast;
  const timeFormatted = new Date(sale.sold_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="fixed top-20 right-4 z-50 max-w-md w-full animate-fade-in no-print">
      <div className="bg-gradient-to-r from-[#0F233D] to-[#122A4A] border-2 border-amber-500/80 rounded-2xl p-4 shadow-2xl shadow-amber-500/20 text-white relative flex items-start space-x-3.5 backdrop-blur-md">
        
        {/* Animated Live Icon */}
        <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center flex-shrink-0 shadow-lg font-bold">
          <Zap className="w-6 h-6 animate-bounce" />
        </div>

        {/* Toast Body */}
        <div className="flex-1 pr-4">
          <div className="flex items-center space-x-2">
            <span className="bg-amber-500/20 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider border border-amber-500/40">
              LIVE REALTIME TRANSACTION
            </span>
            <span className="text-[10px] text-slate-400 font-mono">{timeFormatted}</span>
          </div>

          <h4 className="text-sm font-bold text-white mt-1">
            <span className="text-amber-400 font-extrabold">{sale.seller_name}</span> logged a new sale!
          </h4>

          <p className="text-xs text-slate-200 mt-1 leading-relaxed">
            Sold <strong className="text-white font-bold">{sale.quantity_sold}</strong> x{' '}
            <strong className="text-slate-100">{sale.product_name}</strong> at{' '}
            <strong className="text-slate-200">SLE {sale.rate_per_unit.toLocaleString()}</strong>
          </p>

          <div className="mt-2 pt-2 border-t border-whitedove-slate/60 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Total Transaction Amount:</span>
            <span className="text-sm font-extrabold text-amber-300 font-heading">
              SLE {sale.total_price.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={dismissToast}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-whitedove-slate/50 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
}
