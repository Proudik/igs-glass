/*
# Create orders and order_items tables

## Overview
Creates the order management schema so that:
1. Checkout persists real orders to the database (replacing the current mock data)
2. Admins can view all orders and update their status
3. Customers can view their own order history in the account page
4. An admin-only RPC function updates status and returns order details so the
   frontend can trigger a notification email via Brevo

## New Tables

### orders
- id (uuid, PK)
- order_number (text, unique) — human-friendly reference e.g. IGS-240001
- user_id (uuid, nullable, refs auth.users) — null for guest checkouts
- status (text, default 'pending') — pending | processing | manufacturing | dispatched | delivered | cancelled
- customer_first_name, customer_last_name, customer_email, customer_phone, customer_company
- billing address fields
- delivery_method, delivery address fields
- payment_method, payment_status
- subtotal, vat_amount, delivery_amount, total (integer, pence)
- notes, status_history (jsonb)
- created_at, updated_at

### order_items
- id (uuid, PK)
- order_id (uuid, FK CASCADE)
- product_id (uuid, nullable, refs products)
- product_name, product_sku, quantity
- unit_price, total_price (integer, pence)
- width, length, height (nullable, mm)

## Security (RLS)
- orders: customers read own; admins read/update all
- order_items: customers read own (via parent order); admins read all
- INSERT: authenticated users insert own rows (user_id = auth.uid() or NULL for guest-linked)
- update_order_status: SECURITY DEFINER, admin-only, updates status + history

## Notes
1. Guest checkouts use the service role key through an edge function to insert orders.
2. Authenticated users can insert their own orders directly.
3. Only admins can change order status (via the update_order_status RPC).
*/
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Orders ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','manufacturing','dispatched','delivered','cancelled')),
  customer_first_name text NOT NULL,
  customer_last_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL DEFAULT '',
  customer_company text,
  billing_line1 text NOT NULL DEFAULT '',
  billing_line2 text,
  billing_city text NOT NULL DEFAULT '',
  billing_postcode text NOT NULL DEFAULT '',
  billing_country text NOT NULL DEFAULT 'United Kingdom',
  delivery_method text NOT NULL DEFAULT 'delivery' CHECK (delivery_method IN ('collection','delivery')),
  delivery_line1 text,
  delivery_line2 text,
  delivery_city text,
  delivery_postcode text,
  delivery_country text,
  payment_method text NOT NULL DEFAULT 'invoice' CHECK (payment_method IN ('online','invoice')),
  payment_status text NOT NULL DEFAULT 'pending',
  subtotal integer NOT NULL DEFAULT 0,
  vat_amount integer NOT NULL DEFAULT 0,
  delivery_amount integer NOT NULL DEFAULT 0,
  total integer NOT NULL DEFAULT 0,
  notes text,
  status_history jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_or_all_orders" ON orders;
CREATE POLICY "select_own_or_all_orders" ON orders FOR SELECT
  TO authenticated USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "insert_own_orders" ON orders;
CREATE POLICY "insert_own_orders" ON orders FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

DROP POLICY IF EXISTS "admin_update_orders" ON orders;
CREATE POLICY "admin_update_orders" ON orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- ─── Order items ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  product_sku text NOT NULL DEFAULT '',
  quantity integer NOT NULL DEFAULT 1,
  unit_price integer NOT NULL DEFAULT 0,
  total_price integer NOT NULL DEFAULT 0,
  width integer,
  length integer,
  height integer
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_or_all_order_items" ON order_items;
CREATE POLICY "select_own_or_all_order_items" ON order_items FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_id AND (
        o.user_id = auth.uid() OR
        EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
      )
    )
  );

DROP POLICY IF EXISTS "insert_own_order_items" ON order_items;
CREATE POLICY "insert_own_order_items" ON order_items FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_id AND (
        o.user_id = auth.uid() OR
        EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
      )
    )
  );

-- ─── Admin-only status update function ─────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.update_order_status(
  p_order_id uuid,
  p_new_status text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order record;
  v_history jsonb;
  v_entry jsonb;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin') THEN
    RAISE EXCEPTION 'Permission denied: admin role required';
  END IF;

  IF p_new_status NOT IN ('pending','processing','manufacturing','dispatched','delivered','cancelled') THEN
    RAISE EXCEPTION 'Invalid status: %', p_new_status;
  END IF;

  SELECT * INTO v_order FROM orders WHERE id = p_order_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found';
  END IF;

  v_entry := jsonb_build_object(
    'status', p_new_status,
    'timestamp', to_char(now() AT TIME ZONE 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
    'note', 'Status updated by admin'
  );

  v_history := v_order.status_history || jsonb_build_array(v_entry);

  UPDATE orders
  SET status = p_new_status,
      status_history = v_history,
      updated_at = now()
  WHERE id = p_order_id;

  RETURN jsonb_build_object(
    'order_id', p_order_id,
    'order_number', v_order.order_number,
    'customer_email', v_order.customer_email,
    'customer_name', v_order.customer_first_name || ' ' || v_order.customer_last_name,
    'old_status', v_order.status,
    'new_status', p_new_status,
    'status_history', v_history
  );
END;
$$;

-- ─── Updated_at trigger for orders ─────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.update_orders_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION public.update_orders_updated_at();

-- ─── Indexes ───────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
