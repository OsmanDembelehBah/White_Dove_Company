// Export types from the server
export type { Database } from './server';

// Define payment method type
export type PaymentMethod = "Cash" | "Orange Money" | "Afrimoney" | "Bank Transfer" | "Credit";

// Profile type
export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: "manager" | "seller";
  avatar?: string;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Inventory Item type
export interface InventoryItem {
  id: string;
  product_name: string;
  sku: string;
  category: string;
  price: number;
  stock_quantity: number;
  low_stock_threshold: number;
  unit: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

// Sale Transaction type
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
  payment_method: PaymentMethod;
  sold_at: string;
  created_at?: string;
}
