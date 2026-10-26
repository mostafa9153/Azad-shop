-- AZAD HAYA (আজাদ হায়া) — PostgreSQL Initial Schema & Atomic RPCs
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name_en VARCHAR(150) NOT NULL,
  name_bn VARCHAR(150) NOT NULL,
  description_en TEXT,
  description_bn TEXT,
  image_url TEXT NOT NULL,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Collections
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  title_en VARCHAR(150) NOT NULL,
  title_bn VARCHAR(150) NOT NULL,
  description_en TEXT,
  description_bn TEXT,
  banner_url TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku VARCHAR(50) UNIQUE NOT NULL,
  slug VARCHAR(150) UNIQUE NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  title_bn VARCHAR(255) NOT NULL,
  short_desc_en TEXT,
  short_desc_bn TEXT,
  description_en TEXT,
  description_bn TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE RESTRICT,
  fabric_en VARCHAR(100),
  fabric_bn VARCHAR(100),
  pattern VARCHAR(100),
  care_instructions_en TEXT,
  care_instructions_bn TEXT,
  base_price_paise BIGINT NOT NULL,
  compare_at_price_paise BIGINT,
  cost_price_paise BIGINT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT true,
  is_bestseller BOOLEAN DEFAULT false,
  allows_custom_size BOOLEAN DEFAULT true,
  gst_rate NUMERIC(4,2) DEFAULT 0.05,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Product Variants
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  sku VARCHAR(60) UNIQUE NOT NULL,
  size VARCHAR(30) NOT NULL,
  color_en VARCHAR(50) NOT NULL,
  color_bn VARCHAR(50) NOT NULL,
  color_hex VARCHAR(20) DEFAULT '#000000',
  stock_quantity INT NOT NULL DEFAULT 0,
  low_stock_threshold INT NOT NULL DEFAULT 3,
  price_paise BIGINT NOT NULL,
  compare_at_price_paise BIGINT,
  is_active BOOLEAN DEFAULT true,
  weight_grams INT DEFAULT 500,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Product Images
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  image_url TEXT NOT NULL,
  alt_en VARCHAR(255),
  alt_bn VARCHAR(255),
  display_order INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Product Collections Junction
CREATE TABLE IF NOT EXISTS product_collections (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, collection_id)
);

-- 7. Coupons
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  description_en TEXT,
  description_bn TEXT,
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('flat', 'percentage')),
  discount_value BIGINT NOT NULL,
  min_order_value_paise BIGINT DEFAULT 0,
  max_discount_paise BIGINT,
  usage_limit INT DEFAULT 1000,
  usage_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(150) NOT NULL,
  customer_email VARCHAR(150),
  customer_phone VARCHAR(50) NOT NULL,
  shipping_address JSONB NOT NULL,
  billing_address JSONB,
  items_total_paise BIGINT NOT NULL,
  discount_total_paise BIGINT DEFAULT 0,
  shipping_fee_paise BIGINT DEFAULT 0,
  cod_fee_paise BIGINT DEFAULT 0,
  custom_size_fee_paise BIGINT DEFAULT 0,
  total_paise BIGINT NOT NULL,
  gst_total_paise BIGINT DEFAULT 0,
  payment_method VARCHAR(50) NOT NULL,
  payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
  order_status VARCHAR(50) NOT NULL DEFAULT 'pending',
  shipping_method VARCHAR(100) DEFAULT 'Standard Delivery',
  tracking_number VARCHAR(100),
  coupon_code VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  title_en VARCHAR(255) NOT NULL,
  title_bn VARCHAR(255) NOT NULL,
  sku VARCHAR(60) NOT NULL,
  size VARCHAR(30) NOT NULL,
  color_en VARCHAR(50) NOT NULL,
  color_bn VARCHAR(50) NOT NULL,
  quantity INT NOT NULL,
  price_paise BIGINT NOT NULL,
  total_paise BIGINT NOT NULL,
  custom_measurements JSONB,
  is_custom_size BOOLEAN DEFAULT false,
  image_url TEXT
);

-- 10. Stock Ledger
CREATE TABLE IF NOT EXISTS stock_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  variant_id UUID REFERENCES product_variants(id) ON DELETE RESTRICT,
  sku VARCHAR(60) NOT NULL,
  change_type VARCHAR(50) NOT NULL CHECK (change_type IN ('initial', 'restock', 'sale', 'adjustment', 'return', 'tailoring_allocated')),
  quantity_change INT NOT NULL,
  previous_quantity INT NOT NULL,
  new_quantity INT NOT NULL,
  reference_id VARCHAR(100),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by VARCHAR(100) DEFAULT 'system'
);

-- 11. Tailoring Queue
CREATE TABLE IF NOT EXISTS tailoring_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  order_number VARCHAR(50) NOT NULL,
  order_item_id UUID REFERENCES order_items(id) ON DELETE CASCADE,
  customer_name VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  product_title_en VARCHAR(255) NOT NULL,
  product_title_bn VARCHAR(255) NOT NULL,
  measurements JSONB NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'measuring', 'cutting', 'stitching', 'qc', 'completed')),
  notes TEXT,
  due_date TIMESTAMPTZ,
  assigned_tailor VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  customer_name VARCHAR(150) NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  is_verified_purchase BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Site Settings
CREATE TABLE IF NOT EXISTS site_settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Configuration
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE tailoring_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies for catalog
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read collections" ON collections FOR SELECT USING (is_active = true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public read product_variants" ON product_variants FOR SELECT USING (is_active = true);
CREATE POLICY "Public read product_images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public read product_collections" ON product_collections FOR SELECT USING (true);
CREATE POLICY "Public read approved reviews" ON reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Public insert reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read active coupons" ON coupons FOR SELECT USING (is_active = true);
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);

-- Atomic RPC: adjust_stock
CREATE OR REPLACE FUNCTION adjust_stock(
  p_variant_id UUID,
  p_qty_change INT,
  p_change_type VARCHAR(50),
  p_note TEXT,
  p_ref_id VARCHAR(100) DEFAULT NULL,
  p_user VARCHAR(100) DEFAULT 'system'
)
RETURNS TABLE (
  success BOOLEAN,
  previous_qty INT,
  new_qty INT,
  sku VARCHAR(60)
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_sku VARCHAR(60);
  v_curr_qty INT;
  v_next_qty INT;
BEGIN
  -- Lock row for update
  SELECT pv.sku, pv.stock_quantity INTO v_sku, v_curr_qty
  FROM product_variants pv
  WHERE pv.id = p_variant_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Variant not found: %', p_variant_id;
  END IF;

  v_next_qty := v_curr_qty + p_qty_change;
  IF v_next_qty < 0 THEN
    RAISE EXCEPTION 'Insufficient stock for SKU %: current %, requested change %', v_sku, v_curr_qty, p_qty_change;
  END IF;

  UPDATE product_variants
  SET stock_quantity = v_next_qty, updated_at = NOW()
  WHERE id = p_variant_id;

  INSERT INTO stock_ledger (
    variant_id, sku, change_type, quantity_change, previous_quantity, new_quantity, reference_id, note, created_by
  ) VALUES (
    p_variant_id, v_sku, p_change_type, p_qty_change, v_curr_qty, v_next_qty, p_ref_id, p_note, p_user
  );

  RETURN QUERY SELECT true, v_curr_qty, v_next_qty, v_sku;
END;
$$;
