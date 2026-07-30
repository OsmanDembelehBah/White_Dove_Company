'use client';

import React, { useState, useEffect } from 'react';
import { InventoryItem } from '@/lib/supabase/types';
import { useApp } from '@/lib/store/app-store';
import { X, PackagePlus, Edit3, PlusCircle, CheckCircle, AlertCircle } from 'lucide-react';

interface AddEditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: InventoryItem | null;
  mode?: 'add' | 'edit' | 'restock';
}

const CATEGORIES = [
  'Solar Energy',
  'CCTV & Security',
  'Wiring & Cables',
  'Breakers & Distribution',
  'Air Conditioning',
  'Lighting & Fixtures',
  'Power Accessories',
  'Tools & Equipment',
];

export default function AddEditProductModal({
  isOpen,
  onClose,
  productToEdit,
  mode = 'add',
}: AddEditProductModalProps) {
  const { addInventoryItem, updateInventoryItem, restockProduct } = useApp();

  const [productName, setProductName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [stockQuantity, setStockQuantity] = useState(10);
  const [unitPrice, setUnitPrice] = useState(100.0);
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const [description, setDescription] = useState('');
  const [restockAmount, setRestockAmount] = useState(10);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (productToEdit && mode !== 'add') {
      setProductName(productToEdit.product_name);
      setSku(productToEdit.sku || '');
      setCategory(productToEdit.category || CATEGORIES[0]);
      setStockQuantity(productToEdit.stock_quantity);
      setUnitPrice(productToEdit.unit_price);
      setLowStockThreshold(productToEdit.low_stock_threshold || 5);
      setDescription(productToEdit.description || '');
      setRestockAmount(10);
    } else {
      setProductName('');
      setSku('');
      setCategory(CATEGORIES[0]);
      setStockQuantity(10);
      setUnitPrice(150.0);
      setLowStockThreshold(5);
      setDescription('');
      setRestockAmount(10);
    }
    setErrorMsg(null);
  }, [productToEdit, mode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      if (mode === 'restock' && productToEdit) {
        if (restockAmount <= 0) {
          setErrorMsg('Restock quantity must be greater than 0');
          setIsSubmitting(false);
          return;
        }
        await restockProduct(productToEdit.id, restockAmount);
      } else if (mode === 'edit' && productToEdit) {
        await updateInventoryItem(productToEdit.id, {
          product_name: productName,
          sku,
          category,
          stock_quantity: stockQuantity,
          unit_price: unitPrice,
          low_stock_threshold: lowStockThreshold,
          description,
        });
      } else {
        // Add new
        if (!productName.trim()) {
          setErrorMsg('Product name is required');
          setIsSubmitting(false);
          return;
        }
        await addInventoryItem({
          product_name: productName,
          sku: sku || `SKU-${Date.now().toString().slice(-6)}`,
          category,
          stock_quantity: Number(stockQuantity),
          unit_price: Number(unitPrice),
          low_stock_threshold: Number(lowStockThreshold),
          description,
        });
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while saving product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0F233D] border border-whitedove-slate w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative text-slate-100">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#07101E] border-b border-whitedove-slate flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-400">
              {mode === 'restock' ? (
                <PlusCircle className="w-5 h-5" />
              ) : mode === 'edit' ? (
                <Edit3 className="w-5 h-5" />
              ) : (
                <PackagePlus className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading text-white">
                {mode === 'restock'
                  ? `Quick Restock Inventory`
                  : mode === 'edit'
                  ? `Edit Product Details`
                  : `Add New Electrical Product`}
              </h3>
              <p className="text-xs text-slate-400">Executive Manager Inventory Control</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-whitedove-slate/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {mode === 'restock' && productToEdit ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#07101E] border border-whitedove-slate/80">
                <p className="text-xs text-slate-400 font-bold uppercase">{productToEdit.category}</p>
                <h4 className="text-base font-bold text-white">{productToEdit.product_name}</h4>
                <div className="mt-2 text-xs flex justify-between text-slate-300">
                  <span>Current Stock: <strong className="text-amber-400">{productToEdit.stock_quantity} units</strong></span>
                  <span>Unit Price: <strong>SLE {productToEdit.unit_price.toLocaleString()}</strong></span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Additional Stock Quantity to Add
                </label>
                <input
                  type="number"
                  min="1"
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 bg-[#07101E] border border-whitedove-slate rounded-xl text-white font-bold text-lg focus:outline-none focus:border-blue-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  New Stock total after restock will be: <strong className="text-emerald-400">{productToEdit.stock_quantity + restockAmount} units</strong>.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Product Name & SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g. 400W Monocrystalline Solar Panel"
                    className="w-full px-3 py-2 bg-[#07101E] border border-whitedove-slate rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="SOL-400W"
                    className="w-full px-3 py-2 bg-[#07101E] border border-whitedove-slate rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Category & Unit Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#07101E] border border-whitedove-slate rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Unit Price (SLE) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-[#07101E] border border-whitedove-slate rounded-xl text-xs font-bold text-amber-300 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Initial Stock & Low Stock Threshold */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Initial Stock Qty *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-[#07101E] border border-whitedove-slate rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(parseInt(e.target.value) || 5)}
                    className="w-full px-3 py-2 bg-[#07101E] border border-whitedove-slate rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Description / Specification
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional item details or technical specs..."
                  className="w-full px-3 py-2 bg-[#07101E] border border-whitedove-slate rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-whitedove-slate/50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-whitedove-slate bg-transparent text-slate-300 text-xs font-semibold hover:bg-whitedove-slate/40 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-whitedove-blue hover:from-blue-500 hover:to-whitedove-blue text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : mode === 'restock' ? 'Confirm Restock' : 'Save Product'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
