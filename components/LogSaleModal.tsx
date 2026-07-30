'use client';

import React, { useState, useEffect } from 'react';
import { InventoryItem, SaleTransaction } from '@/lib/supabase/types';
import { useApp } from '@/lib/store/app-store';
import { 
  X, 
  ShoppingCart, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Minus, 
  Printer, 
  DollarSign, 
  User, 
  CreditCard, 
  Zap,
  Package
} from 'lucide-react';
import ReceiptModal from './ReceiptModal';

interface LogSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProduct: InventoryItem | null;
}

export default function LogSaleModal({ isOpen, onClose, selectedProduct }: LogSaleModalProps) {
  const { currentProfile, logSale } = useApp();
  
  const [quantity, setQuantity] = useState<number>(1);
  const [unitRate, setUnitRate] = useState<number>(0);
  const [customerName, setCustomerName] = useState<string>('Walk-in Customer');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Orange Money' | 'Afrimoney' | 'Bank Transfer' | 'Credit'>('Cash');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [completedSale, setCompletedSale] = useState<SaleTransaction | null>(null);

  useEffect(() => {
    if (selectedProduct) {
      setQuantity(1);
      setUnitRate(selectedProduct.unit_price);
      setErrorMsg(null);
      setCompletedSale(null);
    }
  }, [selectedProduct]);

  if (!isOpen || !selectedProduct) return null;

  const totalPrice = Number((quantity * unitRate).toFixed(2));
  const remainingStockAfterSale = selectedProduct.stock_quantity - quantity;

  const handleIncrement = () => {
    if (quantity < selectedProduct.stock_quantity) {
      setQuantity((prev) => prev + 1);
      setErrorMsg(null);
    } else {
      setErrorMsg(`Maximum available stock reached (${selectedProduct.stock_quantity})`);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
      setErrorMsg(null);
    }
  };

  const handleSubmitSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) {
      setErrorMsg('Quantity sold must be at least 1');
      return;
    }
    if (quantity > selectedProduct.stock_quantity) {
      setErrorMsg(`Cannot sell ${quantity} units. Only ${selectedProduct.stock_quantity} left in stock.`);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const result = await logSale({
      product_id: selectedProduct.id,
      quantity_sold: quantity,
      rate_per_unit: unitRate,
      customer_name: customerName,
      payment_method: paymentMethod,
    });

    setIsSubmitting(false);

    if (result.success && result.sale) {
      setCompletedSale(result.sale);
    } else {
      setErrorMsg(result.error || 'Failed to log sale. Please try again.');
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
        <div className="bg-[#0F233D] border border-whitedove-slate w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative text-slate-100">
          
          {/* Header */}
          <div className="px-6 py-4 bg-[#07101E] border-b border-whitedove-slate flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading text-white">Log Point-of-Sale Transaction</h3>
                <p className="text-xs text-slate-400">White Dove Electrical POS • Active Seller: <span className="text-amber-300 font-bold">{currentProfile.full_name}</span></p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-whitedove-slate/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* If Sale Completed -> Show Success & Receipt Modal option */}
          {completedSale ? (
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-bold font-heading text-white">Sale Successfully Recorded!</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Inventory automatically deducted by <span className="text-amber-400 font-bold">{completedSale.quantity_sold} unit(s)</span>.
                </p>
              </div>

              <div className="bg-[#07101E] p-4 rounded-xl border border-whitedove-slate/60 text-left space-y-2 text-sm">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Item Sold:</span>
                  <span className="font-semibold text-white">{completedSale.product_name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Quantity & Rate:</span>
                  <span className="font-semibold text-slate-200">{completedSale.quantity_sold} x SLE {completedSale.rate_per_unit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Customer & Payment:</span>
                  <span className="font-semibold text-slate-200">{completedSale.customer_name} ({completedSale.payment_method})</span>
                </div>
                <div className="flex justify-between pt-1 text-base">
                  <span className="font-bold text-amber-400">Total Amount:</span>
                  <span className="font-extrabold text-amber-300">SLE {completedSale.total_price.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-whitedove-slate bg-whitedove-slate/40 text-slate-200 font-semibold hover:bg-whitedove-slate text-sm transition-all"
                >
                  Done & Close
                </button>
              </div>
            </div>
          ) : (
            /* Sale Entry Form */
            <form onSubmit={handleSubmitSale} className="p-6 space-y-5">
              
              {/* Product Info Summary Box */}
              <div className="p-4 rounded-xl bg-[#07101E] border border-whitedove-slate/80 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                      {selectedProduct.category}
                    </span>
                    <h4 className="text-base font-bold text-white">{selectedProduct.product_name}</h4>
                    <p className="text-xs text-slate-400">SKU: {selectedProduct.sku}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      selectedProduct.stock_quantity === 0
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                        : selectedProduct.stock_quantity <= selectedProduct.low_stock_threshold
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {selectedProduct.stock_quantity} in stock
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between text-xs text-slate-300">
                  <span>Standard Price: <strong className="text-white">SLE {selectedProduct.unit_price.toLocaleString()}</strong></span>
                  <span>Stock after sale: <strong className={remainingStockAfterSale < 5 ? 'text-amber-400' : 'text-emerald-400'}>{remainingStockAfterSale} units</strong></span>
                </div>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Quantity Selector & Price Override */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Quantity Controls */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Quantity Sold
                  </label>
                  <div className="flex items-center border border-whitedove-slate rounded-xl overflow-hidden bg-[#07101E]">
                    <button
                      type="button"
                      onClick={handleDecrement}
                      className="p-3 text-slate-400 hover:text-white hover:bg-whitedove-slate/50 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={selectedProduct.stock_quantity}
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        setQuantity(val);
                      }}
                      className="w-full text-center bg-transparent font-bold text-white text-base focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleIncrement}
                      className="p-3 text-slate-400 hover:text-white hover:bg-whitedove-slate/50 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Rate per unit override */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Unit Rate (SLE)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      value={unitRate}
                      onChange={(e) => setUnitRate(parseFloat(e.target.value) || 0)}
                      className="w-full pl-9 pr-3 py-2.5 bg-[#07101E] border border-whitedove-slate rounded-xl text-white font-bold text-base focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

              </div>

              {/* Customer Name & Payment Method */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Customer / Company
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Walk-in Customer"
                      className="w-full pl-9 pr-3 py-2 bg-[#07101E] border border-whitedove-slate rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Payment Method
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="w-full pl-9 pr-3 py-2 bg-[#07101E] border border-whitedove-slate rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Cash">Cash</option>
                      <option value="Orange Money">Orange Money</option>
                      <option value="Afrimoney">Africell Afrimoney</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Credit">Credit / Account</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* Total Calculation Card */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#07101E] via-[#0D1D33] to-[#112440] border border-amber-500/40 flex items-center justify-between shadow-lg">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Sales Price</p>
                  <p className="text-2xl font-extrabold text-amber-400 font-heading">
                    SLE {totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Automatic Stock Deduction</span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center justify-end mt-0.5">
                    <Zap className="w-3.5 h-3.5 mr-1" /> Ready to Log
                  </span>
                </div>
              </div>

              {/* Submit Controls */}
              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-whitedove-slate bg-transparent text-slate-300 font-semibold hover:bg-whitedove-slate/40 text-sm transition-all"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || selectedProduct.stock_quantity === 0}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center space-x-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Processing Sale...</span>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Confirm & Record Sale</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </>
  );
}
