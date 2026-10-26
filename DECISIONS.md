# DECISIONS.md — AZAD HAYA (আজাদ হায়া) Architectural Log

| ID | Decision | Context / Rationale | Date |
|---|---|---|---|
| DEC-001 | Hybrid Data Layer (Supabase + Local Mock Fallback) | If `.env.local` keys are missing or invalid, system automatically operates in Local-First Demo Mode with all 60+ products, stock ledger, RPCs, orders, and tailoring queue working seamlessly in memory/storage so the entire app can be built and demonstrated unattended. | 2026-10-26 |
| DEC-002 | Bilingual Routing & Architecture | Implemented cookie/URL-aware bilingual support (`/bn` and `/en`) with `/` redirecting to `/bn` by default as West Bengal Islamic clothing market primary language. | 2026-10-26 |
| DEC-003 | Zero External CDNs for Product Images | All seed and demo images placed directly in `public/demo/` with responsive WebP sizes and fallback SVGs to guarantee zero broken images offline. | 2026-10-26 |
| DEC-004 | Integer Paise Everywhere for Financial Calculations | All currency calculations in INR paise (1 INR = 100 paise) to prevent floating point inaccuracies in discounts, GST, and totals. | 2026-10-26 |
| DEC-005 | Demo Pay Gateway Emulation | Built full HMAC-signed Demo Pay system (UPI QR with live countdown, test cards with OTP simulation, netbanking, wallets) matching production gateway contracts. | 2026-10-26 |
| DEC-006 | Real Modest Clothing Photography Deployment | Replaced architectural Mihrab vector placeholder cards with 24 high-resolution 800x1067 WebP/JPG studio product photographs representing authentic modest attire (Burkha, Abaya, Jilbab, Hijab, Niqab, Panjabi, Thobe, Kids, Accessories) with backward-compatible SVG proxy wrappers. | 2026-10-27 |
