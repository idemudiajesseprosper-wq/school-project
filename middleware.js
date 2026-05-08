import { NextResponse } from "next/server";

export function middleware(req) {
  const token =
    req.cookies.get("auth_token")?.value;

  const url = req.nextUrl;

  console.log("MIDDLEWARE TOKEN:", token);

  // Protect admin routes
  if (url.pathname.startsWith("/admin")) {

    // Allow login page
    if (url.pathname === "/admin/login") {
      return NextResponse.next();
    }

    // No token
    if (!token) {
      console.log("NO TOKEN FOUND");

      return NextResponse.redirect(
        new URL("/admin/login", req.url)
      );
    }

    console.log("TOKEN EXISTS");

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};