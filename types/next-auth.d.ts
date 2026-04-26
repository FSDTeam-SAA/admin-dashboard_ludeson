import type { SessionUser } from "@/types";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    role?: string;
    _id?: string;
    error?: string;
    user: SessionUser;
  }

  interface User {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    role: string;
    user: SessionUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    role?: string;
    error?: string;
    user?: SessionUser;
  }
}
