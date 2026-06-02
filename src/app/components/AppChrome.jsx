"use client";

import { usePathname } from "next/navigation";

import BackToTop from "./BackToTop";
import Navbar from "./Navbar";

export default function AppChrome({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}

      <main className={`flex-1 ${isAdminRoute ? "" : "pt-20"}`}>
        {children}
      </main>

      {!isAdminRoute && <BackToTop />}
    </>
  );
}
