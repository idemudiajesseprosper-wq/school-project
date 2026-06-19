"use client";

import { usePathname } from "next/navigation";

import BackButton from "./BackButton";
import BackToTop from "./BackToTop";
import Navbar from "./Navbar";
import StudentNotificationListener from "./StudentNotificationListener";

export default function AppChrome({ children }) {
  const pathname = usePathname();
  const isAdminLoginRoute = pathname === "/admin/login";
  const isPortalRoute =
    (pathname?.startsWith("/admin") && !isAdminLoginRoute) ||
    pathname?.startsWith("/student") ||
    pathname?.startsWith("/teacher");

  return (
    <>
      <StudentNotificationListener />
      {!isPortalRoute && <Navbar />}
      {pathname !== "/" && <BackButton isPortalRoute={isPortalRoute} />}

      <main className="flex-1">{children}</main>

      {!isPortalRoute && <BackToTop />}
    </>
  );
}
