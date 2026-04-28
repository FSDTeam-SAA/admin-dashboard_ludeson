import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const authRoutes = ["/sign-in", "/forgot-password", "/enter-code", "/change-password"];

export default withAuth(
  (request) => {
    const token = request.nextauth.token;
    const { pathname } = request.nextUrl;
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

    if (!token && !isAuthRoute) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    if (token && isAuthRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (token?.role && token.role !== "admin") {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
        if (isAuthRoute) return true;
        return Boolean(token);
      },
    },
  },
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|branding).*)"],
};
