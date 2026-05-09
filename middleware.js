import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

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
      console.log("NO TOKEN FOUND");

      return NextResponse.redirect(
        new URL("/admin/login", req.url)
      );
    }

    try {
      // VERIFY TOKEN
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      console.log("ADMIN TOKEN VERIFIED");

      // CHECK ROLE
      if (decoded.role !== "admin") {
        console.log("NOT ADMIN");

        return NextResponse.redirect(
          new URL("/login", req.url)
        );
      }

      return NextResponse.next();

    } catch (error) {
      console.log("INVALID TOKEN");

      return NextResponse.redirect(
        new URL("/admin/login", req.url)
      );
    }
  }

  // =========================
  // STUDENT ROUTE PROTECTION
  // =========================
  if (url.pathname.startsWith("/student")) {

    // No token
    if (!token) {
      console.log("NO STUDENT TOKEN");

      return NextResponse.redirect(
        new URL("/login/student", req.url)
      );
    }

    try {
      // VERIFY TOKEN
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      console.log("STUDENT TOKEN VERIFIED");

      // CHECK ROLE
      if (decoded.role !== "student") {
        console.log("NOT STUDENT");

        return NextResponse.redirect(
          new URL("/admin", req.url)
        );
      }

      return NextResponse.next();

    } catch (error) {
      console.log("INVALID STUDENT TOKEN");

      return NextResponse.redirect(
        new URL("/login/student", req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/student/:path*",
  ],
};