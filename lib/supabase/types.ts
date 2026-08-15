export type PaymentMethod =
  | "Cash"
  | "Orange Money"
  | "Afrimoney"
  | "Bank Transfer"
  | "Credit";

export interface Profile {
  id: string;
  full_name: string;
  email?: string;
  role: "manager" | "seller";
  phone_number?: string;
  avatar?: string;
}

export interface InventoryItem {
  id: string;
  product_name: string;
  sku: string;
  category: string;
  price?: number;
  unit_price: number;
  stock_quantity: number;
  low_stock_threshold: number;
  unit?: string;
  description?: string;
  created_at: string;
  updated_at?: string;
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
  payment_method: PaymentMethod;
  sold_at: string;
}
