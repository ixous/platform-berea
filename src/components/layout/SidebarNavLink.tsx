"use client";

import Link from "next/link";
import { useSidebar } from "./SidebarProvider";

export function SidebarNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const { setSidebarOpen } = useSidebar();

  return (
    <Link
      href={href}
      onClick={() => setSidebarOpen(false)}
      className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {children}
    </Link>
  );
}
