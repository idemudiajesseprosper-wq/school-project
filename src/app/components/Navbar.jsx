"use client";

import React, { useState } from "react";
import Link from "next/link";

const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2" />
    <path
      d="M16.5 16.5L21 21"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const MailIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="inline mr-1"
  >
    <rect
      x="3"
      y="5"
      width="18"
      height="14"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M3 7L12 13L21 7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const LocationIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="inline mr-1"
  >
    <path
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const PersonIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="inline mr-1"
  >
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M4 20c0-4 3.58-7 8-7s8 3 8 7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const LogoIcon = () => (
  <img
    src="/logo.PNG"
    alt="Winners' Foundation School Logo"
    width={52}
    height={52}
    style={{ objectFit: "contain" }}
  />
);

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Admissions", href: "/admissions" },
  { label: "Gallery", href: "/gallery" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <style>{`
        .mobile-menu {
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                      opacity 0.3s ease,
                      transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .mobile-menu.closed {
          max-height: 0;
          opacity: 0;
          transform: translateY(-12px);
          pointer-events: none;
        }
        .mobile-menu.open {
          max-height: 600px;
          opacity: 1;
          transform: translateY(0);
          pointer-events: all;
        }
        .hamburger-line {
          display: block;
          width: 22px;
          height: 2px;
          background: #374151;
          border-radius: 2px;
          transition: transform 0.3s ease, opacity 0.3s ease;
          transform-origin: center;
        }
        .hamburger.open .line-1 { transform: translateY(6px) rotate(45deg); }
        .hamburger.open .line-2 { opacity: 0; transform: scaleX(0); }
        .hamburger.open .line-3 { transform: translateY(-6px) rotate(-45deg); }

        .login-link {
          display: flex;
          align-items: center;
          gap: 2px;
          color: #6B7280;
          font-size: 0.75rem;
          cursor: pointer;
          transition: color 0.2s;
          text-decoration: none;
        }
        .login-link:hover { color: #111827; }
      `}</style>

      <nav className="sticky top-0 w-full z-50 font-sans">
        {/* Top info bar */}
        <div className="bg-white border-b border-gray-100 text-gray-500 text-xs px-6 md:px-10 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center">
              <MailIcon />
              wfsonline1999@gmail.com
            </span>
            <span className="hidden sm:flex items-center">
              <LocationIcon />
              2, Airhueghiomon street, Osazuwa, Off Etete Road, Enogie, Benin
              City
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Login now links to /login */}
            <Link href="/login" className="login-link">
              <PersonIcon />
              Login
            </Link>
            <Link href="/contact">
              <button className="bg-gray-900 text-white text-xs font-medium px-4 py-1.5 rounded hover:bg-gray-700 transition-colors cursor-pointer">
                Contact Us
              </button>
            </Link>
          </div>
        </div>

        {/* Main navbar */}
        <div className="bg-white shadow-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6 md:px-10">
            {/* Logo */}
            <Link href="/">
              <span className="flex items-center gap-2 cursor-pointer">
                <LogoIcon />
                <span
                  className="text-base font-black text-gray-900 leading-tight"
                  style={{
                    fontFamily: "'Georgia', serif",
                    letterSpacing: "-0.3px",
                  }}
                >
                  Winners'
                  <br />
                  <span className="text-blue-500">Foundation</span>{" "}
                  <span className="text-gray-700 font-semibold text-sm">
                    School
                  </span>
                </span>
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center space-x-7">
              {navLinks.map((link) => (
                <Link key={link.label} href={link.href}>
                  <span className="text-gray-700 hover:text-blue-500 transition-colors cursor-pointer text-sm font-medium">
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>

            {/* Desktop search */}
            <div className="hidden md:flex items-center border border-gray-200 rounded overflow-hidden">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="text-sm px-3 py-1.5 w-40 focus:outline-none text-gray-600 placeholder-gray-400"
              />
              <button className="bg-blue-500 hover:bg-blue-600 transition-colors px-3 py-2 flex items-center justify-center cursor-pointer">
                <SearchIcon />
              </button>
            </div>

            {/* Hamburger — mobile only */}
            <button
              className={`md:hidden flex flex-col gap-1.5 p-2 cursor-pointer hamburger ${menuOpen ? "open" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span className="hamburger-line line-1" />
              <span className="hamburger-line line-2" />
              <span className="hamburger-line line-3" />
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <div
          className={`mobile-menu md:hidden bg-white border-b border-gray-100 shadow-md ${menuOpen ? "open" : "closed"}`}
        >
          <div className="px-6 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href}>
                <span
                  className="flex items-center text-gray-700 hover:text-blue-500 hover:bg-blue-50 transition-colors text-sm font-medium py-3 px-3 rounded-lg cursor-pointer"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </span>
              </Link>
            ))}

            <div className="border-t border-gray-100 my-2" />

            {/* Mobile login link */}
            <Link href="/login" onClick={() => setMenuOpen(false)}>
              <span className="flex items-center text-gray-700 hover:text-blue-500 hover:bg-blue-50 transition-colors text-sm font-medium py-3 px-3 rounded-lg cursor-pointer">
                <PersonIcon />
                Login
              </span>
            </Link>

            <div className="flex items-center border border-gray-200 rounded overflow-hidden mt-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="text-sm px-3 py-2 flex-1 focus:outline-none text-gray-600 placeholder-gray-400"
              />
              <button className="bg-blue-500 hover:bg-blue-600 transition-colors px-3 py-2 flex items-center justify-center cursor-pointer">
                <SearchIcon />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
