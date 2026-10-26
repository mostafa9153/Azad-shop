import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface ProcessedImageResult {
  url: string;
  originalName: string;
  width?: number;
  height?: number;
  hash: string;
}

/**
 * Creates luxury SVG placeholder for product or category when images are missing or being generated
 */
export function generateLuxuryPlaceholderSvg(title: string, category: string, primaryColor: string = "#14372E"): string {
  const safeTitle = title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const safeCat = category.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="100%" height="100%">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FBF7F0"/>
      <stop offset="100%" stop-color="#E9DDC9"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#C5A059"/>
      <stop offset="50%" stop-color="#A8834A"/>
      <stop offset="100%" stop-color="#805F2B"/>
    </linearGradient>
  </defs>
  <rect width="1000" height="1200" fill="url(#bg)"/>
  
  <!-- Mihrab Arch Motif Outline -->
  <path d="M 120 900 L 120 400 C 120 220 260 120 400 70 C 540 120 680 220 680 400 L 680 900 Z" 
        fill="none" stroke="url(#gold)" stroke-width="2.5" opacity="0.45"/>
  <path d="M 140 900 L 140 410 C 140 245 270 145 400 95 C 530 145 660 245 660 410 L 660 900 Z" 
        fill="none" stroke="${primaryColor}" stroke-width="1.2" opacity="0.3"/>

  <!-- Islamic Geometric 8-point Star Centerpiece -->
  <g transform="translate(400, 360) scale(1.1)">
    <rect x="-40" y="-40" width="80" height="80" fill="none" stroke="url(#gold)" stroke-width="2" rx="4"/>
    <rect x="-40" y="-40" width="80" height="80" fill="none" stroke="url(#gold)" stroke-width="2" rx="4" transform="rotate(45)"/>
    <circle cx="0" cy="0" r="16" fill="${primaryColor}" opacity="0.8"/>
    <circle cx="0" cy="0" r="6" fill="#FBF7F0"/>
  </g>

  <!-- Typography -->
  <text x="400" y="550" font-family="'Hind Siliguri', 'Cormorant Garamond', serif" font-size="28" font-weight="600" fill="${primaryColor}" text-anchor="middle" letter-spacing="1">
    ${safeTitle}
  </text>
  <text x="400" y="595" font-family="'Jost', sans-serif" font-size="16" font-weight="500" fill="#A8834A" text-anchor="middle" letter-spacing="2">
    ${safeCat.toUpperCase()}
  </text>
  <text x="400" y="640" font-family="'Hind Siliguri', serif" font-size="14" fill="#666666" text-anchor="middle">
    আজাদ হায়া • খাঁটি শালীন পোশাক
  </text>

  <!-- Bottom Arch Baseline -->
  <line x1="200" y1="720" x2="600" y2="720" stroke="url(#gold)" stroke-width="1.5" stroke-dasharray="8 6" opacity="0.6"/>
</svg>`;
}

/**
 * Saves uploaded image buffer or base64 to public/uploads directory
 */
export async function processAndSaveImage(
  buffer: Buffer,
  originalFilename: string,
  subfolder: string = "products"
): Promise<ProcessedImageResult> {
  const hash = crypto.createHash("sha256").update(buffer).digest("hex").slice(0, 12);
  const ext = path.extname(originalFilename).toLowerCase() || ".webp";
  const cleanBase = path.basename(originalFilename, ext).replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase();
  const filename = `${cleanBase}_${hash}${ext}`;

  const targetDir = path.join(process.cwd(), "public", "uploads", subfolder);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const filePath = path.join(targetDir, filename);
  fs.writeFileSync(filePath, buffer);

  return {
    url: `/uploads/${subfolder}/${filename}`,
    originalName: originalFilename,
    hash,
  };
}
