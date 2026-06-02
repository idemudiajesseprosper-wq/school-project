import { NextResponse } from "next/server";

export function middleware(req) {
  const token =
    req.cookies.get("auth_token")?.value;

  const url = req.nextUrl;

  console.log("MIDDLEWARE TOKEN:", token);

  // =========================
  // ADMIN ROUTE PROTECTION
  // =========================
  if (url.pathname.startsWith("/admin")) {

    // Allow admin login page
    if (url.pathname === "/admin/login") {
      return NextResponse.next();
    }

    // No token
    if (!token) {
      console.log("NO ADMIN TOKEN FOUND");

      return NextResponse.redirect(
        new URL("/admin/login", req.url)
      );
    }

    console.log("ADMIN TOKEN EXISTS");

    return NextResponse.next();
  }

  // =========================
  // STUDENT ROUTE PROTECTION
  // =========================
  if (url.pathname.startsWith("/student")) {

    // Allow student login page
    if (url.pathname === "/student/login") {
      return NextResponse.next();
    }

    // No token
    if (!token) {
      console.log("NO STUDENT TOKEN FOUND");

      return NextResponse.redirect(
        new URL("/login/student", req.url)
      );
    }

    console.log("STUDENT TOKEN EXISTS");

    return NextResponse.next();
  }

  // =========================
  // TEACHER ROUTE PROTECTION
  // =========================
  if (url.pathname.startsWith("/teacher")) {

    if (!token) {
      return NextResponse.redirect(
        new URL("/login/student", req.url)
      );
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/student/:path*",
    "/teacher/:path*",
  ],
};
