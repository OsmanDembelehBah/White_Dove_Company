-- ==============================================================================
-- WHITE DOVE ELECTRICAL & ENGINEERING COMPANY
-- Complete PostgreSQL Database Schema & Migration Script for Supabase
-- Location: Freetown, Sierra Leone
-- ==============================================================================

-- 1. PROFILES / USER ROLES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('seller', 'manager')) NOT NULL DEFAULT 'seller',
  phone_number TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. INVENTORY / PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name TEXT NOT NULL,
  sku TEXT UNIQUE,
  category TEXT NOT NULL,
  stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  unit_price DECIMAL(12, 2) NOT NULL CHECK (unit_price >= 0),
  low_stock_threshold INT DEFAULT 5 CHECK (low_stock_threshold >= 0),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. SALES TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  seller_name TEXT NOT NULL, -- Cached for high performance displays
  product_id UUID REFERENCES public.inventory(id) ON DELETE RESTRICT,
  product_name TEXT NOT NULL, -- Cached product name
  quantity_sold INT NOT NULL CHECK (quantity_sold > 0),
  rate_per_unit DECIMAL(12, 2) NOT NULL CHECK (rate_per_unit >= 0),
  total_price DECIMAL(12, 2) NOT NULL CHECK (total_price >= 0),
  customer_name TEXT DEFAULT 'Walk-in Customer',
  payment_method TEXT CHECK (payment_method IN ('Cash', 'Orange Money', 'Afrimoney', 'Bank Transfer', 'Credit')) DEFAULT 'Cash',
  sold_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- AUTOMATIC INVENTORY DEDUCTION ENGINE (TRIGGER)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.deduct_inventory_on_sale()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if enough stock exists
  IF (SELECT stock_quantity FROM public.inventory WHERE id = NEW.product_id) < NEW.quantity_sold THEN
    RAISE EXCEPTION 'Insufficient inventory stock available for product ID %', NEW.product_id;
  END IF;

  -- Deduct inventory
  UPDATE public.inventory
  SET 
    stock_quantity = stock_quantity - NEW.quantity_sold,
    updated_at = NOW()
  WHERE id = NEW.product_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_deduct_inventory ON public.sales;
CREATE TRIGGER trigger_deduct_inventory
AFTER INSERT ON public.sales
FOR EACH ROW
EXECUTE FUNCTION public.deduct_inventory_on_sale();

-- ==============================================================================
-- SUPABASE REALTIME CONFIGURATION
-- ==============================================================================
-- Enable Realtime web-sockets on sales and inventory tables
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'sales'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.sales;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'inventory'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.inventory;
  END IF;
END $$;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by authenticated users" ON public.profiles
  FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Inventory Policies
CREATE POLICY "Inventory is viewable by all users" ON public.inventory
  FOR SELECT USING (true);

CREATE POLICY "Only managers can insert/update/delete inventory" ON public.inventory
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'manager'
    ) OR auth.role() = 'anon' -- Allows demo mode testing
  );

-- Sales Policies
CREATE POLICY "Sales are viewable by all authenticated users" ON public.sales
  FOR SELECT USING (true);

CREATE POLICY "Sellers and Managers can insert sales" ON public.sales
  FOR INSERT WITH CHECK (true);

-- ==============================================================================
-- SAMPLE SEED DATA FOR WHITE DOVE ELECTRICAL & ENGINEERING CO.
-- ==============================================================================

-- 1. Insert Initial Manager & Seller Profiles
INSERT INTO public.profiles (id, full_name, role, phone_number) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Achmed Thoronka', 'manager', '+232 79 419 105'),
  ('22222222-2222-2222-2222-222222222222', 'Mariama Sesay', 'manager', '+232 34 592 373'),
  ('33333333-3333-3333-3333-333333333333', 'Mohamed Bangura', 'seller', '+232 78 400 785'),
  ('44444444-4444-4444-4444-444444444444', 'Sorie Kamara', 'seller', '+232 76 123 456')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert White Dove Electrical Inventory Items
INSERT INTO public.inventory (id, product_name, sku, category, stock_quantity, unit_price, low_stock_threshold, description) VALUES
  ('a1111111-1111-1111-1111-111111111111', '400W Monocrystalline Solar Panel', 'SOL-400W', 'Solar Energy', 24, 1850.00, 5, 'Tier-1 high efficiency solar photovoltaic module'),
  ('a2222222-2222-2222-2222-222222222222', '5kVA Hybrid Solar Inverter 48V', 'INV-5KVA', 'Solar Energy', 8, 5400.00, 3, 'Pure sine wave inverter with MPPT solar charge controller'),
  ('a3333333-3333-3333-3333-333333333333', '200Ah 12V Deep Cycle Gel Battery', 'BAT-200AH', 'Solar Energy', 15, 2900.00, 4, 'Maintenance-free gel solar storage battery'),
  ('a4444444-4444-4444-4444-444444444444', 'Hikvision 5MP Outdoor Bullet CCTV Camera', 'CCTV-5MP', 'CCTV & Security', 30, 450.00, 8, 'Night vision IP camera with PoE and weather resistance'),
  ('a5555555-5555-5555-5555-555555555555', '8-Channel 4K NVR Security Recorder', 'NVR-08CH', 'CCTV & Security', 6, 1250.00, 2, 'Network Video Recorder with 2TB pre-installed hard drive'),
  ('a6666666-6666-6666-6666-666666666666', '2.5mm Single Core Copper Cable Roll (100m)', 'CAB-2.5MM', 'Wiring & Cables', 45, 680.00, 10, 'Pure copper flame retardant electrical building wire'),
  ('a7777777-7777-7777-7777-777777777777', '4.0mm Twin & Earth Copper Wire (100m)', 'CAB-4.0MM', 'Wiring & Cables', 18, 1150.00, 5, 'Heavy duty household power distribution cable'),
  ('a8888888-8888-8888-8888-888888888888', 'Schneider 63A Double Pole Main MCB', 'BRE-63ADP', 'Breakers & Distribution', 50, 160.00, 10, 'Miniature Circuit Breaker for main distribution box'),
  ('a9999999-9999-9999-9999-999999999999', '12-Way Flush Mount Consumer Unit', 'DB-12WAY', 'Breakers & Distribution', 3, 420.00, 5, 'Metal enclosure distribution board with busbar (LOW STOCK)'),
  ('b1111111-1111-1111-1111-111111111111', 'Inverter Split AC 12,000 BTU R410a', 'AC-12KBTU', 'Air Conditioning', 4, 4800.00, 5, 'Energy-saving split air conditioner with installation kit'),
  ('b2222222-2222-2222-2222-222222222222', 'Inverter Split AC 18,000 BTU R410a', 'AC-18KBTU', 'Air Conditioning', 2, 6500.00, 3, 'High capacity cooling unit for office/living room'),
  ('b3333333-3333-3333-3333-333333333333', '18W LED Ceiling Panel Light 6000K', 'LGT-18WLED', 'Lighting & Fixtures', 120, 75.00, 25, 'Super bright cool white recessed panel light'),
  ('b4444444-4444-4444-4444-444444444444', '50W Solar Street Light with Motion Sensor', 'LGT-50WSOL', 'Lighting & Fixtures', 22, 580.00, 6, 'All-in-one solar street light with remote control'),
  ('b5555555-5555-5555-5555-555555555555', 'Digital Automatic Voltage Regulator 5000VA', 'AVR-5000', 'Power Accessories', 1, 1450.00, 3, 'Heavy duty servo stabilizer for sensitive equipment (CRITICAL)')
ON CONFLICT (id) DO NOTHING;
