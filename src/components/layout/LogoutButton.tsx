"use client";

import { useActionState } from "react";
import { logout } from "@/lib/auth/actions";

export function LogoutButton() {
  const [, formAction, pending] = useActionState(logout, null);

  return (
    <form action={formAction}>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
      >
        {pending ? "Cerrando..." : "Cerrar Sesión"}
      </button>
    </form>
  );
}
