import fs from "fs";
import path from "path";

interface AssetSpec {
  filename: string;
  category: string;
  titleEn: string;
  titleBn: string;
  colorHex: string;
  accentHex: string;
  fabric: string;
}

const assets: AssetSpec[] = [
  { filename: "burkha-classic-black.svg", category: "Burkha", titleEn: "Classic Korean Nida Burkha", titleBn: "কোরিয়ান নিদা ক্লাসিক বোরকা", colorHex: "#1C1B18", accentHex: "#C5A059", fabric: "Korean Nida" },
  { filename: "abaya-dubai-kaftan.svg", category: "Abaya", titleEn: "Dubai Royal Kaftan Abaya", titleBn: "দুবাই রয়্যাল কাফতান আবায়া", colorHex: "#14372E", accentHex: "#E9DDC9", fabric: "Dubai Cherry" },
  { filename: "abaya-front-open-olive.svg", category: "Abaya", titleEn: "Front-Open Kimono Abaya", titleBn: "ফ্রন্ট-ওপেন কিমোনো আবায়া", colorHex: "#2D4B3E", accentHex: "#A8834A", fabric: "Zoom Crepe" },
  { filename: "abaya-butterfly-maroon.svg", category: "Abaya", titleEn: "Butterfly Flare Modest Abaya", titleBn: "বাটারফ্লাই ফ্লেয়ার আবায়া", colorHex: "#4A1521", accentHex: "#E9DDC9", fabric: "Soft Georgette" },
  { filename: "abaya-kashmiri-emerald.svg", category: "Abaya", titleEn: "Kashmiri Hand-Embroidered Abaya", titleBn: "কাশ্মীরি হাতের কাজের আবায়া", colorHex: "#0D2E24", accentHex: "#D4AF37", fabric: "Premium Nida" },
  { filename: "abaya-pastel-lavender.svg", category: "Abaya", titleEn: "Pastel Lavender Summer Abaya", titleBn: "ল্যাভেন্ডার সামার আবায়া", colorHex: "#4C3F54", accentHex: "#E9DDC9", fabric: "Linen Blend" },
  { filename: "abaya-umbrella-cut-navy.svg", category: "Abaya", titleEn: "Umbrella Cut Daily Abaya", titleBn: "আম্ব্রেলা কাট ডেইলি আবায়া", colorHex: "#1B2A4A", accentHex: "#99B2D8", fabric: "Dubai Nida" },
  { filename: "jilbab-french-charcoal.svg", category: "Jilbab", titleEn: "Two-Piece French Jilbab", titleBn: "টু-পিস ফ্রেঞ্চ জিলবাব সেট", colorHex: "#2B2D2F", accentHex: "#A8834A", fabric: "Medina Silk" },
  { filename: "jilbab-overhead-olive.svg", category: "Jilbab", titleEn: "Full Overhead Prayer Jilbab", titleBn: "ফুল ওভারহেড নামাজ জilবাব", colorHex: "#354A3E", accentHex: "#DDE5DB", fabric: "Wool Peach" },
  { filename: "hijab-chiffon-sage.svg", category: "Hijab", titleEn: "Premium Chiffon Hijab - Sage", titleBn: "প্রিমিয়াম শিফন হিজাব - সেজ", colorHex: "#5E7163", accentHex: "#DDE5DB", fabric: "Bubble Chiffon" },
  { filename: "hijab-jersey-mocha.svg", category: "Hijab", titleEn: "Soft Modal Jersey Hijab", titleBn: "নরম মোডাল জার্সি হিজাব", colorHex: "#4D382C", accentHex: "#E9DDC9", fabric: "Modal Cotton" },
  { filename: "hijab-crumple-rose.svg", category: "Hijab", titleEn: "Crumple Georgette Hijab", titleBn: "ক্র্যাম্পল জর্জেট হিজাব", colorHex: "#683B44", accentHex: "#F3D3D9", fabric: "Georgette" },
  { filename: "hijab-instant-sand.svg", category: "Hijab", titleEn: "Instant Slip-On Hijab", titleBn: "ইনস্ট্যান্ট স্লিপ-অন হিজাব", colorHex: "#8C7A65", accentHex: "#FBF7F0", fabric: "Jersey Spandex" },
  { filename: "niqab-3layer-black.svg", category: "Niqab", titleEn: "3-Layer Flap Breathable Niqab", titleBn: "৩-লেয়ার ফ্ল্যাপ নিকাব", colorHex: "#1A1A1A", accentHex: "#A8834A", fabric: "Chiffon Crepe" },
  { filename: "niqab-nosestring-charcoal.svg", category: "Niqab", titleEn: "Nose-String Comfort Niqab", titleBn: "নোজস্ট্রিং আরামদায়ক নিকাব", colorHex: "#282828", accentHex: "#CCCCCC", fabric: "Saudi Chiffon" },
  { filename: "panjabi-chikankari-white.svg", category: "Panjabi", titleEn: "Lucknowi Chikankari Panjabi", titleBn: "লখনউই চিকেনকারি পাঞ্জাবি", colorHex: "#F5F3EF", accentHex: "#A8834A", fabric: "Fine Cotton" },
  { filename: "panjabi-kabli-black.svg", category: "Panjabi", titleEn: "Traditional Kabli Panjabi Set", titleBn: "ঐতিহ্যবাহী কাবলি সেট", colorHex: "#1C1B18", accentHex: "#C5A059", fabric: "Cotton Slub" },
  { filename: "panjabi-cotton-sage.svg", category: "Panjabi", titleEn: "Handloom Cotton Summer Panjabi", titleBn: "হ্যান্ডলুম কটন সামার পাঞ্জাবি", colorHex: "#455A50", accentHex: "#DDE5DB", fabric: "Bengal Handloom" },
  { filename: "thobe-emirati-white.svg", category: "Panjabi", titleEn: "Emirati Tailored Jubba / Thobe", titleBn: "এমিরেতি লাক্সারি জুব্বা / থোব", colorHex: "#FAF9F6", accentHex: "#C5A059", fabric: "Toyobo Japanese Spun" },
  { filename: "kids-abaya-pink.svg", category: "Kids", titleEn: "Little Muslimah Floral Abaya", titleBn: "ছোটদের ফ্লোরাল আবায়া ফ্রক", colorHex: "#7A3B4F", accentHex: "#FDE2E8", fabric: "Soft Cotton Rayon" },
  { filename: "kids-panjabi-mustard.svg", category: "Kids", titleEn: "Junior Eid Festive Panjabi Set", titleBn: "বাচ্চাদের ঈদ স্পেশাল পাঞ্জাবি", colorHex: "#8B6B23", accentHex: "#F9E4B7", fabric: "Pure Cotton" },
  { filename: "set-complete-royal.svg", category: "Sets", titleEn: "Royal 3-Piece Set (Abaya+Hijab+Niqab)", titleBn: "রয়্যাল ৩-পিস শালীন কম্বো সেট", colorHex: "#14372E", accentHex: "#C5A059", fabric: "Nida + Chiffon" },
  { filename: "acc-magnetic-pins.svg", category: "Accessories", titleEn: "Matte Gold Magnetic Hijab Pins", titleBn: "ম্যাট গোল্ড ম্যাগনেটিক হিজাব পিন", colorHex: "#8C6D38", accentHex: "#FBF7F0", fabric: "Zinc Alloy" },
  { filename: "acc-underscarf-beige.svg", category: "Accessories", titleEn: "Cross-Front Cotton Underscarf", titleBn: "ক্রস-ফ্রন্ট আরামদায়ক ইনার ক্যাপ", colorHex: "#998573", accentHex: "#FBF7F0", fabric: "Organic Cotton" },
];

function buildSvg(item: AssetSpec): string {
  const isLight = item.colorHex === "#F5F3EF" || item.colorHex === "#FAF9F6";
  const textColor = isLight ? "#1C1B18" : "#FBF7F0";
  const subColor = isLight ? "#8C6D38" : "#E9DDC9";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad_${item.filename.replace(/[^a-zA-Z]/g, "")}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${item.colorHex}"/>
      <stop offset="100%" stop-color="${adjustBrightness(item.colorHex, -25)}"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E5C378"/>
      <stop offset="50%" stop-color="#C5A059"/>
      <stop offset="100%" stop-color="#997736"/>
    </linearGradient>
    <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-opacity="0.25"/>
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="600" height="800" fill="#FBF7F0"/>

  <!-- Inner Architectural Card -->
  <rect x="25" y="25" width="550" height="750" rx="20" fill="url(#bgGrad_${item.filename.replace(/[^a-zA-Z]/g, "")})" filter="url(#softShadow)"/>

  <!-- Islamic Geometric Pattern Border -->
  <rect x="40" y="40" width="520" height="720" rx="14" fill="none" stroke="${item.accentHex}" stroke-width="1.5" opacity="0.4" stroke-dasharray="8 6"/>

  <!-- Grand Mihrab Arch -->
  <path d="M 100 700 L 100 340 C 100 180 200 90 300 55 C 400 90 500 180 500 340 L 500 700 Z" 
        fill="none" stroke="url(#goldGrad)" stroke-width="3" opacity="0.7"/>
  <path d="M 120 700 L 120 350 C 120 205 210 115 300 85 C 390 115 480 205 480 350 L 480 700 Z" 
        fill="none" stroke="${item.accentHex}" stroke-width="1" opacity="0.3"/>

  <!-- Central Arabesque / Star Emblem -->
  <g transform="translate(300, 240)">
    <!-- 8 Point Rub el Hizb -->
    <rect x="-35" y="-35" width="70" height="70" fill="none" stroke="url(#goldGrad)" stroke-width="2.5" rx="3"/>
    <rect x="-35" y="-35" width="70" height="70" fill="none" stroke="url(#goldGrad)" stroke-width="2.5" rx="3" transform="rotate(45)"/>
    <circle cx="0" cy="0" r="14" fill="${item.accentHex}" opacity="0.8"/>
    <circle cx="0" cy="0" r="5" fill="#FBF7F0"/>
  </g>

  <!-- Apparel Silhouette Representation -->
  <g transform="translate(300, 390)" stroke="${item.accentHex}" stroke-width="2" fill="none" opacity="0.6">
    <path d="M -40 -30 L -80 80 L -110 200 L 110 200 L 80 80 L 40 -30 Z" stroke-dasharray="5 3"/>
    <path d="M -25 -30 C 0 -15 0 -15 25 -30" stroke-width="2.5"/>
    <line x1="0" y1="-20" x2="0" y2="190" stroke-dasharray="4 4" stroke-width="1.5"/>
  </g>

  <!-- Product Labels -->
  <text x="300" y="470" font-family="'Jost', sans-serif" font-size="13" font-weight="600" fill="${subColor}" text-anchor="middle" letter-spacing="3">
    ${item.category.toUpperCase()} • ${item.fabric.toUpperCase()}
  </text>

  <text x="300" y="515" font-family="'Noto Serif Bengali', 'Cormorant Garamond', serif" font-size="24" font-weight="700" fill="${textColor}" text-anchor="middle">
    ${item.titleBn}
  </text>

  <text x="300" y="545" font-family="'Cormorant Garamond', serif" font-size="18" font-style="italic" fill="${subColor}" text-anchor="middle">
    ${item.titleEn}
  </text>

  <!-- Brand Signature Footer -->
  <g transform="translate(300, 680)">
    <line x1="-120" y1="0" x2="120" y2="0" stroke="url(#goldGrad)" stroke-width="1.5" opacity="0.6"/>
    <circle cx="0" cy="0" r="4" fill="#C5A059"/>
    <text x="0" y="28" font-family="'Hind Siliguri', sans-serif" font-size="13" font-weight="500" fill="${subColor}" text-anchor="middle" letter-spacing="1">
      আজাদ হায়া • প্রিমিয়াম ইসলামিক পোশাক
    </text>
  </g>
</svg>`;
}

function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return `#${(
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  )
    .toString(16)
    .slice(1)}`;
}

export function generateAllDemoAssets(): number {
  const dir = path.join(process.cwd(), "public", "demo");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  let count = 0;
  for (const item of assets) {
    const fullPath = path.join(dir, item.filename);
    const baseName = item.filename.replace(/\.svg$/, "");
    const webpPath = path.join(dir, `${baseName}.webp`);

    if (fs.existsSync(webpPath)) {
      // Real photograph exists, embed photo in SVG proxy
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1067" width="100%" height="100%">
  <image href="/demo/${baseName}.webp" width="800" height="1067" preserveAspectRatio="xMidYMid slice"/>
</svg>`;
      fs.writeFileSync(fullPath, svg, "utf-8");
    } else {
      const svg = buildSvg(item);
      fs.writeFileSync(fullPath, svg, "utf-8");
    }
    count++;
  }

  return count;
}

if (require.main === module) {
  const total = generateAllDemoAssets();
  console.log(`✅ Generated ${total} verified luxury vector assets in public/demo/`);
}
