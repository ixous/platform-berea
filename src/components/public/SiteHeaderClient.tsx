"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { SITE_NAV, SITE_CTA } from "@/lib/public/site-navigation";

export function SiteHeaderClient() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

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

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid
          ? "border-b border-[#C9A227]/30 bg-[#0A1428]/95 shadow-lg backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-[76rem] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex flex-shrink-0 items-center gap-3 text-white transition-opacity hover:opacity-90"
        >
          <Image
            src="/images/logo.png"
            alt="Centro Cristiano Berea"
            width={44}
            height={44}
            className="h-10 w-10 rounded-full object-contain"
          />
          <span className="hidden whitespace-nowrap text-base font-semibold tracking-tight text-white sm:block">
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
                    ? "font-semibold text-site-gold"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
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
            className="relative hidden overflow-hidden rounded-full bg-site-gold px-5 py-2.5 text-sm font-semibold text-[#0A1428] transition-colors hover:bg-site-gold-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A1428] lg:inline-flex"
          >
            <span className="site-sheen" aria-hidden="true" />
            <span className="relative z-10">{SITE_CTA.label}</span>
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-full p-2.5 text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-gold lg:hidden"
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
          className="max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-[#C9A227]/30 bg-[#0A1428] shadow-2xl lg:hidden"
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
                  className={`rounded-xl px-4 py-3 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-gold ${
                    active
                      ? "bg-white/10 font-semibold text-site-gold"
                      : "text-white/90 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href={SITE_CTA.href}
              onClick={() => setOpen(false)}
              className="mt-4 rounded-full bg-site-gold px-5 py-3.5 text-center text-base font-semibold text-[#0A1428] transition-colors hover:bg-site-gold-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-gold"
            >
              {SITE_CTA.label}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
