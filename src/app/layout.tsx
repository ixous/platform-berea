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

  return {
    title: {
      template: `%s | ${siteName}`,
      default: fullTitle,
    },
    description: siteDescription,
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
    openGraph: {
      type: "website",
      locale: "es_MX",
      siteName,
      title: fullTitle,
      description: siteDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: siteDescription,
    },
    icons: {
      icon: "/images/logo.png",
      apple: "/images/logo.png",
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
