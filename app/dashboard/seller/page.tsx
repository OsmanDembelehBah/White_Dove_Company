'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store/app-store';
import { InventoryItem, SaleTransaction } from '@/lib/supabase/types';
import LogSaleModal from '@/components/LogSaleModal';
import ReceiptModal from '@/components/ReceiptModal';
import { 
  Search, 
  ShoppingCart, 
  DollarSign, 
  Package, 
  Clock, 
  UserCheck, 
  Printer, 
  Zap, 
  Filter,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Plus
} from 'lucide-react';

const CATEGORIES = [
  'All Equipment',
  'Solar Energy',
  'CCTV & Security',
  'Wiring & Cables',
  'Breakers & Distribution',
  'Air Conditioning',
  'Lighting & Fixtures',
  'Power Accessories',
];

export default function SellerDashboard() {
  const { 
    currentProfile, 
    inventory, 
    sales, 
    sellerDailyRevenue, 
    sellerDailySalesCount 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Equipment');
  const [selectedProductForSale, setSelectedProductForSale] = useState<InventoryItem | null>(null);
  const [selectedReceiptSale, setSelectedReceiptSale] = useState<SaleTransaction | null>(null);

  // Filter Inventory based on Search Term & Category
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All Equipment' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Active seller's recent transactions today
  const todayStr = new Date().toISOString().split('T')[0];
  const sellerTodaySales = sales.filter((s) => {
    const saleDateStr = new Date(s.sold_at).toISOString().split('T')[0];
    return s.seller_id === currentProfile.id && saleDateStr === todayStr;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#0F233D] via-[#112846] to-[#07101E] border border-whitedove-slate shadow-xl">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-lg shadow-lg shadow-amber-500/20">
            {currentProfile.full_name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold font-heading text-white">{currentProfile.full_name} POS Terminal</h1>
              <span className="bg-amber-500/20 text-amber-300 text-xs px-2.5 py-0.5 rounded-full font-bold border border-amber-500/30">
                Seller Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              White Dove Electrical & Engineering POS • Daily Personal Performance Tracker
            </p>
          </div>
        </div>

        {/* Daily Personal Summary Metric Cards */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="bg-[#07101E] px-4 py-2.5 rounded-2xl border border-whitedove-slate/80 text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Today's Revenue</span>
            <span className="text-lg font-extrabold text-amber-400 font-heading">
              SLE {sellerDailyRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="bg-[#07101E] px-4 py-2.5 rounded-2xl border border-whitedove-slate/80 text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Items Sold Today</span>
            <span className="text-lg font-extrabold text-slate-100 font-heading">
              {sellerDailySalesCount} units
            </span>
          </div>
        </div>
      </div>

      {/* Main POS Interface Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Stock Lookup & Product Grid */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Live Search & Category Filter Header */}
          <div className="space-y-4">
            
            {/* Live Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5 text-amber-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Live Search stock (Solar Panels, CCTV, 2.5mm Wire, Breakers, AC Units, SKU...)"
                className="w-full pl-12 pr-4 py-3.5 bg-[#0F233D] border border-whitedove-slate rounded-2xl text-white font-medium text-sm placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-xl transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                      : 'bg-[#0F233D] text-slate-300 border border-whitedove-slate hover:border-amber-500/40 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>

          {/* Product Grid */}
          <div>
            <div className="flex justify-between items-center mb-3 text-xs text-slate-400 font-bold uppercase tracking-wider">
              <span>Electrical Stock Catalog ({filteredInventory.length} items found)</span>
              <span>Click item to Log Sale</span>
            </div>

            {filteredInventory.length === 0 ? (
              <div className="p-12 text-center bg-[#0F233D] border border-whitedove-slate rounded-3xl space-y-3">
                <Package className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-lg font-bold text-white">No electrical equipment found</h3>
                <p className="text-xs text-slate-400">Try adjusting your search criteria or category filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredInventory.map((item) => {
                  const isOutOfStock = item.stock_quantity === 0;
                  const isLowStock = item.stock_quantity > 0 && item.stock_quantity <= item.low_stock_threshold;

                  return (
                    <div
                      key={item.id}
                      onClick={() => !isOutOfStock && setSelectedProductForSale(item)}
                      className={`p-5 rounded-2xl bg-[#0F233D] border transition-all duration-200 flex flex-col justify-between relative group ${
                        isOutOfStock
                          ? 'border-red-900/50 opacity-60 cursor-not-allowed'
                          : isLowStock
                          ? 'border-amber-500/60 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10 cursor-pointer'
                          : 'border-whitedove-slate hover:border-blue-500/60 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer'
                      }`}
                    >
                      <div>
                        {/* Header: Category & Stock Badge */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            {item.category}
                          </span>

                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center space-x-1 ${
                            isOutOfStock
                              ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                              : isLowStock
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          }`}>
                            {isOutOfStock ? (
                              <>
                                <XCircle className="w-3 h-3 mr-0.5 text-red-400" />
                                <span>Out of Stock</span>
                              </>
                            ) : isLowStock ? (
                              <>
                                <AlertTriangle className="w-3 h-3 mr-0.5 text-amber-300" />
                                <span>{item.stock_quantity} Left (Low)</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-3 h-3 mr-0.5 text-emerald-400" />
                                <span>{item.stock_quantity} In Stock</span>
                              </>
                            )}
                          </span>
                        </div>

                        {/* Product Title & SKU */}
                        <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                          {item.product_name}
                        </h4>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">SKU: {item.sku}</p>
                        
                        {item.description && (
                          <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>

                      {/* Bottom Footer: Price & Sell Action Button */}
                      <div className="mt-4 pt-3 border-t border-whitedove-slate/60 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase font-bold">Unit Rate</span>
                          <span className="text-lg font-extrabold text-amber-400 font-heading">
                            SLE {item.unit_price.toLocaleString()}
                          </span>
                        </div>

                        <button
                          disabled={isOutOfStock}
                          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                            isOutOfStock
                              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                              : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md group-hover:scale-105'
                          }`}
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>{isOutOfStock ? 'Sold Out' : 'Log Sale'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Daily Seller Activity & Voucher History */}
        <div className="space-y-6">
          
          <div className="bg-[#0F233D] border border-whitedove-slate rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-whitedove-slate/80 pb-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold font-heading text-white">Your Logged Sales Today</h3>
              </div>
              <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                {sellerTodaySales.length} Logged
              </span>
            </div>

            {sellerTodaySales.length === 0 ? (
              <div className="py-8 text-center text-slate-400 space-y-2">
                <ShoppingCart className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-xs">No sales recorded by you yet today.</p>
                <p className="text-[11px] text-slate-500">Select any item from the catalog on the left to complete your first transaction.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {sellerTodaySales.map((sale) => (
                  <div
                    key={sale.id}
                    className="p-3.5 rounded-2xl bg-[#07101E] border border-whitedove-slate/60 hover:border-amber-500/40 transition-all text-xs space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-white line-clamp-1">{sale.product_name}</span>
                      <span className="text-amber-400 font-extrabold font-heading">
                        SLE {sale.total_price.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>{sale.quantity_sold} units @ SLE {sale.rate_per_unit.toLocaleString()}</span>
                      <span>{new Date(sale.sold_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">Customer: <strong className="text-slate-200">{sale.customer_name}</strong> ({sale.payment_method})</span>
                      <button
                        onClick={() => setSelectedReceiptSale(sale)}
                        className="flex items-center space-x-1 text-amber-400 hover:text-amber-300 font-bold"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Print Receipt</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* White Dove Help & Emergency Contacts Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-[#07101E] to-[#0D1D33] border border-amber-500/30 space-y-2 text-xs text-slate-300">
            <span className="text-amber-400 font-bold uppercase tracking-wider block text-[10px]">
              White Dove Counter Support
            </span>
            <p className="font-semibold text-white">Stock Discrepancy or Price Override Question?</p>
            <p className="text-[11px] text-slate-400">
              Call CEO Achmed Thoronka (+232 79 419 105) or Operations Manager Mariama Sesay (+232 34 592 373).
            </p>
          </div>

        </div>

      </div>

      {/* Log Sale Modal */}
      <LogSaleModal
        isOpen={Boolean(selectedProductForSale)}
        onClose={() => setSelectedProductForSale(null)}
        selectedProduct={selectedProductForSale}
      />

      {/* Printable Receipt Modal */}
      <ReceiptModal
        sale={selectedReceiptSale}
        onClose={() => setSelectedReceiptSale(null)}
      />

    </div>
  );
}
