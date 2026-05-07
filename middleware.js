import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
  const token =
    req.cookies.get("auth_token")?.value;

  const url = req.nextUrl;

  // Protect admin routes
  if (url.pathname.startsWith("/admin")) {

    // Allow login page
    if (url.pathname === "/admin/login") {
      return NextResponse.next();
    }

    // No token
    if (!token) {
      return NextResponse.redirect(
        new URL("/admin/login", req.url)
      );
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      // Role protection
      if (decoded.role !== "admin") {
        return NextResponse.redirect(
          new URL("/login", req.url)
        );
      }

      return NextResponse.next();

    } catch (error) {
      return NextResponse.redirect(
        new URL("/admin/login", req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};