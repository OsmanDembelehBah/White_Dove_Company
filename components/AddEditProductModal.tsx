"use client";

import { useState, useEffect } from "react";
import { useApp } from "../lib/store/app-store";
import { InventoryItem } from "../lib/types";

const CATEGORIES = [
  "Solar Energy",
  "CCTV & Security",
  "Wiring & Cables",
  "Breakers & Distribution",
  "Air Conditioning",
  "Lighting",
  "Power Accessories",
  "Tools & Equipment",
];

interface AddEditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: InventoryItem | null;
}

export default function AddEditProductModal({ isOpen, onClose, productToEdit }: AddEditProductModalProps) {
  const { addInventoryItem, updateInventoryItem } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [productName, setProductName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [stockQuantity, setStockQuantity] = useState(0);
  const [price, setPrice] = useState(0); // Changed from unit_price to price
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const [description, setDescription] = useState("");
  const [restockAmount, setRestockAmount] = useState(10);

  useEffect(() => {
    if (productToEdit) {
      setProductName(productToEdit.product_name || "");
      setSku(productToEdit.sku || "");
      setCategory(productToEdit.category || CATEGORIES[0]);
      setStockQuantity(productToEdit.stock_quantity || 0);
      setPrice(productToEdit.price || 0); // Changed from unit_price to price
      setLowStockThreshold(productToEdit.low_stock_threshold || 5);
      setDescription((productToEdit as any).description || "");
    } else {
      resetForm();
    }
  }, [productToEdit, isOpen]);

  const resetForm = () => {
    setProductName("");
    setSku("");
    setCategory(CATEGORIES[0]);
    setStockQuantity(0);
    setPrice(0);
    setLowStockThreshold(5);
    setDescription("");
    setRestockAmount(10);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!productName || !sku || price <= 0) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    const itemData = {
      product_name: productName,
      sku: sku,
      category: category,
      price: price,
      stock_quantity: stockQuantity,
      low_stock_threshold: lowStockThreshold,
      unit: "pcs",
      description: description,
    };

    let result;
    if (productToEdit) {
      result = await updateInventoryItem(productToEdit.id, itemData);
    } else {
      result = await addInventoryItem(itemData);
    }

    if (result.success) {
      resetForm();
      onClose();
    } else {
      setError(result.error || "Failed to save product");
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {productToEdit ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product Name *</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">SKU *</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price (SLE) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stock Quantity</label>
              <input
                type="number"
                min="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Low Stock Threshold</label>
              <input
                type="number"
                min="0"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Product description..."
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

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
              {loading ? "Saving..." : productToEdit ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
