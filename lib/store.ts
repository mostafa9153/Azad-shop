import fs from "fs";
import path from "path";
import {
  Category,
  Collection,
  Product,
  ProductVariant,
  ProductImage,
  Order,
  OrderItem,
  StockLedgerEntry,
  TailoringJob,
  Coupon,
  Review,
  SiteSettings,
  StockChangeType,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(DATA_DIR, "store.json");

export interface StoreData {
  categories: Category[];
  collections: Collection[];
  products: Product[];
  product_variants: ProductVariant[];
  product_images: ProductImage[];
  coupons: Coupon[];
  orders: Order[];
  order_items: OrderItem[];
  stock_ledger: StockLedgerEntry[];
  tailoring_queue: TailoringJob[];
  reviews: Review[];
  site_settings: SiteSettings;
}

const defaultSettings: SiteSettings = {
  announcement_bar_en: "🌟 Special Ramadan & Eid Collection Launch — Free delivery on orders over ₹1,499 across Bengal!",
  announcement_bar_bn: "🌟 বিশেষ রমজান ও ঈদ কালেকশন — পশ্চিমবঙ্গ জুড়ে ₹১,৪৯৯-এর অর্ডারে ফ্রি ডেলিভারি!",
  announcement_active: true,
  whatsapp_enabled: true,
  demo_mode_banner: false,
  free_shipping_threshold_paise: 149900,
};

let memoryStore: StoreData | null = null;
let storeLock: Promise<any> = Promise.resolve();

export function withStoreLock<T>(fn: () => Promise<T> | T): Promise<T> {
  const next = storeLock.then(async () => {
    return await fn();
  });
  storeLock = next.catch(() => {});
  return next;
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function loadStore(): StoreData {
  if (memoryStore) return memoryStore;

  ensureDataDir();
  if (fs.existsSync(STORE_FILE)) {
    try {
      const raw = fs.readFileSync(STORE_FILE, "utf-8");
      memoryStore = JSON.parse(raw);
      return memoryStore!;
    } catch (e) {
      console.error("Failed to parse store.json, reinitializing default", e);
    }
  }

  memoryStore = {
    categories: [],
    collections: [],
    products: [],
    product_variants: [],
    product_images: [],
    coupons: [],
    orders: [],
    order_items: [],
    stock_ledger: [],
    tailoring_queue: [],
    reviews: [],
    site_settings: defaultSettings,
  };

  saveStore(memoryStore);
  return memoryStore;
}

export function saveStore(store: StoreData): void {
  ensureDataDir();
  memoryStore = store;
  fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), "utf-8");
}

/* -------------------------------------------------------------
 * CATEGORIES & COLLECTIONS
 * ------------------------------------------------------------- */
export async function getCategories(): Promise<Category[]> {
  const store = loadStore();
  return store.categories.filter((c) => c.is_active).sort((a, b) => a.sort_order - b.sort_order);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const store = loadStore();
  return store.categories.find((c) => c.slug === slug && c.is_active) || null;
}

export async function getCollections(): Promise<Collection[]> {
  const store = loadStore();
  return store.collections.filter((c) => c.is_active);
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  const store = loadStore();
  return store.collections.find((c) => c.slug === slug && c.is_active) || null;
}

/* -------------------------------------------------------------
 * PRODUCTS & VARIANTS
 * ------------------------------------------------------------- */
export async function getProducts(options?: {
  categoryId?: string;
  categorySlug?: string;
  collectionSlug?: string;
  search?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  isBestseller?: boolean;
  limit?: number;
}): Promise<Product[]> {
  const store = loadStore();
  let list = store.products.filter((p) => p.is_active);

  if (options?.categorySlug) {
    const cat = store.categories.find((c) => c.slug === options.categorySlug);
    if (cat) {
      list = list.filter((p) => p.category_id === cat.id);
    }
  } else if (options?.categoryId) {
    list = list.filter((p) => p.category_id === options.categoryId);
  }

  if (options?.collectionSlug) {
    list = list.filter((p) => p.collections?.includes(options.collectionSlug!));
  }

  if (options?.isNew) {
    list = list.filter((p) => p.is_new);
  }
  if (options?.isFeatured) {
    list = list.filter((p) => p.is_featured);
  }
  if (options?.isBestseller) {
    list = list.filter((p) => p.is_bestseller);
  }

  if (options?.search) {
    const q = options.search.toLowerCase();
    list = list.filter((p) => {
      const cat = store.categories.find((c) => c.id === p.category_id);
      return (
        p.title_en.toLowerCase().includes(q) ||
        p.title_bn.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.fabric_en.toLowerCase().includes(q) ||
        p.fabric_bn.toLowerCase().includes(q) ||
        (cat && (cat.name_en.toLowerCase().includes(q) || cat.name_bn.toLowerCase().includes(q) || cat.slug.toLowerCase().includes(q)))
      );
    });
  }

  // Populate variants & images
  const enriched = list.map((p) => ({
    ...p,
    variants: store.product_variants.filter((v) => v.product_id === p.id && v.is_active),
    images: store.product_images
      .filter((img) => img.product_id === p.id)
      .sort((a, b) => a.display_order - b.display_order),
    category: store.categories.find((c) => c.id === p.category_id),
  }));

  if (options?.limit) {
    return enriched.slice(0, options.limit);
  }

  return enriched;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const store = loadStore();
  const product = store.products.find((p) => p.slug === slug && p.is_active);
  if (!product) return null;

  return {
    ...product,
    variants: store.product_variants.filter((v) => v.product_id === product.id && v.is_active),
    images: store.product_images
      .filter((img) => img.product_id === product.id)
      .sort((a, b) => a.display_order - b.display_order),
    category: store.categories.find((c) => c.id === product.category_id),
  };
}

export async function getProductById(id: string): Promise<Product | null> {
  const store = loadStore();
  const product = store.products.find((p) => p.id === id);
  if (!product) return null;

  return {
    ...product,
    variants: store.product_variants.filter((v) => v.product_id === product.id),
    images: store.product_images
      .filter((img) => img.product_id === product.id)
      .sort((a, b) => a.display_order - b.display_order),
    category: store.categories.find((c) => c.id === product.category_id),
  };
}

export async function upsertProduct(product: Partial<Product>, variants: Partial<ProductVariant>[] = []): Promise<Product> {
  const store = loadStore();
  const now = new Date().toISOString();

  let pId = product.id;
  if (!pId) {
    pId = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newProd: Product = {
      id: pId,
      sku: product.sku || `AZAD-${Date.now().toString().slice(-4)}`,
      slug: product.slug || `product-${pId}`,
      title_en: product.title_en || "Untitled Product",
      title_bn: product.title_bn || "নামহীন পণ্য",
      short_desc_en: product.short_desc_en || "",
      short_desc_bn: product.short_desc_bn || "",
      description_en: product.description_en || "",
      description_bn: product.description_bn || "",
      category_id: product.category_id || store.categories[0]?.id || "",
      fabric_en: product.fabric_en || "Pure Cotton",
      fabric_bn: product.fabric_bn || "খাঁটি সুতি",
      pattern: product.pattern || "Solid",
      care_instructions_en: product.care_instructions_en || "Dry Clean or Gentle Hand Wash",
      care_instructions_bn: product.care_instructions_bn || "ড্রাই ক্লিন বা নরম হাতে ধোয়া",
      base_price_paise: product.base_price_paise || 149900,
      compare_at_price_paise: product.compare_at_price_paise,
      cost_price_paise: product.cost_price_paise || 80000,
      is_active: product.is_active ?? true,
      is_featured: product.is_featured ?? false,
      is_new: product.is_new ?? true,
      is_bestseller: product.is_bestseller ?? false,
      allows_custom_size: product.allows_custom_size ?? true,
      gst_rate: product.gst_rate ?? 0.05,
      created_at: now,
      updated_at: now,
    };
    store.products.unshift(newProd);
  } else {
    const idx = store.products.findIndex((p) => p.id === pId);
    if (idx !== -1) {
      store.products[idx] = {
        ...store.products[idx],
        ...product,
        updated_at: now,
      };
    }
  }

  // Handle variants
  if (variants.length > 0) {
    // replace or append variants for this product
    store.product_variants = store.product_variants.filter((v) => v.product_id !== pId);
    for (const v of variants) {
      const vId = v.id || `var_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newVar: ProductVariant = {
        id: vId,
        product_id: pId!,
        sku: v.sku || `${product.sku}-${v.size}-${v.color_en}`,
        size: v.size || "Free Size",
        color_en: v.color_en || "Black",
        color_bn: v.color_bn || "কালো",
        color_hex: v.color_hex || "#1C1B18",
        stock_quantity: v.stock_quantity ?? 10,
        low_stock_threshold: v.low_stock_threshold ?? 3,
        price_paise: v.price_paise || product.base_price_paise || 149900,
        compare_at_price_paise: v.compare_at_price_paise,
        is_active: v.is_active ?? true,
        weight_grams: v.weight_grams ?? 500,
      };
      store.product_variants.push(newVar);

      // Maintain double-entry stock ledger integrity
      const existingLedger = store.stock_ledger.filter((l) => l.variant_id === vId);
      const computedExisting = existingLedger.reduce((acc, curr) => acc + curr.quantity_change, 0);
      const stockQty = newVar.stock_quantity;
      if (existingLedger.length === 0) {
        store.stock_ledger.unshift({
          id: `led_init_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          variant_id: vId,
          sku: newVar.sku,
          change_type: "initial",
          quantity_change: stockQty,
          previous_quantity: 0,
          new_quantity: stockQty,
          reference_id: "PRODUCT-UPSERT",
          note: `Admin initialized stock for ${product.title_en || "Product"} (${newVar.size}, ${newVar.color_en})`,
          created_at: now,
          created_by: "admin",
        });
      } else if (computedExisting !== stockQty) {
        const diff = stockQty - computedExisting;
        store.stock_ledger.unshift({
          id: `led_adj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          variant_id: vId,
          sku: newVar.sku,
          change_type: "adjustment",
          quantity_change: diff,
          previous_quantity: computedExisting,
          new_quantity: stockQty,
          reference_id: "PRODUCT-UPSERT",
          note: `Admin adjusted stock delta for ${product.title_en || "Product"} (${newVar.size}, ${newVar.color_en})`,
          created_at: now,
          created_by: "admin",
        });
      }
    }
  }

  saveStore(store);
  return (await getProductById(pId!))!;
}

/* -------------------------------------------------------------
 * ATOMIC STOCK & INVENTORY LEDGER
 * ------------------------------------------------------------- */
export async function adjustStock(
  variantId: string,
  quantityChange: number,
  changeType: StockChangeType,
  note: string,
  referenceId?: string,
  createdBy: string = "system"
): Promise<{ success: boolean; previousQuantity: number; newQuantity: number; sku: string }> {
  return withStoreLock(async () => {
    const store = loadStore();
    const vIndex = store.product_variants.findIndex((v) => v.id === variantId);
    if (vIndex === -1) {
      throw new Error(`Variant not found: ${variantId}`);
    }

    const variant = store.product_variants[vIndex];
    const prevQty = variant.stock_quantity;
    const newQty = prevQty + quantityChange;

    if (newQty < 0) {
      throw new Error(`Insufficient stock for SKU ${variant.sku}: current ${prevQty}, requested change ${quantityChange}`);
    }

    variant.stock_quantity = newQty;
    variant.updated_at = new Date().toISOString();

    const ledgerEntry: StockLedgerEntry = {
      id: `led_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      variant_id: variantId,
      sku: variant.sku,
      change_type: changeType,
      quantity_change: quantityChange,
      previous_quantity: prevQty,
      new_quantity: newQty,
      reference_id: referenceId,
      note,
      created_at: new Date().toISOString(),
      created_by: createdBy,
    };

    store.stock_ledger.unshift(ledgerEntry);
    saveStore(store);

    return {
      success: true,
      previousQuantity: prevQty,
      newQuantity: newQty,
      sku: variant.sku,
    };
  });
}

export async function getStockLedger(limit: number = 100): Promise<StockLedgerEntry[]> {
  const store = loadStore();
  return store.stock_ledger.slice(0, limit);
}

export async function getAllVariants(): Promise<
  Array<ProductVariant & { product_title_en: string; product_title_bn: string; product_slug: string }>
> {
  const store = loadStore();
  const prodMap = new Map(store.products.map((p) => [p.id, p]));
  return store.product_variants.map((v) => {
    const p = prodMap.get(v.product_id);
    return {
      ...v,
      product_title_en: p?.title_en || "Unknown Product",
      product_title_bn: p?.title_bn || "অজানা পণ্য",
      product_slug: p?.slug || "",
    };
  });
}

export async function verifyStockIntegrity(): Promise<{
  totalVariants: number;
  healthyCount: number;
  mismatchCount: number;
  discrepancies: Array<{ sku: string; variantStock: number; ledgerComputedStock: number }>;
}> {
  const store = loadStore();
  const discrepancies: Array<{ sku: string; variantStock: number; ledgerComputedStock: number }> = [];

  for (const v of store.product_variants) {
    // sum ledger entries for this variant
    const entries = store.stock_ledger.filter((l) => l.variant_id === v.id);
    const computed = entries.reduce((acc, curr) => acc + curr.quantity_change, 0);
    if (computed !== v.stock_quantity) {
      discrepancies.push({
        sku: v.sku,
        variantStock: v.stock_quantity,
        ledgerComputedStock: computed,
      });
    }
  }

  return {
    totalVariants: store.product_variants.length,
    healthyCount: store.product_variants.length - discrepancies.length,
    mismatchCount: discrepancies.length,
    discrepancies,
  };
}

/* -------------------------------------------------------------
 * COUPONS
 * ------------------------------------------------------------- */
export async function getCoupon(code: string): Promise<Coupon | null> {
  const store = loadStore();
  const c = store.coupons.find((cp) => cp.code.toUpperCase() === code.trim().toUpperCase() && cp.is_active);
  if (!c) return null;
  if (c.usage_limit && c.usage_count >= c.usage_limit) return null;
  if (c.expires_at && new Date(c.expires_at).getTime() < Date.now()) return null;
  return c;
}

export async function validateCoupon(code: string, itemsTotalPaise: number): Promise<{
  valid: boolean;
  coupon?: Coupon;
  discountPaise: number;
  message?: string;
}> {
  const coupon = await getCoupon(code);
  if (!coupon) {
    return { valid: false, discountPaise: 0, message: "Invalid or expired coupon" };
  }
  if (itemsTotalPaise < coupon.min_order_value_paise) {
    return {
      valid: false,
      discountPaise: 0,
      message: `Minimum order value for ${coupon.code} is ₹${Math.round(coupon.min_order_value_paise / 100)}`,
    };
  }

  let discount = 0;
  if (coupon.discount_type === "percentage") {
    discount = Math.round((itemsTotalPaise * coupon.discount_value) / 100);
    if (coupon.max_discount_paise && discount > coupon.max_discount_paise) {
      discount = coupon.max_discount_paise;
    }
  } else {
    discount = coupon.discount_value;
  }

  return { valid: true, coupon, discountPaise: Math.min(discount, itemsTotalPaise) };
}

/* -------------------------------------------------------------
 * ATOMIC ORDER CREATION & TAILORING
 * ------------------------------------------------------------- */
export async function createOrder(data: {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: any;
  billing_address?: any;
  items: Array<{
    product_id: string;
    variant_id?: string;
    sku: string;
    title_en: string;
    title_bn: string;
    size: string;
    color_en: string;
    color_bn: string;
    quantity: number;
    price_paise: number;
    is_custom_size: boolean;
    custom_measurements?: any;
    image_url?: string;
  }>;
  payment_method: any;
  payment_status: any;
  shipping_fee_paise: number;
  cod_fee_paise?: number;
  coupon_code?: string;
  notes?: string;
}): Promise<Order> {
  return withStoreLock(async () => {
    const store = loadStore();
    const now = new Date().toISOString();

    // 1. Calculate items total & custom size fees
    let itemsTotal = 0;
    let customFeeTotal = 0;
    for (const item of data.items) {
      itemsTotal += item.price_paise * item.quantity;
      if (item.is_custom_size) {
        customFeeTotal += 15000 * item.quantity; // ₹150 tailoring fee per custom item
      }
    }

    // 2. Validate coupon
    let discountTotal = 0;
    if (data.coupon_code) {
      const val = await validateCoupon(data.coupon_code, itemsTotal);
      if (val.valid) {
        discountTotal = val.discountPaise;
        const cIndex = store.coupons.findIndex((c) => c.code.toUpperCase() === data.coupon_code!.toUpperCase());
        if (cIndex !== -1) {
          store.coupons[cIndex].usage_count += 1;
        }
      }
    }

    // 3. GST calculation per item (5% up to ₹2,500, 18% above - inclusive)
    let gstTotal = 0;
    for (const item of data.items) {
      const itemSubtotal = item.price_paise * item.quantity;
      const gstRate = item.price_paise > 250000 ? 0.18 : 0.05;
      const itemGst = Math.round((itemSubtotal * gstRate) / (1 + gstRate));
      gstTotal += itemGst;
    }

    const grandTotal = Math.max(
      0,
      itemsTotal - discountTotal + data.shipping_fee_paise + (data.cod_fee_paise || 0) + customFeeTotal
    );

    // 4. Generate Order Number & ID
    const orderNumber = `AH-${Date.now().toString().slice(-6)}-${Math.floor(10 + Math.random() * 90)}`;
    const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // 4.5. Resolve missing variant_id to default product variant if available
    for (const item of data.items) {
      if (!item.variant_id && item.product_id) {
        const defaultVar = store.product_variants.find((v) => v.product_id === item.product_id);
        if (defaultVar) {
          item.variant_id = defaultVar.id;
          if (!item.sku) item.sku = defaultVar.sku;
        }
      }
    }

    // 5. ATOMIC PRE-VALIDATION: Ensure ALL items have sufficient stock before making any deductions
    for (const item of data.items) {
      if (item.variant_id) {
        const variant = store.product_variants.find((v) => v.id === item.variant_id);
        if (!variant) {
          throw new Error(`Variant not found: ${item.variant_id}`);
        }
        if (variant.stock_quantity < item.quantity) {
          throw new Error(
            `Insufficient stock for SKU ${variant.sku}: current ${variant.stock_quantity}, requested ${item.quantity}`
          );
        }
      }
    }

    // 6. Deduct stock and record in double-entry stock ledger
    for (const item of data.items) {
      if (item.variant_id) {
        const variant = store.product_variants.find((v) => v.id === item.variant_id)!;
        const prevQty = variant.stock_quantity;
        const newQty = prevQty - item.quantity;
        variant.stock_quantity = newQty;
        variant.updated_at = now;

        const ledgerEntry: StockLedgerEntry = {
          id: `led_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          variant_id: item.variant_id,
          sku: variant.sku,
          change_type: item.is_custom_size ? "tailoring_allocated" : "sale",
          quantity_change: -item.quantity,
          previous_quantity: prevQty,
          new_quantity: newQty,
          reference_id: orderNumber,
          note: `Order ${item.is_custom_size ? "custom tailoring" : "sale"}: ${data.customer_name} (${data.customer_phone})`,
          created_at: now,
          created_by: "checkout",
        };
        store.stock_ledger.unshift(ledgerEntry);
      }
    }

    // Determine order status
    const hasCustom = data.items.some((i) => i.is_custom_size);
    const initialOrderStatus = hasCustom ? "tailoring" : "processing";

    const newOrder: Order = {
      id: orderId,
      order_number: orderNumber,
      customer_name: data.customer_name,
      customer_email: data.customer_email,
      customer_phone: data.customer_phone,
      shipping_address: data.shipping_address,
      billing_address: data.billing_address || data.shipping_address,
      items_total_paise: itemsTotal,
      discount_total_paise: discountTotal,
      shipping_fee_paise: data.shipping_fee_paise,
      cod_fee_paise: data.cod_fee_paise || 0,
      custom_size_fee_paise: customFeeTotal,
      total_paise: grandTotal,
      gst_total_paise: gstTotal,
      payment_method: data.payment_method,
      payment_status: data.payment_status,
      order_status: initialOrderStatus,
      shipping_method: "Express West Bengal Courier",
      coupon_code: data.coupon_code,
      notes: data.notes,
      created_at: now,
      updated_at: now,
      items: [],
    };

    store.orders.unshift(newOrder);

    // 7. Insert Order Items & Tailoring Queue if needed
    for (const item of data.items) {
      const itemId = `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const orderItem: OrderItem = {
        id: itemId,
        order_id: orderId,
        product_id: item.product_id,
        variant_id: item.variant_id,
        title_en: item.title_en,
        title_bn: item.title_bn,
        sku: item.sku,
        size: item.size,
        color_en: item.color_en,
        color_bn: item.color_bn,
        quantity: item.quantity,
        price_paise: item.price_paise,
        total_paise: item.price_paise * item.quantity,
        custom_measurements: item.custom_measurements,
        is_custom_size: item.is_custom_size,
        image_url: item.image_url,
      };
      store.order_items.push(orderItem);
      newOrder.items!.push(orderItem);

      if (item.is_custom_size && item.custom_measurements) {
        const tailoringJob: TailoringJob = {
          id: `tailor_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          order_id: orderId,
          order_number: orderNumber,
          order_item_id: itemId,
          customer_name: data.customer_name,
          customer_phone: data.customer_phone,
          product_title_en: item.title_en,
          product_title_bn: item.title_bn,
          measurements: item.custom_measurements,
          status: "queued",
          notes: `Custom size request for ${item.title_bn}`,
          due_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: now,
          updated_at: now,
        };
        store.tailoring_queue.unshift(tailoringJob);
      }
    }

    saveStore(store);
    return newOrder;
  });
}

export async function getOrders(filter?: { status?: string; search?: string }): Promise<Order[]> {
  const store = loadStore();
  let list = store.orders.map((o) => ({
    ...o,
    items: store.order_items.filter((i) => i.order_id === o.id),
  }));

  if (filter?.status && filter.status !== "all") {
    list = list.filter((o) => o.order_status === filter.status);
  }

  if (filter?.search) {
    const q = filter.search.toLowerCase();
    list = list.filter(
      (o) =>
        o.order_number.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_phone.includes(q)
    );
  }

  return list;
}

export async function getOrderByNumber(orderNumber: string, phone?: string): Promise<Order | null> {
  const store = loadStore();
  const cleanNum = orderNumber.trim().toUpperCase();
  const order = store.orders.find((o) => o.order_number.toUpperCase() === cleanNum);
  if (!order) return null;

  if (phone !== undefined) {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const orderPhone = order.customer_phone.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 10 || (!orderPhone.endsWith(cleanPhone) && !cleanPhone.endsWith(orderPhone))) {
      return null;
    }
  }

  return {
    ...order,
    items: store.order_items.filter((i) => i.order_id === order.id),
  };
}

export async function updateOrderStatus(orderId: string, status: any): Promise<Order | null> {
  if (status === "cancelled") {
    return cancelOrder(orderId, "Status updated to cancelled");
  }

  return withStoreLock(async () => {
    const store = loadStore();
    const oIdx = store.orders.findIndex((o) => o.id === orderId);
    if (oIdx === -1) return null;

    store.orders[oIdx].order_status = status;
    store.orders[oIdx].updated_at = new Date().toISOString();
    saveStore(store);

    return {
      ...store.orders[oIdx],
      items: store.order_items.filter((i) => i.order_id === orderId),
    };
  });
}

export async function updatePaymentStatus(orderId: string, status: any): Promise<Order | null> {
  return withStoreLock(async () => {
    const store = loadStore();
    const oIdx = store.orders.findIndex((o) => o.id === orderId);
    if (oIdx === -1) return null;

    store.orders[oIdx].payment_status = status;
    store.orders[oIdx].updated_at = new Date().toISOString();
    saveStore(store);

    return {
      ...store.orders[oIdx],
      items: store.order_items.filter((i) => i.order_id === orderId),
    };
  });
}

export async function updateOrder(orderId: string, updates: Partial<Order>): Promise<Order | null> {
  if (updates.order_status === "cancelled") {
    return cancelOrder(orderId, updates.notes || "Order cancelled");
  }

  return withStoreLock(async () => {
    const store = loadStore();
    const oIdx = store.orders.findIndex((o) => o.id === orderId);
    if (oIdx === -1) return null;

    store.orders[oIdx] = {
      ...store.orders[oIdx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    saveStore(store);

    return {
      ...store.orders[oIdx],
      items: store.order_items.filter((i) => i.order_id === orderId),
    };
  });
}

export async function cancelOrder(
  orderId: string,
  reason?: string,
  cancelledBy: string = "system"
): Promise<Order> {
  return withStoreLock(async () => {
    const store = loadStore();
    const oIdx = store.orders.findIndex((o) => o.id === orderId);
    if (oIdx === -1) {
      throw new Error(`Order not found: ${orderId}`);
    }

    const order = store.orders[oIdx];
    if (order.order_status === "cancelled") {
      return {
        ...order,
        items: store.order_items.filter((i) => i.order_id === order.id),
      };
    }

    if (order.order_status === "delivered" || order.order_status === "shipped") {
      throw new Error(`Cannot cancel order in '${order.order_status}' status. Please request a return.`);
    }

    const now = new Date().toISOString();
    const orderItems = store.order_items.filter((i) => i.order_id === order.id);

    // Return stock to inventory and record in stock_ledger
    for (const item of orderItems) {
      if (item.variant_id) {
        const vIndex = store.product_variants.findIndex((v) => v.id === item.variant_id);
        if (vIndex !== -1) {
          const variant = store.product_variants[vIndex];
          const prevQty = variant.stock_quantity;
          const newQty = prevQty + item.quantity;
          variant.stock_quantity = newQty;
          variant.updated_at = now;

          const ledgerEntry: StockLedgerEntry = {
            id: `led_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            variant_id: item.variant_id,
            sku: variant.sku,
            change_type: "return",
            quantity_change: item.quantity,
            previous_quantity: prevQty,
            new_quantity: newQty,
            reference_id: order.order_number,
            note: `Order cancellation: ${order.order_number} (${reason || "Customer cancelled"})`,
            created_at: now,
            created_by: cancelledBy,
          };
          store.stock_ledger.unshift(ledgerEntry);
        }
      }
    }

    // Cancel queued tailoring jobs
    for (const job of store.tailoring_queue) {
      if (job.order_id === order.id && job.status !== "completed") {
        job.notes = (job.notes || "") + ` [Order cancelled: ${reason || "Cancelled"}]`;
      }
    }

    order.order_status = "cancelled";
    if (order.payment_status === "paid") {
      order.payment_status = "refunded";
    }
    order.notes = (order.notes || "") + (reason ? `\nCancellation reason: ${reason}` : "");
    order.updated_at = now;

    saveStore(store);

    return {
      ...order,
      items: orderItems,
    };
  });
}

/* -------------------------------------------------------------
 * TAILORING QUEUE
 * ------------------------------------------------------------- */
export async function getTailoringQueue(): Promise<TailoringJob[]> {
  const store = loadStore();
  return store.tailoring_queue;
}

export async function updateTailoringStatus(jobId: string, status: any, tailor?: string): Promise<TailoringJob | null> {
  const store = loadStore();
  const idx = store.tailoring_queue.findIndex((j) => j.id === jobId);
  if (idx === -1) return null;

  store.tailoring_queue[idx].status = status;
  if (tailor) {
    store.tailoring_queue[idx].assigned_tailor = tailor;
  }
  store.tailoring_queue[idx].updated_at = new Date().toISOString();

  // If completed, check if all items for the order are done, transition order to processing
  if (status === "completed") {
    const orderId = store.tailoring_queue[idx].order_id;
    const remaining = store.tailoring_queue.filter((j) => j.order_id === orderId && j.status !== "completed");
    if (remaining.length === 0) {
      await updateOrderStatus(orderId, "processing");
    }
  }

  saveStore(store);
  return store.tailoring_queue[idx];
}

/* -------------------------------------------------------------
 * REVIEWS
 * ------------------------------------------------------------- */
export async function getReviews(productId: string): Promise<Review[]> {
  const store = loadStore();
  return store.reviews.filter((r) => r.product_id === productId && r.is_approved);
}

export async function addReview(data: {
  product_id: string;
  customer_name: string;
  rating: number;
  comment: string;
}): Promise<Review> {
  const store = loadStore();
  const newRev: Review = {
    id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    product_id: data.product_id,
    customer_name: data.customer_name,
    rating: data.rating,
    comment: data.comment,
    is_verified_purchase: true,
    is_approved: true,
    created_at: new Date().toISOString(),
  };

  store.reviews.unshift(newRev);
  saveStore(store);
  return newRev;
}

/* -------------------------------------------------------------
 * SITE SETTINGS
 * ------------------------------------------------------------- */
export async function getSiteSettings(): Promise<SiteSettings> {
  const store = loadStore();
  return store.site_settings || defaultSettings;
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const store = loadStore();
  store.site_settings = {
    ...store.site_settings,
    ...settings,
  };
  saveStore(store);
  return store.site_settings;
}
