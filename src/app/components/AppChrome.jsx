"use client";

import { usePathname } from "next/navigation";

import BackToTop from "./BackToTop";
import Navbar from "./Navbar";

export default function AppChrome({ children }) {
  const pathname = usePathname();
  const isPortalRoute =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/student") ||
    pathname?.startsWith("/teacher");

  return (
    <>
      {!isPortalRoute && <Navbar />}

      <main className={`flex-1 ${isPortalRoute ? "" : "pt-20"}`}>
        {children}
      </main>

      {!isPortalRoute && <BackToTop />}
    </>
  );
}
