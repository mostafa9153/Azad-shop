# AGENTS.md — AZAD HAYA (আজাদ হায়া) UNATTENDED RULES

## Project Identity & Settings
- BRAND_NAME = "AZAD HAYA"
- BRAND_NAME_BN = "আজাদ হায়া"
- TAGLINE_EN = "Modesty, beautifully made."
- TAGLINE_BN = "শালীনতায় সৌন্দর্য।"
- DEFAULT_LOCALE = bn
- CURRENCY = INR (₹)
- REGION = West Bengal, India
- DEMO_WHATSAPP = 919000000000
- DEMO_UPI_VPA = azadhaya@demo
- DEMO_SHOP = Kolkata, West Bengal (10:00 - 21:00)
- GST_DEFAULT = 5% for pieces priced up to ₹2,500, 18% above (prices GST-inclusive)

## Core Unattended Operating Rules
1. NEVER ask questions and never wait. Decide the most reasonable option, log in DECISIONS.md, and continue.
2. If something external is missing, use the fallback, mark "blocked: needs X" in PROGRESS.md, and continue.
3. Buildable and committed after every phase. Never leave a phase half-broken.
4. Time-box: max 4 fix attempts per issue, log under Known issues in PROGRESS.md.
5. Low-spec laptop safety: run ONE heavy process at a time, Chromium only, kill stray processes.
6. Memory = AGENTS.md + PROGRESS.md + DECISIONS.md.
7. The loop for EVERY phase: Plan -> Build -> typecheck + build -> verify in browser (390 mobile + 1440 desktop in bn & en) -> fix loop -> regression smoke -> update PROGRESS.md -> git commit -> next phase.
8. Never write PASS unless actually tested.
9. Final MORNING_REPORT.md at the end.

## Tech Stack
- Next.js 15 App Router + TypeScript strict + Tailwind v4
- shadcn/ui + Radix primitives (restyled)
- Framer Motion (light)
- Bilingual i18n (bn default, en fallback)
- Supabase (Postgres, Auth, Storage, RLS, @supabase/ssr) + typed local fallback store
- Zustand store (cart, wishlist)
- Zod validators
- Recharts (dynamic import)
- qrcode (UPI QR generation)
- Playwright (Chromium only)

## Brand & Design Rules
- White-label: All config in `/config/brand.config.ts`
- Colors: Cream `#FBF7F0`, Sand `#E9DDC9`, Forest Green `#14372E`, Antique Gold `#A8834A`, Charcoal `#1C1B18`, Sage `#DDE5DB`
- Mihrab-style arch shapes for category cards & hero frames
- Mobile-first: sticky bottom nav, 44px touch targets, 16px body font
- Header: grid 1fr auto 1fr, no overlap at any width (360px to 1920px)
- Bangla: Noto Serif Bengali / Hind Siliguri, no letter-spacing or uppercase on Bangla text, line-height 1.7-1.8
- India rules: Paise internally, +91 mobile, 6-digit pincode, GST breakdown, UPI QR, COD
