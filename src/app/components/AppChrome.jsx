"use client";

import { usePathname } from "next/navigation";

import BackButton from "./BackButton";
import BackToTop from "./BackToTop";
import Navbar from "./Navbar";

export default function AppChrome({ children }) {
  const pathname = usePathname();
  const isAdminLoginRoute = pathname === "/admin/login";
  const isPortalRoute =
    (pathname?.startsWith("/admin") && !isAdminLoginRoute) ||
    pathname?.startsWith("/student") ||
    pathname?.startsWith("/teacher");

  return (
    <>
      {!isPortalRoute && <Navbar />}
      {pathname !== "/" && <BackButton isPortalRoute={isPortalRoute} />}

      <main className={`flex-1 ${isPortalRoute ? "" : "pt-20"}`}>
        {children}
      </main>

      {!isPortalRoute && <BackToTop />}
    </>
  );
}
