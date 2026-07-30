'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Database, Code, Terminal } from 'lucide-react';

interface SqlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SQL_SCHEMA = `-- ==============================================================================
-- WHITE DOVE ELECTRICAL & ENGINEERING COMPANY
-- Complete PostgreSQL Database Schema & Supabase Setup Script
-- Location: Freetown, Sierra Leone
-- ==============================================================================

-- 1. PROFILES / USER ROLES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('seller', 'manager')) NOT NULL DEFAULT 'seller',
  phone_number TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. INVENTORY / PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name TEXT NOT NULL,
  sku TEXT UNIQUE,
  category TEXT NOT NULL,
  stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  unit_price DECIMAL(12, 2) NOT NULL CHECK (unit_price >= 0),
  low_stock_threshold INT DEFAULT 5 CHECK (low_stock_threshold >= 0),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. SALES TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  seller_name TEXT NOT NULL,
  product_id UUID REFERENCES public.inventory(id) ON DELETE RESTRICT,
  product_name TEXT NOT NULL,
  quantity_sold INT NOT NULL CHECK (quantity_sold > 0),
  rate_per_unit DECIMAL(12, 2) NOT NULL CHECK (rate_per_unit >= 0),
  total_price DECIMAL(12, 2) NOT NULL CHECK (total_price >= 0),
  customer_name TEXT DEFAULT 'Walk-in Customer',
  payment_method TEXT CHECK (payment_method IN ('Cash', 'Orange Money', 'Afrimoney', 'Bank Transfer', 'Credit')) DEFAULT 'Cash',
  sold_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AUTOMATIC INVENTORY DEDUCTION ENGINE (TRIGGER)
CREATE OR REPLACE FUNCTION public.deduct_inventory_on_sale()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT stock_quantity FROM public.inventory WHERE id = NEW.product_id) < NEW.quantity_sold THEN
    RAISE EXCEPTION 'Insufficient stock for product ID %', NEW.product_id;
  END IF;

  UPDATE public.inventory
  SET 
    stock_quantity = stock_quantity - NEW.quantity_sold,
    updated_at = NOW()
  WHERE id = NEW.product_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_deduct_inventory ON public.sales;
CREATE TRIGGER trigger_deduct_inventory
AFTER INSERT ON public.sales
FOR EACH ROW
EXECUTE FUNCTION public.deduct_inventory_on_sale();

-- SUPABASE REALTIME CONFIGURATION
ALTER PUBLICATION supabase_realtime ADD TABLE public.sales;
ALTER PUBLICATION supabase_realtime ADD TABLE public.inventory;

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Inventory viewable by all" ON public.inventory FOR SELECT USING (true);
CREATE POLICY "Managers manage inventory" ON public.inventory FOR ALL USING (true);
CREATE POLICY "Sales viewable by all" ON public.sales FOR SELECT USING (true);
CREATE POLICY "Sales insertable by all" ON public.sales FOR INSERT WITH CHECK (true);
`;

export default function SqlModal({ isOpen, onClose }: SqlModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0F233D] border border-whitedove-slate w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden relative text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#07101E] border-b border-whitedove-slate flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading text-white">PostgreSQL / Supabase Migration SQL Script</h3>
              <p className="text-xs text-slate-400">White Dove Schema with RLS & Automatic Deduction Trigger</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors shadow-md"
            >
              {copied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-whitedove-slate/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SQL Content */}
        <div className="p-6 overflow-y-auto font-mono text-xs space-y-4 bg-[#07101E]">
          <div className="flex items-center justify-between text-slate-400 text-[11px] pb-2 border-b border-whitedove-slate/40">
            <span className="flex items-center">
              <Terminal className="w-3.5 h-3.5 mr-1 text-amber-400" />
              Copy & Paste into Supabase SQL Editor:
            </span>
            <span className="text-amber-400 font-bold">SQL Migration Ready</span>
          </div>

          <pre className="text-slate-200 p-4 rounded-xl bg-[#091526] border border-whitedove-slate/60 overflow-x-auto whitespace-pre leading-relaxed select-all">
            {SQL_SCHEMA}
          </pre>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-[#07101E] border-t border-whitedove-slate/60 text-xs text-slate-400 flex justify-between items-center">
          <span>Target Database: Supabase PostgreSQL</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-whitedove-slate/60 hover:bg-whitedove-slate text-slate-200 font-semibold"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
}
