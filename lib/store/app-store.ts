"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Profile, InventoryItem, SaleTransaction } from "../supabase/types";
import { INITIAL_PROFILES, INITIAL_INVENTORY, INITIAL_SALES } from "./seed-data";
import { isSupabaseConfigured, supabase } from "../supabase/client";

interface AppContextType {
  profiles: Profile[];
  currentProfile: Profile;
  setCurrentProfile: (profile: Profile) => void;
  inventory: InventoryItem[];
  sales: SaleTransaction[];
  realtimeToast: { sale: SaleTransaction; id: string } | null;
  dismissToast: () => void;
  isRealtimeActive: boolean;
  logSale: (saleData: {
    product_id: string;
    quantity_sold: number;
    rate_per_unit: number;
    customer_name?: string;
    payment_method?: "Cash" | "Orange Money" | "Afrimoney" | "Bank Transfer" | "Credit";
  }) => Promise<{ success: boolean; sale?: SaleTransaction; error?: string }>;
  addInventoryItem: (itemData: Omit<InventoryItem, "id" | "created_at" | "updated_at">) => Promise<{ success: boolean; error?: string }>;
  updateInventoryItem: (id: string, itemData: Partial<InventoryItem>) => Promise<{ success: boolean; error?: string }>;
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

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_INVENTORY = "whitedove_inventory_v1";
const LOCAL_STORAGE_KEY_SALES = "whitedove_sales_v1";
const BROADCAST_CHANNEL_NAME = "whitedove_realtime_sales";

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles] = useState<Profile[]>(INITIAL_PROFILES);
  const [currentProfile, setCurrentProfile] = useState<Profile>(INITIAL_PROFILES[2]);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [sales, setSales] = useState<SaleTransaction[]>(INITIAL_SALES);
  const [realtimeToast, setRealtimeToast] = useState<{ sale: SaleTransaction; id: string } | null>(null);
  const [isRealtimeActive, setIsRealtimeActive] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedInventory = localStorage.getItem(LOCAL_STORAGE_KEY_INVENTORY);
      if (savedInventory) {
        try { setInventory(JSON.parse(savedInventory)); } catch (e) { console.error(e); }
      }
      const savedSales = localStorage.getItem(LOCAL_STORAGE_KEY_SALES);
      if (savedSales) {
        try { setSales(JSON.parse(savedSales)); } catch (e) { console.error(e); }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY_INVENTORY, JSON.stringify(inventory));
    }
  }, [inventory]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY_SALES, JSON.stringify(sales));
    }
  }, [sales]);

  useEffect(() => {
    let channel: any = null;
    let bc: BroadcastChannel | null = null;

    if (isSupabaseConfigured()) {
      setIsRealtimeActive(true);
      channel = supabase
        .channel("public:sales")
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "sales" }, (payload) => {
          const newSale = payload.new as SaleTransaction;
          setSales((prev) => [newSale, ...prev]);
          setInventory((prev) =>
            prev.map((item) =>
              item.id === newSale.product_id
                ? { ...item, stock_quantity: Math.max(0, item.stock_quantity - newSale.quantity_sold) }
                : item
            )
          );
          setRealtimeToast({ sale: newSale, id: `${Date.now()}-${Math.random()}` });
        })
        .subscribe();
    } else {
      setIsRealtimeActive(true);
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        bc.onmessage = (event) => {
          if (event.data && event.data.type === "NEW_SALE") {
            const newSale = event.data.sale as SaleTransaction;
            setSales((prev) => [newSale, ...prev]);
            setInventory((prev) =>
              prev.map((item) =>
                item.id === newSale.product_id
                  ? { ...item, stock_quantity: Math.max(0, item.stock_quantity - newSale.quantity_sold) }
                  : item
              )
            );
            setRealtimeToast({ sale: newSale, id: `${Date.now()}-${Math.random()}` });
          }
        };
      }
    }

    return () => {
      if (channel) supabase.removeChannel(channel);
      if (bc) bc.close();
    };
  }, []);

  const dismissToast = () => setRealtimeToast(null);

  const logSale = async (saleData: {
    product_id: string;
    quantity_sold: number;
    rate_per_unit: number;
    customer_name?: string;
    payment_method?: "Cash" | "Orange Money" | "Afrimoney" | "Bank Transfer" | "Credit";
  }) => {
    const product = inventory.find((item) => item.id === saleData.product_id);
    if (!product) {
      return { success: false, error: "Selected electrical product not found" };
    }
    if (product.stock_quantity < saleData.quantity_sold) {
      return {
        success: false,
        error: `Insufficient stock! Only ${product.stock_quantity} unit(s) available for ${product.product_name}.`,
      };
    }

    const total_price = Number((saleData.quantity_sold * saleData.rate_per_unit).toFixed(2));
    const newSale: SaleTransaction = {
      id: `sale-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      seller_id: currentProfile.id,
      seller_name: currentProfile.full_name,
      product_id: product.id,
      product_name: product.product_name,
      quantity_sold: saleData.quantity_sold,
      rate_per_unit: saleData.rate_per_unit,
      total_price,
      customer_name: saleData.customer_name || "Walk-in Customer",
      payment_method: saleData.payment_method || "Cash",
      sold_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from("sales").insert({
          seller_id: currentProfile.id,
          seller_name: currentProfile.full_name,
          product_id: product.id,
          product_name: product.product_name,
          quantity_sold: saleData.quantity_sold,
          rate_per_unit: saleData.rate_per_unit,
          total_price,
          customer_name: newSale.customer_name,
          payment_method: newSale.payment_method,
        });
        if (error) console.error("Supabase Sale Insert Error:", error);
      } catch (err) {
        console.error("Supabase error:", err);
      }
    }

    setInventory((prev) =>
      prev.map((item) =>
        item.id === product.id
          ? { ...item, stock_quantity: item.stock_quantity - saleData.quantity_sold, updated_at: new Date().toISOString() }
          : item
      )
    );

    setSales((prev) => [newSale, ...prev]);

    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      const bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      bc.postMessage({ type: "NEW_SALE", sale: newSale });
      bc.close();
    }

    setRealtimeToast({ sale: newSale, id: `${Date.now()}-${Math.random()}` });
    return { success: true, sale: newSale };
  };

  const addInventoryItem = async (itemData: Omit<InventoryItem, "id" | "created_at" | "updated_at">) => {
    const newItem: InventoryItem = {
      ...itemData,
      id: `prod-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setInventory((prev) => [newItem, ...prev]);
    return { success: true };
  };

  const updateInventoryItem = async (id: string, itemData: Partial<InventoryItem>) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...itemData, updated_at: new Date().toISOString() } : item))
    );
    return { success: true };
  };

  const restockProduct = async (id: string, additionalStock: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, stock_quantity: item.stock_quantity + additionalStock, updated_at: new Date().toISOString() }
          : item
      )
    );
    return { success: true };
  };

  const deleteInventoryItem = async (id: string) => {
    setInventory((prev) => prev.filter((item) => item.id !== id));
    return { success: true };
  };

  const resetSeedData = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_STORAGE_KEY_INVENTORY);
      localStorage.removeItem(LOCAL_STORAGE_KEY_SALES);
    }
    setInventory(INITIAL_INVENTORY);
    setSales(INITIAL_SALES);
  };

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

  const activeSellersSet = new Set(todayAllSales.map((s) => s.seller_id));
  const activeSellersCount = activeSellersSet.size || (sales.length > 0 ? 2 : 1);

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

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
