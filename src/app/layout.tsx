import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { db } from "@/lib/db";
import { settings } from "@/lib/db/schema";
import { isNull } from "drizzle-orm";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function readValue(v: unknown, key = "es"): string {
  const obj = v as Record<string, unknown> | undefined;
  const val = obj?.[key];
  return typeof val === "string" && val ? val : "";
}

export async function generateMetadata(): Promise<Metadata> {
  let siteName = "Centro Cristiano Berea";
  let siteDescription =
    "Sitio web oficial de Centro Cristiano Berea. Una iglesia comprometida con la Palabra de Dios, ubicada en Mexicali, Baja California, México.";

  try {
    const rows = await db.select().from(settings).where(isNull(settings.deletedAt));
    const map: Record<string, unknown> = {};
    for (const r of rows) map[r.key] = r.value;
    siteName = readValue(map.site_name) || siteName;
    siteDescription = readValue(map.site_description) || siteDescription;
  } catch {
    // fallback a valores por defecto
  }

  const fullTitle = `${siteName} | Mexicali, Baja California`;
  const rawBase = process.env.NEXT_PUBLIC_APP_URL || "https://www.centrocristianoberea.org";
  const metadataBase = new URL(rawBase.startsWith("http") ? rawBase : `https://${rawBase}`);

  return {
    title: {
      template: `%s | ${siteName}`,
      default: fullTitle,
    },
    description: siteDescription,
    metadataBase,
    openGraph: {
      type: "website",
      locale: "es_MX",
      siteName,
      title: fullTitle,
      description: siteDescription,
      images: [
        {
          url: "/images/logo.png",
          width: 720,
          height: 720,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: fullTitle,
      description: siteDescription,
      images: ["/images/logo.png"],
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon.png", type: "image/png", sizes: "192x192" },
      ],
      apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
      shortcut: "/favicon.ico",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-screen bg-background text-foreground">{children}</body>
    </html>
  );
}
