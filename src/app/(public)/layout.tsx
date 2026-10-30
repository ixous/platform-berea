import { Bodoni_Moda, Manrope } from "next/font/google";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni-moda",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const revalidate = 300;

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${bodoni.variable} ${manrope.variable} site-root flex min-h-screen flex-col bg-site-paper text-site-text`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-site-ink focus:px-4 focus:py-2 focus:text-sm focus:text-white focus:outline-none"
      >
        Saltar al contenido
      </a>
      <SiteHeader />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
