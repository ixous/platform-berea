"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

interface NavItem {
  id: string;
  title: string;
  url: string | null;
}

export function PublicHeaderClient({
  items,
}: {
  items: NavItem[];
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (mobileOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen]);

  function isActive(url: string | null): boolean {
    if (!url || url === "#") return false;
    if (url === "/") return pathname === "/";
    return pathname.startsWith(url);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-berea-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" onClick={closeMobile}>
          <Image
            src="/images/logo.png"
            alt="Centro Cristiano Berea"
            width={52}
            height={52}
            className="h-11 w-11 rounded-full object-contain lg:h-[52px] lg:w-[52px]"
          />
          <span className="text-lg font-bold tracking-tight text-berea-navy">
            Centro Cristiano Berea
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegación principal">
          {items.map((item) => {
            const active = isActive(item.url);
            return (
              <Link
                key={item.id}
                href={item.url || "#"}
                className={`rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  active
                    ? "bg-berea-navy/10 text-berea-navy"
                    : "text-berea-navy hover:bg-berea-light"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-md p-2 text-berea-navy transition-colors hover:bg-berea-light lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          id="mobile-menu"
          ref={menuRef}
          className="border-b bg-white shadow-lg lg:hidden"
          role="dialog"
          aria-label="Menú de navegación"
        >
          <nav className="flex flex-col px-4 py-3" aria-label="Navegación móvil">
            {items.map((item) => {
              const active = isActive(item.url);
              return (
                <Link
                  key={item.id}
                  href={item.url || "#"}
                  className={`rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-berea-navy/10 text-berea-navy"
                      : "text-berea-navy hover:bg-berea-light"
                  }`}
                  aria-current={active ? "page" : undefined}
                  onClick={closeMobile}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
