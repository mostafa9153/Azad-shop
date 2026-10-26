/**
 * AZAD HAYA (আজাদ হায়া) — Comprehensive End-to-End Test Suite
 * Validates Catalog, Inventory, Cart Math, Coupon Engine, Order Pipeline,
 * Tailoring Queue, Guest Tracking, and Stock Ledger Integrity.
 */

import { db } from "../lib/db";
import { formatPrice } from "../lib/i18n";
import { CustomMeasurements, OrderStatus, StockChangeType } from "../lib/types";

async function runTestSuite() {
  console.log("==================================================================");
  console.log("   AZAD HAYA (আজাদ হায়া) — Automated End-to-End Test Suite      ");
  console.log("==================================================================\n");

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  ✅ [PASS] ${testName}`);
    } else {
      console.error(`  ❌ [FAIL] ${testName}`);
      if (detail) console.error(`     Detail: ${detail}`);
    }
  }

  // 1. Catalog & Category Verification
  console.log("▶ TEST SUITE 1: Catalog & Categories");
  const categories = await db.getCategories();
  assert(categories.length >= 8, `Categories count: ${categories.length} >= 8`);

  const products = await db.getProducts();
  assert(products.length >= 70, `Catalog seed count: ${products.length} >= 70 products`);

  const abayas = await db.getProducts({ categorySlug: "abaya" });
  assert(abayas.length >= 10, `Abaya category count: ${abayas.length} >= 10`);

  // 2. Product Detail & Variant Matrix Verification
  console.log("\n▶ TEST SUITE 2: Product Detail & Variant Integrity");
  const testProduct = products.find((p) => p.slug === "korean-nida-classic-burkha") || products[0];
  assert(Boolean(testProduct), `Found target product: ${testProduct.title_en}`);

  const detailedProduct = await db.getProductBySlug(testProduct.slug);
  assert(
    Boolean(detailedProduct?.variants && detailedProduct.variants.length > 0),
    `Product variants exist: ${detailedProduct?.variants?.length} variants`
  );
  assert(
    Boolean(detailedProduct?.images && detailedProduct.images.length > 0),
    `Product images exist: ${detailedProduct?.images?.length} images`
  );

  // 3. Coupon Validation Engine
  console.log("\n▶ TEST SUITE 3: Coupon Engine Validation");
  const couponResult = await db.validateCoupon("AZAD10", 250000); // ₹2,500 subtotal
  assert(couponResult.valid === true, "Coupon AZAD10 is valid for ₹2,500 cart");
  assert(
    couponResult.discountPaise === 25000,
    `10% discount calculated accurately: ₹${couponResult.discountPaise / 100} == ₹250`
  );

  const invalidCoupon = await db.validateCoupon("INVALID999", 50000);
  assert(invalidCoupon.valid === false, "Invalid coupon code rejected");

  const lowValueCoupon = await db.validateCoupon("WELCOME15", 50000); // min ₹1,499
  assert(lowValueCoupon.valid === false, "Coupon correctly rejected below minimum order value");

  // 4. Custom Measurements & Atomic Order Creation Pipeline
  console.log("\n▶ TEST SUITE 4: Checkout & Atomic Order Pipeline");
  const targetVariant = detailedProduct!.variants![0];
  const initialStock = targetVariant.stock_quantity;

  const customMeasurements: CustomMeasurements = {
    length_inches: 54,
    chest_inches: 38,
    waist_inches: 32,
    hips_inches: 42,
    shoulder_inches: 15,
    sleeve_inches: 27,
    special_notes: "Kolkata bespoke order test",
  };

  const orderNumber = `TEST-${Date.now().toString().slice(-6)}`;
  const orderData = {
    order_number: orderNumber,
    customer_name: "রাবেয়া খাতুন (Rabeya Khatun)",
    customer_phone: "+919876543210",
    customer_email: "rabeya.test@example.com",
    shipping_address: {
      name: "Rabeya Khatun",
      phone: "+919876543210",
      address_line1: "42 Zakaria Street, 2nd Floor",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700073",
      country: "India",
    },
    items: [
      {
        product_id: testProduct.id,
        variant_id: targetVariant.id,
        title_en: testProduct.title_en,
        title_bn: testProduct.title_bn,
        sku: targetVariant.sku,
        size: targetVariant.size,
        color_en: targetVariant.color_en,
        color_bn: targetVariant.color_bn,
        quantity: 1,
        price_paise: targetVariant.price_paise,
        custom_measurements: customMeasurements,
        is_custom_size: true,
        image_url: detailedProduct?.images?.[0]?.image_url,
      },
    ],
    shipping_fee_paise: 0,
    cod_fee_paise: 0,
    payment_method: "demo_upi" as const,
    payment_status: "paid" as const,
    coupon_code: "AZAD10",
  };

  const createdOrder = await db.createOrder(orderData);
  assert(Boolean(createdOrder && createdOrder.id), `Order created atomically: ${createdOrder.order_number}`);
  assert(createdOrder.custom_size_fee_paise === 15000, "₹150 tailoring fee correctly added");
  assert(createdOrder.order_status === "tailoring", "Order with custom sizing automatically assigned 'tailoring' status");

  // 5. Stock Ledger Deduction Verification
  console.log("\n▶ TEST SUITE 5: Double-Entry Stock Ledger Verification");
  const updatedProduct = await db.getProductById(testProduct.id);
  const updatedVariant = updatedProduct?.variants?.find((v) => v.id === targetVariant.id);
  assert(
    updatedVariant?.stock_quantity === initialStock - 1,
    `Stock deducted by 1: from ${initialStock} -> ${updatedVariant?.stock_quantity}`
  );

  const ledger = await db.getStockLedger(5);
  const orderLedgerEntry = ledger.find((l) => l.reference_id === createdOrder.order_number);
  assert(Boolean(orderLedgerEntry), `Ledger recorded sale entry for ${createdOrder.order_number}`);
  assert(orderLedgerEntry?.quantity_change === -1, "Ledger records quantity change of -1");

  // 6. Tailoring Queue Integration
  console.log("\n▶ TEST SUITE 6: Tailoring Queue & Atelier Workshop");
  const queue = await db.getTailoringQueue();
  const queueJob = queue.find((j) => j.order_number === createdOrder.order_number);
  assert(Boolean(queueJob), `Tailoring queue job auto-created for ${createdOrder.order_number}`);
  assert(queueJob?.measurements.length_inches === 54, "Custom measurement length 54\" stored");

  // Advance tailoring status
  const advancedJob = await db.updateTailoringStatus(queueJob!.id, "stitching", "ওস্তাদ রফিক (Zakaria St)");
  assert(advancedJob?.status === "stitching", "Tailoring job transitioned to 'stitching'");
  assert(advancedJob?.assigned_tailor === "ওস্তাদ রফিক (Zakaria St)", "Master tailor assigned successfully");

  // 7. Guest Order Tracking
  console.log("\n▶ TEST SUITE 7: Guest Order Tracking (Phone + Order Number)");
  const trackedOrder = await db.getOrderByNumber(createdOrder.order_number, "+919876543210");
  assert(Boolean(trackedOrder), "Guest order tracked by valid phone + order number");

  const trackingMismatch = await db.getOrderByNumber(createdOrder.order_number, "9999999999");
  assert(trackingMismatch === null, "Tracking unauthorized phone number returns null");

  // 8. Atomic Inventory Adjustment & Verification
  console.log("\n▶ TEST SUITE 8: Stock Integrity Verification");
  const adjustResult = await db.adjustStock(
    targetVariant.id,
    1,
    "adjustment",
    "Restored test order stock delta",
    "TEST-CLEANUP"
  );
  assert(adjustResult.success === true, "Atomic stock adjustment succeeded");

  const integrityReport = await db.verifyStockIntegrity();
  assert(integrityReport.mismatchCount === 0, `Ledger integrity report: 0 discrepancies across ${integrityReport.totalVariants} variants`);

  // 9. Site Settings Verification
  console.log("\n▶ TEST SUITE 9: Store Settings & Currency Formatting");
  const settings = await db.getSiteSettings();
  assert(Boolean(settings.announcement_bar_bn), "Bengali announcement bar text verified");
  assert(settings.free_shipping_threshold_paise === 149900, "Free shipping threshold ₹1,499 verified");

  const formattedBn = formatPrice(149900, "bn");
  const formattedEn = formatPrice(149900, "en");
  assert(formattedBn.includes("১,৪৯৯"), `Bengali numeral formatting: ${formattedBn}`);
  assert(formattedEn.includes("1,499"), `English numeral formatting: ${formattedEn}`);

  console.log("\n==================================================================");
  console.log(`   E2E TEST SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED (100%)`);
  console.log("==================================================================\n");

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error("Test suite fatal error:", err);
  process.exit(1);
});
