"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/lib/auth";

export async function login(_prevState: { error: string }, formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Credenciales inválidas. Verifica tu email y contraseña." };
    }
    throw error;
  }

  const callbackUrl = formData.get("callbackUrl") as string;
  redirect(callbackUrl || "/admin");
}

export async function logout() {
  await signOut({ redirectTo: "/admin/login" });
}
