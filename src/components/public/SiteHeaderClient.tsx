"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { SITE_NAV, SITE_CTA } from "@/lib/public/site-navigation";

export function SiteHeaderClient() {
  const pathname = usePathname();
  const overlay = pathname === "/";
  const [scrolled, setScrolled] = useState(() => {
    if (overlay && typeof window !== "undefined") return window.scrollY > 24;
    return !overlay;
  });
  const [open, setOpen] = useState(false);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) firstLinkRef.current?.focus();
  }, [open]);

  const solid = scrolled || open;
  const ink = solid ? "text-site-ink" : "text-white";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? "border-b border-site-line bg-site-paper/95 backdrop-blur supports-[backdrop-filter]:bg-site-paper/85" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-[76rem] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className={`flex flex-shrink-0 items-center gap-3 ${ink}`}>
          <Image
            src="/images/logo.png"
            alt="Centro Cristiano Berea"
            width={44}
            height={44}
            className="h-10 w-10 rounded-full object-contain"
          />
          <span className="hidden whitespace-nowrap text-base font-semibold tracking-tight sm:block">
            Centro Cristiano Berea
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegación principal">
          {SITE_NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-gold ${
                  active
                    ? "text-site-gold"
                    : `${ink} ${solid ? "hover:bg-site-cream" : "hover:text-white/70"}`
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={SITE_CTA.href}
            className="hidden rounded-full bg-site-gold px-5 py-2.5 text-sm font-semibold text-site-ink transition-colors hover:bg-site-gold-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-gold focus-visible:ring-offset-2 focus-visible:ring-offset-site-paper lg:inline-flex"
          >
            {SITE_CTA.label}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={`rounded-full p-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-gold lg:hidden ${
              solid ? "text-site-ink hover:bg-site-cream" : "text-white hover:bg-white/10"
            }`}
            aria-expanded={open}
            aria-controls="site-mobile-menu"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="site-mobile-menu"
          className="max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-site-line bg-site-paper shadow-xl lg:hidden"
          role="dialog"
          aria-label="Menú de navegación"
        >
          <nav className="flex flex-col gap-1 px-4 py-6" aria-label="Navegación móvil">
            {SITE_NAV.map((item, i) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  ref={i === 0 ? firstLinkRef : undefined}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-4 py-3 text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-gold ${
                    active ? "bg-site-cream text-site-gold" : "text-site-ink hover:bg-site-cream"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href={SITE_CTA.href}
              onClick={() => setOpen(false)}
              className="mt-4 rounded-full bg-site-gold px-5 py-3.5 text-center text-base font-semibold text-site-ink transition-colors hover:bg-site-gold-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-gold"
            >
              {SITE_CTA.label}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
