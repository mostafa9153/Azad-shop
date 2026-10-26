export type Locale = "bn" | "en";

export interface Category {
  id: string;
  slug: string;
  name_en: string;
  name_bn: string;
  description_en: string;
  description_bn: string;
  image_url: string;
  parent_id?: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface Collection {
  id: string;
  slug: string;
  title_en: string;
  title_bn: string;
  description_en: string;
  description_bn: string;
  banner_url: string;
  is_featured: boolean;
  is_active: boolean;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  size: string; // "52", "54", "56", "58", "M", "L", "XL", "Free Size"
  color_en: string;
  color_bn: string;
  color_hex: string;
  stock_quantity: number;
  low_stock_threshold: number;
  price_paise: number;
  compare_at_price_paise?: number | null;
  is_active: boolean;
  weight_grams?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  variant_id?: string | null;
  image_url: string;
  alt_en: string;
  alt_bn: string;
  display_order: number;
  is_primary: boolean;
}

export interface Product {
  id: string;
  sku: string;
  slug: string;
  title_en: string;
  title_bn: string;
  short_desc_en: string;
  short_desc_bn: string;
  description_en: string;
  description_bn: string;
  category_id: string;
  fabric_en: string;
  fabric_bn: string;
  pattern: string;
  care_instructions_en: string;
  care_instructions_bn: string;
  base_price_paise: number;
  compare_at_price_paise?: number | null;
  cost_price_paise: number;
  is_active: boolean;
  is_featured: boolean;
  is_new: boolean;
  is_bestseller: boolean;
  allows_custom_size: boolean;
  gst_rate: number; // e.g. 0.05 or 0.18
  created_at: string;
  updated_at: string;
  variants?: ProductVariant[];
  images?: ProductImage[];
  category?: Category;
  collections?: string[]; // collection slugs or IDs
}

export interface Coupon {
  id: string;
  code: string;
  description_en: string;
  description_bn: string;
  discount_type: "flat" | "percentage";
  discount_value: number; // paise for flat, integer percentage (e.g. 10 for 10%) for percentage
  min_order_value_paise: number;
  max_discount_paise?: number | null;
  usage_limit: number;
  usage_count: number;
  is_active: boolean;
  expires_at?: string | null;
}

export type PaymentMethod = "demo_upi" | "manual_upi" | "cod" | "card" | "netbanking" | "wallet";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type OrderStatus = "pending" | "processing" | "tailoring" | "shipped" | "delivered" | "cancelled" | "returned";

export interface CustomMeasurements {
  length_inches?: number;
  chest_inches?: number;
  waist_inches?: number;
  hips_inches?: number;
  shoulder_inches?: number;
  sleeve_inches?: number;
  special_notes?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id?: string | null;
  title_en: string;
  title_bn: string;
  sku: string;
  size: string;
  color_en: string;
  color_bn: string;
  quantity: number;
  price_paise: number;
  total_paise: number;
  custom_measurements?: CustomMeasurements | null;
  is_custom_size: boolean;
  image_url?: string;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  email?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: ShippingAddress;
  billing_address?: ShippingAddress;
  items_total_paise: number;
  discount_total_paise: number;
  shipping_fee_paise: number;
  cod_fee_paise: number;
  custom_size_fee_paise: number;
  total_paise: number;
  gst_total_paise: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  shipping_method: string;
  tracking_number?: string | null;
  coupon_code?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export type StockChangeType = "initial" | "restock" | "sale" | "adjustment" | "return" | "tailoring_allocated";

export interface StockLedgerEntry {
  id: string;
  variant_id: string;
  sku: string;
  change_type: StockChangeType;
  quantity_change: number; // positive or negative
  previous_quantity: number;
  new_quantity: number;
  reference_id?: string | null; // e.g. order_id or purchase_note
  note: string;
  created_at: string;
  created_by?: string;
}

export type TailoringStatus = "queued" | "measuring" | "cutting" | "stitching" | "qc" | "completed";

export interface TailoringJob {
  id: string;
  order_id: string;
  order_number: string;
  order_item_id: string;
  customer_name: string;
  customer_phone: string;
  product_title_en: string;
  product_title_bn: string;
  measurements: CustomMeasurements;
  status: TailoringStatus;
  notes?: string;
  due_date: string;
  assigned_tailor?: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  customer_name: string;
  rating: number; // 1-5
  comment: string;
  is_verified_purchase: boolean;
  is_approved: boolean;
  created_at: string;
}

export interface SiteSettings {
  announcement_bar_en: string;
  announcement_bar_bn: string;
  announcement_active: boolean;
  whatsapp_enabled: boolean;
  demo_mode_banner: boolean;
  free_shipping_threshold_paise: number;
}
