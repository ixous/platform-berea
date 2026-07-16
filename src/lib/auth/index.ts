import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

const authOptions: NextAuthConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        if (!email || !password) {
          return null;
        }

        // PLACEHOLDER — FASE 3 (Autenticación y Seguridad)
        // La verificación real con bcrypt y consulta a la base de datos
        // será implementada durante la Fase 3.
        // El comportamiento actual (retornar null = rechazar acceso)
        // es intencional y esperado en esta etapa del proyecto.
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      const isLoginPage = nextUrl.pathname === "/admin/login";

      if (isAdminRoute && !isLoggedIn && !isLoginPage) {
        const loginUrl = new URL("/admin/login", nextUrl.origin);
        loginUrl.searchParams.set("callbackUrl", nextUrl.href);
        return Response.redirect(loginUrl);
      }

      if (isLoggedIn && isLoginPage) {
        return Response.redirect(new URL("/admin", nextUrl.origin));
      }

      return true;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
