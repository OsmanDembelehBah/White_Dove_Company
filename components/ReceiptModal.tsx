'use client';

import React from 'react';
import { SaleTransaction } from '@/lib/supabase/types';
import { X, Printer, CheckCircle, Zap } from 'lucide-react';

interface ReceiptModalProps {
  sale: SaleTransaction | null;
  onClose: () => void;
}

export default function ReceiptModal({ sale, onClose }: ReceiptModalProps) {
  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white text-slate-900 border border-slate-300 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative">
        
        {/* Header Controls */}
        <div className="px-6 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between no-print">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center">
            <Zap className="w-3.5 h-3.5 mr-1 text-amber-600" />
            Official POS Sales Voucher
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div id="printable-receipt" className="p-6 space-y-4">
          
          {/* Company Branding Banner */}
          <div className="text-center border-b border-slate-200 pb-4">
            <h2 className="text-xl font-extrabold font-heading text-[#0B192C] tracking-tight">
              WHITE DOVE ELECTRICAL
            </h2>
            <p className="text-xs font-bold text-amber-700 uppercase">
              & Engineering Company
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              446 Bai Bureh Road, Wellington, Freetown, Sierra Leone
            </p>
            <p className="text-[10px] text-slate-500">
              Tel: +232 79 419 105 / +232 34 592 373
            </p>
          </div>

          {/* Transaction Metadata */}
          <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex justify-between">
              <span>Receipt No:</span>
              <strong className="font-mono text-slate-900">{sale.id.slice(-8).toUpperCase()}</strong>
            </div>
            <div className="flex justify-between">
              <span>Date & Time:</span>
              <strong className="text-slate-900">{new Date(sale.sold_at).toLocaleString()}</strong>
            </div>
            <div className="flex justify-between">
              <span>Issued By:</span>
              <strong className="text-slate-900">{sale.seller_name}</strong>
            </div>
            <div className="flex justify-between">
              <span>Customer:</span>
              <strong className="text-slate-900">{sale.customer_name}</strong>
            </div>
            <div className="flex justify-between">
              <span>Payment Method:</span>
              <span className="bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded text-[10px]">
                {sale.payment_method}
              </span>
            </div>
          </div>

          {/* Line Item Table */}
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-300 text-slate-500 uppercase text-[10px]">
                <th className="py-1">Description</th>
                <th className="py-1 text-center">Qty</th>
                <th className="py-1 text-right">Rate</th>
                <th className="py-1 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="py-2.5 font-bold text-slate-800">{sale.product_name}</td>
                <td className="py-2.5 text-center font-semibold">{sale.quantity_sold}</td>
                <td className="py-2.5 text-right font-mono">SLE {sale.rate_per_unit.toLocaleString()}</td>
                <td className="py-2.5 text-right font-mono font-bold text-slate-900">
                  SLE {sale.total_price.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Grand Total */}
          <div className="border-t-2 border-slate-900 pt-3 flex justify-between items-baseline">
            <span className="text-sm font-extrabold uppercase text-slate-800">Grand Total Paid:</span>
            <span className="text-xl font-extrabold text-[#0B192C] font-mono">
              SLE {sale.total_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Footer Note */}
          <div className="text-center pt-2 text-[10px] text-slate-500 border-t border-dashed border-slate-300 space-y-0.5">
            <p className="font-semibold text-slate-700">Thank you for doing business with White Dove Electrical!</p>
            <p>Powering Homes. Empowering Lives.</p>
            <p>Goods sold in good condition are non-refundable after 48 hours.</p>
          </div>

        </div>

      </div>
    </div>
  );
}
