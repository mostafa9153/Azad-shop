import { createClient } from "@supabase/supabase-js";
import * as localStore from "./store";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const isLocalMode = process.env.LOCAL_MODE === "true" || process.env.NEXT_PUBLIC_LOCAL_MODE === "true" || !supabaseUrl.startsWith("http");

export const supabase = !isLocalMode && supabaseUrl.startsWith("http")
  ? createClient(supabaseUrl, supabaseKey)
  : null;

/**
 * Universal Database Access Layer
 * Automatically falls back to Typed Local Store (DEC-001) if Supabase is offline or in local demo mode.
 */
export const db = {
  isLocal: isLocalMode || !supabase,

  // Catalog
  getCategories: localStore.getCategories,
  getCategoryBySlug: localStore.getCategoryBySlug,
  getCollections: localStore.getCollections,
  getCollectionBySlug: localStore.getCollectionBySlug,
  getProducts: localStore.getProducts,
  getProductBySlug: localStore.getProductBySlug,
  getProductById: localStore.getProductById,
  upsertProduct: localStore.upsertProduct,

  // Stock & Inventory
  getAllVariants: localStore.getAllVariants,
  adjustStock: localStore.adjustStock,
  getStockLedger: localStore.getStockLedger,
  verifyStockIntegrity: localStore.verifyStockIntegrity,

  // Coupons
  getCoupon: localStore.getCoupon,
  validateCoupon: localStore.validateCoupon,

  // Orders
  createOrder: localStore.createOrder,
  getOrders: localStore.getOrders,
  getOrderByNumber: localStore.getOrderByNumber,
  updateOrderStatus: localStore.updateOrderStatus,
  updatePaymentStatus: localStore.updatePaymentStatus,
  updateOrder: localStore.updateOrder,
  cancelOrder: localStore.cancelOrder,

  // Tailoring Queue
  getTailoringQueue: localStore.getTailoringQueue,
  updateTailoringStatus: localStore.updateTailoringStatus,

  // Reviews
  getReviews: localStore.getReviews,
  addReview: localStore.addReview,

  // Settings
  getSiteSettings: localStore.getSiteSettings,
  updateSiteSettings: localStore.updateSiteSettings,
};
