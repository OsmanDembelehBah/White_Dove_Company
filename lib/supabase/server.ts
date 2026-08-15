import { createClient } from '@supabase/supabase-js';

// Use environment variables with fallbacks for testing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://your-project.supabase.co' && 
         supabaseAnonKey !== 'your-anon-key';
};

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Database types
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          role: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          role?: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          role?: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      inventory: {
        Row: {
          id: string;
          product_name: string;
          sku: string;
          category: string;
          price: number;
          stock_quantity: number;
          low_stock_threshold: number;
          unit: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_name: string;
          sku: string;
          category: string;
          price: number;
          stock_quantity: number;
          low_stock_threshold?: number;
          unit?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_name?: string;
          sku?: string;
          category?: string;
          price?: number;
          stock_quantity?: number;
          low_stock_threshold?: number;
          unit?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      sales: {
        Row: {
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
          created_at: string;
        };
        Insert: {
          id?: string;
          seller_id: string;
          seller_name: string;
          product_id: string;
          product_name: string;
          quantity_sold: number;
          rate_per_unit: number;
          total_price: number;
          customer_name?: string;
          payment_method?: string;
          sold_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          seller_id?: string;
          seller_name?: string;
          product_id?: string;
          product_name?: string;
          quantity_sold?: number;
          rate_per_unit?: number;
          total_price?: number;
          customer_name?: string;
          payment_method?: string;
          sold_at?: string;
          created_at?: string;
        };
      };
    };
  };
};
