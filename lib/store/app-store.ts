"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define types
export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: "manager" | "seller";
  avatar?: string;
}

export interface InventoryItem {
  id: string;
  product_name: string;
  sku: string;
  category: string;
  price: number;
  stock_quantity: number;
  low_stock_threshold: number;
  unit: string;
  created_at: string;
  updated_at: string;
}

export interface SaleTransaction {
  id: string;
  seller_id: string;
  seller_name: string;
  product_id: string;
  product_name: string;
  quantity_sold: number;
  rate_per_unit: number;
  total_price: number;
  customer_name: string;
  payment_method: string;
  sold_at: string;
}

// Sample data
const INITIAL_PROFILES: Profile[] = [
  { id: "1", full_name: "Admin Manager", email: "admin@whitedove.com", role: "manager" },
  { id: "2", full_name: "Mariama Sesay", email: "mariama@whitedove.com", role: "manager" },
  { id: "3", full_name: "Mohamed Bangura", email: "mohamed@whitedove.com", role: "seller" },
  { id: "4", full_name: "Sorie Kamara", email: "sorie@whitedove.com", role: "seller" },
];

const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: "1",
    product_name: "400W Solar Panel",
    sku: "SOL-400W",
    category: "Solar",
    price: 1850,
    stock_quantity: 24,
    low_stock_threshold: 5,
    unit: "pcs",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    product_name: "5kVA Hybrid Inverter",
    sku: "INV-5KVA",
    category: "Solar",
    price: 5400,
    stock_quantity: 8,
    low_stock_threshold: 3,
    unit: "pcs",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const INITIAL_SALES: SaleTransaction[] = [
  {
    id: "s1",
    seller_id: "3",
    seller_name: "Mohamed Bangura",
    product_id: "1",
    product_name: "400W Solar Panel",
    quantity_sold: 2,
    rate_per_unit: 1850,
    total_price: 3700,
    customer_name: "Kallon Construction Ltd",
    payment_method: "Cash",
    sold_at: new Date().toISOString(),
  },
];

// Define the context type
interface AppContextType {
  profiles: Profile[];
  currentProfile: Profile;
  setCurrentProfile: (profile: Profile) => void;
  inventory: InventoryItem[];
  sales: SaleTransaction[];
  realtimeToast: { sale: SaleTransaction; id: string } | null;
  dismissToast: () => void;
  isRealtimeActive: boolean;
  logSale: (saleData: any) => Promise<{ success: boolean; sale?: SaleTransaction; error?: string }>;
  addInventoryItem: (itemData: any) => Promise<{ success: boolean; error?: string }>;
  updateInventoryItem: (id: string, itemData: any) => Promise<{ success: boolean; error?: string }>;
  restockProduct: (id: string, additionalStock: number) => Promise<{ success: boolean; error?: string }>;
  deleteInventoryItem: (id: string) => Promise<{ success: boolean; error?: string }>;
  resetSeedData: () => void;
  sellerDailyRevenue: number;
  sellerDailySalesCount: number;
  totalDailyRevenue: number;
  totalDailyItemsSold: number;
  activeSellersCount: number;
  lowStockCount: number;
}

// CREATE the context (this is the key fix - exporting it)
export const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [profiles] = useState<Profile[]>(INITIAL_PROFILES);
  const [currentProfile, setCurrentProfile] = useState<Profile>(INITIAL_PROFILES[2]);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [sales, setSales] = useState<SaleTransaction[]>(INITIAL_SALES);
  const [realtimeToast, setRealtimeToast] = useState<{ sale: SaleTransaction; id: string } | null>(null);
  const [isRealtimeActive] = useState<boolean>(true);

  const dismissToast = () => setRealtimeToast(null);

  const logSale = async (saleData: any) => {
    const product = inventory.find((item) => item.id === saleData.product_id);
    if (!product) {
      return { success: false, error: "Product not found" };
    }
    if (product.stock_quantity < saleData.quantity_sold) {
      return { success: false, error: "Insufficient stock" };
    }

    const newSale: SaleTransaction = {
      id: `sale-${Date.now()}`,
      seller_id: currentProfile.id,
      seller_name: currentProfile.full_name,
      product_id: product.id,
      product_name: product.product_name,
      quantity_sold: saleData.quantity_sold,
      rate_per_unit: saleData.rate_per_unit,
      total_price: saleData.quantity_sold * saleData.rate_per_unit,
      customer_name: saleData.customer_name || "Walk-in Customer",
      payment_method: saleData.payment_method || "Cash",
      sold_at: new Date().toISOString(),
    };

    setInventory((prev) =>
      prev.map((item) =>
        item.id === product.id
          ? { ...item, stock_quantity: item.stock_quantity - saleData.quantity_sold }
          : item
      )
    );

    setSales((prev) => [newSale, ...prev]);
    setRealtimeToast({ sale: newSale, id: `${Date.now()}` });

    return { success: true, sale: newSale };
  };

  const addInventoryItem = async (itemData: any) => {
    const newItem: InventoryItem = {
      ...itemData,
      id: `prod-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setInventory((prev) => [newItem, ...prev]);
    return { success: true };
  };

  const updateInventoryItem = async (id: string, itemData: any) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...itemData } : item))
    );
    return { success: true };
  };

  const restockProduct = async (id: string, additionalStock: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, stock_quantity: item.stock_quantity + additionalStock } : item
      )
    );
    return { success: true };
  };

  const deleteInventoryItem = async (id: string) => {
    setInventory((prev) => prev.filter((item) => item.id !== id));
    return { success: true };
  };

  const resetSeedData = () => {
    setInventory(INITIAL_INVENTORY);
    setSales(INITIAL_SALES);
  };

  // Computed metrics
  const todayStr = new Date().toISOString().split("T")[0];
  const sellerTodaySales = sales.filter((s) => {
    const saleDateStr = new Date(s.sold_at).toISOString().split("T")[0];
    return s.seller_id === currentProfile.id && saleDateStr === todayStr;
  });

  const sellerDailyRevenue = sellerTodaySales.reduce((acc, curr) => acc + curr.total_price, 0);
  const sellerDailySalesCount = sellerTodaySales.reduce((acc, curr) => acc + curr.quantity_sold, 0);

  const todayAllSales = sales.filter((s) => {
    const saleDateStr = new Date(s.sold_at).toISOString().split("T")[0];
    return saleDateStr === todayStr;
  });

  const totalDailyRevenue = todayAllSales.reduce((acc, curr) => acc + curr.total_price, 0);
  const totalDailyItemsSold = todayAllSales.reduce((acc, curr) => acc + curr.quantity_sold, 0);
  const activeSellersCount = new Set(todayAllSales.map((s) => s.seller_id)).size || 1;
  const lowStockCount = inventory.filter((item) => item.stock_quantity <= item.low_stock_threshold).length;

  const contextValue = {
    profiles,
    currentProfile,
    setCurrentProfile,
    inventory,
    sales,
    realtimeToast,
    dismissToast,
    isRealtimeActive,
    logSale,
    addInventoryItem,
    updateInventoryItem,
    restockProduct,
    deleteInventoryItem,
    resetSeedData,
    sellerDailyRevenue,
    sellerDailySalesCount,
    totalDailyRevenue,
    totalDailyItemsSold,
    activeSellersCount,
    lowStockCount,
  };

  // Use the exported AppContext here
  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

// Hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
