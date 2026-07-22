import type { Session } from "next-auth";
import { LogoutButton } from "./LogoutButton";
import { SidebarToggle } from "./SidebarToggle";

export function AdminHeader({ session }: { session: Session }) {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-6">
      <div className="flex items-center gap-3">
        <SidebarToggle />
        <span className="text-sm font-medium">Panel Administrativo</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden text-sm text-muted-foreground sm:inline">
          {session.user?.name} ({session.user?.status})
        </span>
        <LogoutButton />
      </div>
    </header>
  );
}
