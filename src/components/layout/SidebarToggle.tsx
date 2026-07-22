"use client";

import { useSidebar } from "./SidebarProvider";
import { Menu, X } from "lucide-react";

export function SidebarToggle() {
  const { sidebarOpen, toggleSidebar } = useSidebar();

  return (
    <button
      onClick={toggleSidebar}
      aria-label={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
    >
      {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </button>
  );
}
