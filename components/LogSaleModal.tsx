"use client";

import { useState } from "react";
import { useApp } from "../lib/store/app-store";
import { PaymentMethod } from "../lib/types";

interface LogSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  currentStock: number;
}

export default function LogSaleModal({ isOpen, onClose, productId, productName, currentStock }: LogSaleModalProps) {
  const { logSale } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [rate, setRate] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Cash");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [completedSale, setCompletedSale] = useState<any>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    if (quantity > currentStock) {
      setErrorMsg(`Only ${currentStock} units available`);
      setLoading(false);
      return;
    }

    const result = await logSale({
      product_id: productId,
      quantity_sold: quantity,
      rate_per_unit: rate,
      customer_name: customerName || undefined,
      payment_method: paymentMethod,
    });

    if (result.success && result.sale) {
      setCompletedSale(result.sale);
    } else {
      setErrorMsg(result.error || "Failed to log sale. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Log Sale</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product</label>
              <p className="mt-1 text-gray-900 dark:text-white font-semibold">{productName}</p>
              <p className="text-sm text-gray-500">Stock: {currentStock} units</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity *</label>
              <input
                type="number"
                min="1"
                max={currentStock}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rate per Unit (SLE) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Walk-in Customer"
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="Cash">Cash</option>
                <option value="Orange Money">Orange Money</option>
                <option value="Afrimoney">Afrimoney</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Credit">Credit</option>
              </select>
            </div>
            {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Log Sale"}
              </button>
            </div>
          </div>
        </form>
        {completedSale && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-green-700 dark:text-green-400 font-semibold">✅ Sale Complete!</p>
            <p className="text-sm text-green-600 dark:text-green-300">Total: SLE {completedSale.total_price.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
