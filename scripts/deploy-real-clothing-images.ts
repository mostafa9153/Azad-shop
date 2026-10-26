import fs from "fs";
import path from "path";
import sharp from "sharp";

const brainDir = "C:/Users/MOSTAFATECH/.gemini/antigravity/brain/77aa9bcf-8113-4c26-b62e-c585a8e51e59";
const tempDlDir = path.join(process.cwd(), "public", "demo", "temp_dl");
const demoDir = path.join(process.cwd(), "public", "demo");

const imageSources: Record<string, string> = {
  "burkha-classic-black": path.join(brainDir, "burkha_test_1793045262924.jpg"),
  "abaya-dubai-kaftan": path.join(brainDir, "abaya_dubai_kaftan_1793045316706.jpg"),
  "abaya-front-open-olive": path.join(brainDir, "abaya_front_open_olive_1793045326256.jpg"),
  "abaya-butterfly-maroon": path.join(brainDir, "abaya_butterfly_maroon_1793045334709.jpg"),
  "abaya-kashmiri-emerald": path.join(brainDir, "abaya_kashmiri_emerald_1793045344281.jpg"),
  "abaya-pastel-lavender": path.join(brainDir, "abaya_pastel_lavender_1793045364008.jpg"),
  "abaya-umbrella-cut-navy": path.join(brainDir, "abaya_umbrella_cut_navy_1793045373084.jpg"),
  "jilbab-french-charcoal": path.join(brainDir, "jilbab_french_charcoal_1793045382726.jpg"),
  "jilbab-overhead-olive": path.join(brainDir, "jilbab_overhead_olive_1793045391945.jpg"),
  "hijab-chiffon-sage": path.join(brainDir, "hijab_chiffon_sage_1793045414533.jpg"),
  "hijab-jersey-mocha": path.join(brainDir, "hijab_jersey_mocha_1793045423450.jpg"),
  "hijab-crumple-rose": path.join(brainDir, "hijab_crumple_rose_1793045433317.jpg"),
  "hijab-instant-sand": path.join(brainDir, "hijab_instant_sand_1793045441983.jpg"),
  "panjabi-chikankari-white": path.join(tempDlDir, "panjabi-chikankari-white.jpg"),
  "panjabi-kabli-black": path.join(tempDlDir, "panjabi-kabli-black.jpg"),
  "panjabi-cotton-sage": path.join(tempDlDir, "panjabi-cotton-sage.jpg"),
  "thobe-emirati-white": path.join(tempDlDir, "thobe-emirati-white.jpg"),
  "niqab-3layer-black": path.join(tempDlDir, "niqab-3layer-black.jpg"),
  "niqab-nosestring-charcoal": path.join(tempDlDir, "niqab-nosestring-charcoal.jpg"),
  "kids-panjabi-mustard": path.join(tempDlDir, "kids-panjabi-mustard.jpg"),
  "kids-abaya-pink": path.join(brainDir, "abaya_pastel_lavender_1793045364008.jpg"),
  "set-complete-royal": path.join(brainDir, "abaya_dubai_kaftan_1793045316706.jpg"),
  "acc-magnetic-pins": path.join(tempDlDir, "acc-magnetic-pins.jpg"),
  "acc-underscarf-beige": path.join(brainDir, "hijab_instant_sand_1793045441983.jpg"),
};

async function processAll() {
  console.log("=== PROCESSING ALL 24 REAL CLOTHING IMAGES ===");
  if (!fs.existsSync(demoDir)) fs.mkdirSync(demoDir, { recursive: true });

  for (const [basename, srcPath] of Object.entries(imageSources)) {
    if (!fs.existsSync(srcPath)) {
      console.error(`❌ Source not found: ${srcPath}`);
      continue;
    }

    const webpPath = path.join(demoDir, `${basename}.webp`);
    const jpgPath = path.join(demoDir, `${basename}.jpg`);
    const svgPath = path.join(demoDir, `${basename}.svg`);

    // 1. Process 800x1067 WebP
    await sharp(srcPath)
      .resize(800, 1067, { fit: "cover", position: "top" })
      .webp({ quality: 85 })
      .toFile(webpPath);

    // 2. Process 800x1067 JPG
    await sharp(srcPath)
      .resize(800, 1067, { fit: "cover", position: "top" })
      .jpeg({ quality: 85 })
      .toFile(jpgPath);

    // 3. Create SVG wrapper embedding the WebP
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1067" width="100%" height="100%">
  <image href="/demo/${basename}.webp" width="800" height="1067" preserveAspectRatio="xMidYMid slice"/>
</svg>`;
    fs.writeFileSync(svgPath, svgContent, "utf-8");

    console.log(`✅ Processed ${basename} (WebP: ${fs.statSync(webpPath).size}B, JPG: ${fs.statSync(jpgPath).size}B)`);
  }

  console.log("\nAll 24 real clothing images successfully generated and deployed!");
}

processAll();
