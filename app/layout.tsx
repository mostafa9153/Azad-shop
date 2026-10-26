import type { Metadata } from "next";
import { cormorant, jost, hindSiliguri, notoSerifBengali } from "@/lib/fonts";
import { brandConfig } from "@/config/brand.config";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: `${brandConfig.name.en} | ${brandConfig.name.bn} — ${brandConfig.tagline.bn}`,
  description: brandConfig.description.bn,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      className={`${cormorant.variable} ${jost.variable} ${hindSiliguri.variable} ${notoSerifBengali.variable}`}
    >
      <body className="min-h-screen bg-[#FBF7F0] text-[#1C1B18] antialiased">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
