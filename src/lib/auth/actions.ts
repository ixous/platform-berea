"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { z } from "zod";
import { signIn, signOut } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { rateLimit } from "@/lib/rate-limit";

const loginSchema = z.object({
  email: z.string().email("Email inválido."),
  password: z.string().min(1, "Contraseña requerida."),
  callbackUrl: z.string().optional(),
});

export async function login(_prevState: { error: string }, formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    callbackUrl: formData.get("callbackUrl"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Datos inválidos." };
  }

  const { email, password, callbackUrl } = parsed.data;

  if (!rateLimit(`login:${email}`, { windowMs: 60_000, max: 5 })) {
    return { error: "Demasiados intentos. Espera un minuto e inténtalo de nuevo." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Credenciales inválidas. Verifica tu email y contraseña." };
    }
    throw error;
  }

  const safeCallbackUrl = validateCallbackUrl(callbackUrl);
  redirect(safeCallbackUrl || "/admin");
}

export async function logout() {
  const { auth } = await import("@/lib/auth");
  const session = await auth();
  if (session?.user?.id) {
    await logAudit({
      userId: session.user.id,
      action: "LOGOUT",
      resource: "auth",
      details: "Cierre de sesión.",
    });
  }
  await signOut({ redirectTo: "/admin/login" });
}

function validateCallbackUrl(url?: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url, "http://localhost");
    if (parsed.hostname !== "localhost") {
      if (!parsed.pathname.startsWith("/admin")) return null;
    }
    return parsed.pathname + parsed.search;
  } catch {
    return null;
  }
}
