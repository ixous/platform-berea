import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      roleId: string;
      status: string;
    } & DefaultSession["user"];
  }

  interface User {
    roleId?: string;
    status?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    roleId?: string;
    status?: string;
  }
}
