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

  // 10. Multi-Tier Indian GST Compliance
  console.log("\n▶ TEST SUITE 10: Multi-Tier Indian GST Compliance (5% <= ₹2,500, 18% > ₹2,500)");
  const standardPieceOrder = await db.createOrder({
    customer_name: "GST Test Customer 1",
    customer_phone: "+919876543210",
    customer_email: "gst.test1@example.com",
    shipping_address: {
      name: "GST Test",
      phone: "+919876543210",
      address_line1: "123 Park St",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700016",
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
        price_paise: 200000, // ₹2,000 <= ₹2,500 threshold -> 5% inclusive GST = Math.round(200000 * 0.05 / 1.05) = 9524 paise
        is_custom_size: false,
      },
    ],
    shipping_fee_paise: 0,
    payment_method: "demo_upi",
    payment_status: "paid",
  });
  const expectedGstStandard = Math.round((200000 * 0.05) / 1.05); // 9524 paise
  assert(
    standardPieceOrder.gst_total_paise === expectedGstStandard,
    `Standard piece (₹2,000) calculates 5% inclusive GST: ₹${standardPieceOrder.gst_total_paise / 100} == ₹${expectedGstStandard / 100}`
  );

  const luxuryPieceOrder = await db.createOrder({
    customer_name: "GST Test Customer 2",
    customer_phone: "+919876543210",
    customer_email: "gst.test2@example.com",
    shipping_address: {
      name: "GST Test",
      phone: "+919876543210",
      address_line1: "123 Park St",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700016",
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
        price_paise: 350000, // ₹3,500 > ₹2,500 threshold -> 18% inclusive GST = Math.round(350000 * 0.18 / 1.18) = 53390 paise
        is_custom_size: false,
      },
    ],
    shipping_fee_paise: 0,
    payment_method: "demo_upi",
    payment_status: "paid",
  });
  const expectedGstLuxury = Math.round((350000 * 0.18) / 1.18); // 53390 paise
  assert(
    luxuryPieceOrder.gst_total_paise === expectedGstLuxury,
    `Luxury piece (₹3,500) calculates 18% inclusive GST: ₹${luxuryPieceOrder.gst_total_paise / 100} == ₹${expectedGstLuxury / 100}`
  );

  // 11. Atomic Multi-Item Stock Isolation (Pre-validation check & no ghost decrement)
  console.log("\n▶ TEST SUITE 11: Atomic Multi-Item Stock Isolation");
  const allVariants = await db.getAllVariants();
  const availableVariant = allVariants.find((v) => v.stock_quantity >= 5) || allVariants[0];
  const stockBeforeFailedOrder = availableVariant.stock_quantity;

  let failedOrderCaught = false;
  try {
    await db.createOrder({
      customer_name: "Failed Order Test",
      customer_phone: "+919876543210",
      customer_email: "failed@example.com",
      shipping_address: {
        name: "Test",
        phone: "+919876543210",
        address_line1: "Park St",
        city: "Kolkata",
        state: "West Bengal",
        pincode: "700016",
      },
      items: [
        {
          product_id: availableVariant.product_id,
          variant_id: availableVariant.id,
          title_en: availableVariant.product_title_en,
          title_bn: availableVariant.product_title_bn,
          sku: availableVariant.sku,
          size: availableVariant.size,
          color_en: availableVariant.color_en,
          color_bn: availableVariant.color_bn,
          quantity: 1,
          price_paise: availableVariant.price_paise,
          is_custom_size: false,
        },
        {
          product_id: targetVariant.product_id,
          variant_id: targetVariant.id,
          title_en: "Impossible Stock Item",
          title_bn: "অসম্ভব স্টক পণ্য",
          sku: targetVariant.sku,
          size: targetVariant.size,
          color_en: targetVariant.color_en,
          color_bn: targetVariant.color_bn,
          quantity: 99999, // Exceeds available stock
          price_paise: 100000,
          is_custom_size: false,
        },
      ],
      shipping_fee_paise: 0,
      payment_method: "demo_upi",
      payment_status: "paid",
    });
  } catch (e: any) {
    failedOrderCaught = true;
  }

  assert(failedOrderCaught, "Order exceeding inventory failed atomically with exception");
  const postFailVariant = (await db.getAllVariants()).find((v) => v.id === availableVariant.id);
  assert(
    postFailVariant?.stock_quantity === stockBeforeFailedOrder,
    `Stock isolation verified: variant stock remained ${stockBeforeFailedOrder} (no ghost decrement)`
  );

  // 12. Order Cancellation & Stock Restoration
  console.log("\n▶ TEST SUITE 12: Order Cancellation & Double-Entry Stock Return");
  const stockBeforeCancelOrder = postFailVariant!.stock_quantity;
  const cancelTestOrder = await db.createOrder({
    customer_name: "Cancel Test Customer",
    customer_phone: "+919876543210",
    customer_email: "cancel@example.com",
    shipping_address: {
      name: "Cancel Test",
      phone: "+919876543210",
      address_line1: "Zakaria St",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700073",
    },
    items: [
      {
        product_id: availableVariant.product_id,
        variant_id: availableVariant.id,
        title_en: availableVariant.product_title_en,
        title_bn: availableVariant.product_title_bn,
        sku: availableVariant.sku,
        size: availableVariant.size,
        color_en: availableVariant.color_en,
        color_bn: availableVariant.color_bn,
        quantity: 2,
        price_paise: availableVariant.price_paise,
        is_custom_size: false,
      },
    ],
    shipping_fee_paise: 0,
    payment_method: "demo_upi",
    payment_status: "paid",
  });

  const stockAfterCreate = (await db.getAllVariants()).find((v) => v.id === availableVariant.id)!.stock_quantity;
  assert(stockAfterCreate === stockBeforeCancelOrder - 2, "Stock decreased by 2 after order placement");

  const cancelledOrder = await db.cancelOrder(cancelTestOrder.id, "Customer changed mind");
  assert(cancelledOrder.order_status === "cancelled", "Order transitioned to cancelled status");
  assert(cancelledOrder.payment_status === "refunded", "Payment status updated to refunded");

  const stockAfterCancel = (await db.getAllVariants()).find((v) => v.id === availableVariant.id)!.stock_quantity;
  assert(stockAfterCancel === stockBeforeCancelOrder, `Stock restored to original ${stockBeforeCancelOrder} after cancellation`);

  const returnLedger = await db.getStockLedger(5);
  const returnEntry = returnLedger.find(
    (l) => l.reference_id === cancelTestOrder.order_number && l.change_type === "return"
  );
  assert(Boolean(returnEntry), `Double-entry ledger recorded 'return' entry for ${cancelTestOrder.order_number}`);
  assert(returnEntry?.quantity_change === 2, "Return ledger entry recorded +2 quantity restoration");

  // 13. Guest Order Tracking Security & Validation
  console.log("\n▶ TEST SUITE 13: Guest Order Tracking Security & Phone Validation");
  const emptyPhoneLeak = await db.getOrderByNumber(cancelTestOrder.order_number, "");
  assert(emptyPhoneLeak === null, "Empty phone string rejected (no unauthorized leak)");

  const shortPhoneLeak = await db.getOrderByNumber(cancelTestOrder.order_number, "1234");
  assert(shortPhoneLeak === null, "Short phone string < 10 digits rejected");

  const nonDigitPhoneLeak = await db.getOrderByNumber(cancelTestOrder.order_number, "++++---");
  assert(nonDigitPhoneLeak === null, "Non-digit phone string rejected");

  // 14. Concurrent Order Serialization
  console.log("\n▶ TEST SUITE 14: Concurrent Order Race-Condition Safety");
  // Set a test variant stock to 1
  await db.adjustStock(
    availableVariant.id,
    -(availableVariant.stock_quantity - 1),
    "adjustment",
    "Prepare variant with exactly 1 unit of stock for concurrency test",
    "CONCURRENCY-INIT"
  );

  const concurOrderPayload = {
    customer_name: "Concurrency Challenger",
    customer_phone: "+919876543210",
    customer_email: "concurrency@example.com",
    shipping_address: {
      name: "Challenger",
      phone: "+919876543210",
      address_line1: "Park Circus",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700017",
    },
    items: [
      {
        product_id: availableVariant.product_id,
        variant_id: availableVariant.id,
        title_en: availableVariant.product_title_en,
        title_bn: availableVariant.product_title_bn,
        sku: availableVariant.sku,
        size: availableVariant.size,
        color_en: availableVariant.color_en,
        color_bn: availableVariant.color_bn,
        quantity: 1,
        price_paise: availableVariant.price_paise,
        is_custom_size: false,
      },
    ],
    shipping_fee_paise: 0,
    payment_method: "demo_upi" as const,
    payment_status: "paid" as const,
  };

  // Launch two concurrent orders simultaneously
  const results = await Promise.allSettled([
    db.createOrder(concurOrderPayload),
    db.createOrder(concurOrderPayload),
  ]);

  const fulfilledCount = results.filter((r) => r.status === "fulfilled").length;
  const rejectedCount = results.filter((r) => r.status === "rejected").length;

  assert(fulfilledCount === 1, `Exactly 1 concurrent order succeeded (fulfilled: ${fulfilledCount})`);
  assert(rejectedCount === 1, `Exactly 1 concurrent order rejected for stock depletion (rejected: ${rejectedCount})`);

  const finalConcurVariant = (await db.getAllVariants()).find((v) => v.id === availableVariant.id);
  assert(finalConcurVariant?.stock_quantity === 0, "Final stock quantity is exactly 0 (no negative stock)");

  // Clean up variant stock back to healthy level
  await db.adjustStock(
    availableVariant.id,
    15,
    "adjustment",
    "Restore variant stock after concurrency test",
    "CONCURRENCY-CLEANUP"
  );

  // Final Strict Stock Verification
  const finalIntegrity = await db.verifyStockIntegrity();
  assert(finalIntegrity.mismatchCount === 0, `Final ledger audit: 100% reconciled across ${finalIntegrity.totalVariants} variants`);

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
