-- Link customers to Supabase Auth users
ALTER TABLE customers ADD COLUMN auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE customers ADD COLUMN email TEXT;
ALTER TABLE customers ALTER COLUMN phone DROP NOT NULL;
ALTER TABLE customers ALTER COLUMN phone DROP DEFAULT;
ALTER TABLE customers DROP CONSTRAINT IF EXISTS customers_phone_key;
ALTER TABLE customers ADD CONSTRAINT customers_phone_key UNIQUE (phone);

-- Saved delivery addresses per customer
CREATE TABLE customer_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  label TEXT DEFAULT 'Home',       -- Home, Office, Other
  recipient_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  district TEXT NOT NULL,
  area TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wishlist items per customer
CREATE TABLE wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (customer_id, product_id)
);

-- Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own row" ON customers
  FOR SELECT USING (auth.uid() = auth_user_id);
CREATE POLICY "Customers can update own row" ON customers
  FOR UPDATE USING (auth.uid() = auth_user_id);
CREATE POLICY "Customers can insert own row" ON customers
  FOR INSERT WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "Customers manage own addresses" ON customer_addresses
  FOR ALL USING (
    customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Customers manage own wishlist" ON wishlist_items
  FOR ALL USING (
    customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Customers view own orders" ON orders
  FOR SELECT USING (
    customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Customers view own order items" ON order_items
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM orders WHERE customer_id IN (
        SELECT id FROM customers WHERE auth_user_id = auth.uid()
      )
    )
  );
