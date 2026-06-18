import { NextResponse } from "next/server";

function getTokenRole(token) {
  try {
    const payload = token?.split(".")[1];
    if (!payload) return "";

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(base64));
    return decoded.role || "";
  } catch {
    return "";
  }
}

export function middleware(req) {
  const token = req.cookies.get("auth_token")?.value;

  const url = req.nextUrl;
  const role = getTokenRole(token);

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

      return NextResponse.redirect(new URL("/login/student", req.url));
    }

    if (role !== "admin") {
      return NextResponse.redirect(new URL("/login/student", req.url));
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

      return NextResponse.redirect(new URL("/login/student", req.url));
    }

    if (role !== "student") {
      return NextResponse.redirect(
        new URL(role === "teacher" ? "/teacher" : "/login/student", req.url),
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
      return NextResponse.redirect(new URL("/login/student", req.url));
    }

    if (role !== "teacher") {
      return NextResponse.redirect(
        new URL(role === "student" ? "/student" : "/login/student", req.url),
      );
    }

    return NextResponse.next();
  }

  // =========================
  // APPLICANT ROUTE PROTECTION
  // =========================
  if (url.pathname.startsWith("/applicant")) {
    if (
      url.pathname === "/applicant/login" ||
      url.pathname === "/applicant/register"
    ) {
      return NextResponse.next();
    }

    if (!token) {
      return NextResponse.redirect(new URL("/applicant/login", req.url));
    }

    if (role !== "applicant") {
      return NextResponse.redirect(new URL("/applicant/login", req.url));
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
    "/applicant/:path*",
  ],
};
