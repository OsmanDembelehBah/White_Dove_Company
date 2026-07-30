export type UserRole = 'seller' | 'manager';

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  phone_number?: string;
  avatar_url?: string;
  created_at?: string;
}

export interface InventoryItem {
  id: string;
  product_name: string;
  sku: string;
  category: string;
  stock_quantity: number;
  unit_price: number;
  low_stock_threshold: number;
  description?: string;
  created_at?: string;
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
  payment_method: 'Cash' | 'Orange Money' | 'Afrimoney' | 'Bank Transfer' | 'Credit';
  sold_at: string;
}

export type RealtimeSalePayload = {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: SaleTransaction;
  old: Partial<SaleTransaction>;
};
