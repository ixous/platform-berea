import { Session } from "next-auth";
import { LogoutButton } from "./LogoutButton";

export function AdminHeader({ session }: { session: Session }) {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-6">
      <div>
        <span className="text-sm font-medium">Panel Administrativo</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          {session.user?.name} ({session.user?.status})
        </span>
        <LogoutButton />
      </div>
    </header>
  );
}
