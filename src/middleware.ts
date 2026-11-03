import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

// Staff (event crew) may only upload and browse media
const STAFF_PATHS = ["/admin/upload", "/admin/media"];

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role;

    if (pathname === "/admin/login") {
      return role
        ? NextResponse.redirect(new URL("/admin", req.url))
        : NextResponse.next();
    }

    if (role === "staff" && !STAFF_PATHS.some((p) => pathname.startsWith(p))) {
      return NextResponse.redirect(new URL("/admin/upload", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // The login page is open; every other /admin page needs a session
      authorized: ({ req, token }) =>
        req.nextUrl.pathname === "/admin/login" || !!token,
    },
    pages: { signIn: "/admin/login" },
  }
);

export const config = { matcher: ["/admin/:path*"] };
