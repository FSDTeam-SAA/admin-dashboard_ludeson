import axios from "axios";
import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";
import { getBaseUrl } from "@/lib/utils";
import type { ApiEnvelope, AuthLoginData, SessionUser } from "@/types";

const publicApi = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

function decodeJwtExpiry(token?: string | null) {
  if (!token) return 0;

  try {
    const [, payload] = token.split(".");
    if (!payload) return 0;
    const decoded = JSON.parse(Buffer.from(payload, "base64").toString("utf8")) as {
      exp?: number;
    };
    return decoded.exp ? decoded.exp * 1000 : 0;
  } catch {
    return 0;
  }
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await publicApi.post<ApiEnvelope<{ access_token: string }>>(
      "/auth/refresh-token",
      {
        refresh_token: token.refreshToken,
      },
    );

    const nextAccessToken = response.data.data.access_token;

    return {
      ...token,
      accessToken: nextAccessToken,
      accessTokenExpires: decodeJwtExpiry(nextAccessToken),
      error: undefined,
    };
  } catch {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember me", type: "text" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim();
        const password = credentials?.password;
        const rememberMe = credentials?.rememberMe === "true";

        if (!email || !password) {
          throw new Error("Email and password are required.");
        }

        const response = await publicApi.post<ApiEnvelope<AuthLoginData>>("/auth/login", {
          email,
          password,
          remember_me: rememberMe,
        });

        const payload = response.data.data;

        if (payload.user.role !== "admin") {
          throw new Error("Only admin accounts can access this dashboard.");
        }

        const sessionUser: SessionUser = {
          id: payload.user._id,
          email: payload.user.email,
          role: payload.user.role,
          username: payload.user.username,
          first_name: payload.user.first_name,
          last_name: payload.user.last_name,
          profile_image_url: payload.user.profile_image_url,
          status: payload.user.status,
        };

        return {
          id: payload.user._id,
          email: payload.user.email,
          name: payload.user.username,
          accessToken: payload.access_token,
          refreshToken: payload.refresh_token,
          accessTokenExpires: decodeJwtExpiry(payload.access_token),
          role: payload.user.role,
          user: sessionUser,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: user.accessTokenExpires,
          role: user.role,
          user: user.user,
        };
      }

      if (
        typeof token.accessTokenExpires === "number" &&
        Date.now() < token.accessTokenExpires - 60_000
      ) {
        return token;
      }

      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;
      session.refreshToken = token.refreshToken as string | undefined;
      session.error = token.error as string | undefined;
      session.role = token.role as string | undefined;
      session._id = (token.user as SessionUser | undefined)?.id;

      if (token.user) {
        session.user = token.user as SessionUser;
      }

      return session;
    },
  },
};

export function auth() {
  return getServerSession(authOptions);
}
