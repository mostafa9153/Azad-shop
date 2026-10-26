import { verifyStockIntegrity } from "../lib/store";

async function main() {
  console.log("=================================================");
  console.log("   AZAD HAYA (আজাদ হায়া) — Stock Audit Runner    ");
  console.log("=================================================");

  const report = await verifyStockIntegrity();
  console.log(`Total Variants Audited: ${report.totalVariants}`);
  console.log(`Healthy / In-Sync Variants: ${report.healthyCount}`);
  console.log(`Discrepancy / Mismatch Count: ${report.mismatchCount}`);

  if (report.mismatchCount > 0) {
    console.error("❌ Stock integrity mismatch found:");
    console.table(report.discrepancies);
    process.exit(1);
  }

  console.log("\n✅ 100% OF PRODUCT VARIANTS ARE MATHEMATICALLY RECONCILED WITH STOCK LEDGER!");
  console.log("🎉 Stock Ledger Integrity PASS!\n");
}

main().catch((err) => {
  console.error("Verification error:", err);
  process.exit(1);
});
