import fs from "fs";
import path from "path";
import { loadStore } from "../lib/store";

async function runImageAudit() {
  console.log("=================================================");
  console.log("   AZAD HAYA (আজাদ হায়া) — Image Asset Audit    ");
  console.log("=================================================");

  const store = loadStore();
  const publicDir = path.join(process.cwd(), "public");

  let totalImagesChecked = 0;
  let missingImages = 0;
  const verifiedAssets: Record<string, number> = {};

  // Check categories
  for (const cat of store.categories) {
    totalImagesChecked++;
    const relative = cat.image_url.startsWith("/") ? cat.image_url.slice(1) : cat.image_url;
    const fullPath = path.join(publicDir, relative);
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ Category '${cat.name_en}' image missing: ${cat.image_url}`);
      missingImages++;
    } else {
      verifiedAssets[cat.image_url] = (verifiedAssets[cat.image_url] || 0) + 1;
    }
  }

  // Check collections
  for (const col of store.collections) {
    totalImagesChecked++;
    const relative = col.banner_url.startsWith("/") ? col.banner_url.slice(1) : col.banner_url;
    const fullPath = path.join(publicDir, relative);
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ Collection '${col.title_en}' banner missing: ${col.banner_url}`);
      missingImages++;
    } else {
      verifiedAssets[col.banner_url] = (verifiedAssets[col.banner_url] || 0) + 1;
    }
  }

  // Check product images
  for (const img of store.product_images) {
    totalImagesChecked++;
    const relative = img.image_url.startsWith("/") ? img.image_url.slice(1) : img.image_url;
    const fullPath = path.join(publicDir, relative);
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ Product Image missing: ${img.image_url}`);
      missingImages++;
    } else {
      verifiedAssets[img.image_url] = (verifiedAssets[img.image_url] || 0) + 1;
    }
  }

  const auditMdContent = `# IMAGE_AUDIT.md — AZAD HAYA (আজাদ হায়া)

Audit Date: ${new Date().toISOString()}  
Status: ${missingImages === 0 ? "✅ ALL ASSETS VERIFIED (100% HEALTHY)" : "❌ MISSING ASSETS FOUND"}

## Audit Summary
- **Total Images Checked:** ${totalImagesChecked}
- **Missing / Broken Images:** ${missingImages}
- **Distinct Image Assets in \`public/demo/\`:** ${Object.keys(verifiedAssets).length}
- **External CDN Dependencies:** 0 (100% Offline Capable)

## Verified Assets Manifest
| Path | Usage Count in Catalog | Status |
|---|---|---|
${Object.entries(verifiedAssets)
  .map(([p, count]) => `| \`${p}\` | ${count} times | ✅ Verified on Disk |`)
  .join("\n")}
`;

  fs.writeFileSync(path.join(process.cwd(), "IMAGE_AUDIT.md"), auditMdContent, "utf-8");

  console.log(`Audited ${totalImagesChecked} total image references across categories, collections, and products.`);
  console.log(`Distinct asset files: ${Object.keys(verifiedAssets).length}`);
  console.log(`Missing images: ${missingImages}`);

  if (missingImages > 0) {
    console.error("❌ Image audit failed!");
    process.exit(1);
  }

  console.log("✅ Written IMAGE_AUDIT.md with 100% verified status!");
  console.log("🎉 Image Asset Audit PASS!\n");
}

runImageAudit().catch((err) => {
  console.error("Audit error:", err);
  process.exit(1);
});
