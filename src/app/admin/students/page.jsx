"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

// ─── Shared Icons ──────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2"/><path d="M16.5 16.5L21 21" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
);
const MailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="inline mr-1"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M3 7L12 13L21 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
);
const PersonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="inline mr-1"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
);
const LocationIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="inline mr-1"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5"/></svg>
);
const LogoIcon = () => (
  <img src="/logo.PNG" alt="Winners' Foundation School Logo" width={52} height={52} style={{ objectFit: "contain" }} />
);

const Icons = {
  Eye: () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>),
  Lock: () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>),
  Unlock: () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>),
  Trash: () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>),
  ChevronRight: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>),
  Grid: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>),
  Activity: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>),
  Settings: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M20 12h2M2 12h2M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41"/></svg>),
  Users: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>),
  LogOut: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>),
  Search: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>),
};

// ─── Public Navbar (exact match to Navbar.jsx) ─────────────────────────────────
const publicNavLinks = [
  { label: "Home",       href: "/" },
  { label: "About",      href: "/about" },
  { label: "Admissions", href: "/admissions" },
  { label: "Gallery",    href: "/gallery" },
  { label: "Contact",    href: "/contact" },
];

function PublicNavbar() {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{ position: "fixed", top: 0, width: "100%", zIndex: 100, fontFamily: "sans-serif" }}>
      <style>{`
        .mobile-menu {
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease, transform 0.4s cubic-bezier(0.4,0,0.2,1);
        }
        .mobile-menu.closed { max-height: 0; opacity: 0; transform: translateY(-12px); pointer-events: none; }
        .mobile-menu.open   { max-height: 600px; opacity: 1; transform: translateY(0); pointer-events: all; }
        .hamburger-line { display: block; width: 22px; height: 2px; background: #374151; border-radius: 2px; transition: transform 0.3s ease, opacity 0.3s ease; transform-origin: center; }
        .hamburger.open .line-1 { transform: translateY(6px) rotate(45deg); }
        .hamburger.open .line-2 { opacity: 0; transform: scaleX(0); }
        .hamburger.open .line-3 { transform: translateY(-6px) rotate(-45deg); }
        .nav-link { color: #374151; font-size: 14px; font-weight: 500; text-decoration: none; transition: color 0.2s; }
        .nav-link:hover { color: #3b82f6; }
        .login-link { display: flex; align-items: center; gap: 2px; color: #6B7280; font-size: 0.75rem; cursor: pointer; transition: color 0.2s; text-decoration: none; }
        .login-link:hover { color: #111827; }
        .mobile-nav-link { display: flex; align-items: center; color: #374151; font-size: 14px; font-weight: 500; padding: 12px; border-radius: 8px; text-decoration: none; transition: color 0.2s, background 0.2s; }
        .mobile-nav-link:hover { color: #3b82f6; background: #eff6ff; }
      `}</style>

      {/* Top info bar */}
      <div style={{ background: "white", borderBottom: "1px solid #f3f4f6", color: "#6b7280", fontSize: "12px", padding: "6px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <MailIcon /> wfsonline1999@gmail.com
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }} className="hide-on-mobile">
            <LocationIcon /> 2, Airhueghiomon street, Osazuwa, Off Etete Road, Enogie, Benin City
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/login" className="login-link">
            <PersonIcon /> Login
          </Link>
          <Link href="/contact">
            <button style={{ background: "#111827", color: "white", fontSize: "12px", fontWeight: "500", padding: "6px 16px", borderRadius: "6px", border: "none", cursor: "pointer" }}>
              Contact Us
            </button>
          </Link>
        </div>
      </div>

      {/* Main navbar */}
      <div style={{ background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", borderBottom: "1px solid #f3f4f6" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px", padding: "0 40px" }}>

          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <LogoIcon />
            <span style={{ fontFamily: "'Georgia', serif", fontWeight: "900", color: "#111827", fontSize: "15px", lineHeight: 1.3, letterSpacing: "-0.3px" }}>
              Winners'<br />
              <span style={{ color: "#3b82f6" }}>Foundation</span>{" "}
              <span style={{ color: "#374151", fontWeight: "600", fontSize: "13px" }}>School</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div style={{ display: "flex", alignItems: "center", gap: "28px" }} className="desktop-nav">
            {publicNavLinks.map(link => (
              <Link key={link.label} href={link.href} className="nav-link">{link.label}</Link>
            ))}
          </div>

          {/* Desktop search */}
          <div style={{ display: "flex", alignItems: "center", border: "1px solid #e5e7eb", borderRadius: "6px", overflow: "hidden" }} className="desktop-nav">
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              style={{ fontSize: "13px", padding: "6px 12px", width: "150px", border: "none", outline: "none", color: "#374151" }}
            />
            <button style={{ background: "#3b82f6", padding: "8px 12px", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
              <SearchIcon />
            </button>
          </div>

          {/* Hamburger — mobile only */}
          <button
            className={`hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(o => !o)}
            style={{ display: "none", flexDirection: "column", gap: "6px", background: "none", border: "none", cursor: "pointer", padding: "8px" }}
            className2="mobile-hamburger"
            aria-label="Toggle menu"
          >
            <span className="hamburger-line line-1" />
            <span className="hamburger-line line-2" />
            <span className="hamburger-line line-3" />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div className={`mobile-menu ${menuOpen ? "open" : "closed"}`} style={{ background: "white", borderBottom: "1px solid #f3f4f6", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
        <div style={{ padding: "12px 24px 16px", display: "flex", flexDirection: "column", gap: "2px" }}>
          {publicNavLinks.map(link => (
            <Link key={link.label} href={link.href} className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          <div style={{ borderTop: "1px solid #f3f4f6", margin: "8px 0" }} />
          <Link href="/login" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
            <PersonIcon /> Login
          </Link>
          <div style={{ display: "flex", alignItems: "center", border: "1px solid #e5e7eb", borderRadius: "6px", overflow: "hidden", marginTop: "4px" }}>
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              style={{ fontSize: "13px", padding: "8px 12px", flex: 1, border: "none", outline: "none", color: "#374151" }}
            />
            <button style={{ background: "#3b82f6", padding: "10px 12px", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
              <SearchIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Responsive rules */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-hamburger, button[aria-label="Toggle menu"] { display: none !important; }
          .hide-on-mobile { display: flex !important; }
          .mobile-menu { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
          button[aria-label="Toggle menu"] { display: flex !important; }
          .hide-on-mobile { display: none !important; }
          div[style*="padding: 0 40px"] { padding: 0 16px !important; }
          div[style*="padding: 6px 40px"] { padding: 6px 16px !important; }
        }
      `}</style>
    </nav>
  );
}

// ─── Admin Sidebar ─────────────────────────────────────────────────────────────
function Sidebar({ open, onClose }) {
  const navItems = [
    { label: "Dashboard", icon: Icons.Grid,     href: "/admin" },
    { label: "Students",  icon: Icons.Users,    href: "/admin/students", active: true },
    { label: "Activity",  icon: Icons.Activity, href: "/admin/activity" },
    { label: "Settings",  icon: Icons.Settings, href: "/admin/settings" },
  ];

  return (
    <>
      {/* Backdrop (mobile only) */}
      {open && (
        <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 150 }} className="sidebar-backdrop" />
      )}

      <aside style={{
        width: "240px", minWidth: "240px",
        background: "#0a0a0a", borderRight: "1px solid #1a1a1a",
        display: "flex", flexDirection: "column",
        height: "100%", position: "sticky", top: 0,
        zIndex: 160, flexShrink: 0,
      }}>
        <div style={{ padding: "28px 24px 24px", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #2563EB, #1d4ed8)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "900", color: "white", fontFamily: "'Playfair Display', serif", flexShrink: 0 }}>W</div>
            <div>
              <p style={{ color: "white", fontWeight: "700", fontSize: "13px", lineHeight: 1.2, fontFamily: "'Playfair Display', serif" }}>Winners' Foundation</p>
              <p style={{ color: "#555", fontSize: "11px", marginTop: "2px" }}>Admin Panel</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#555", padding: "4px", lineHeight: 0 }} className="sidebar-close-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <nav style={{ flex: 1, padding: "16px 12px" }}>
          <p style={{ color: "#333", fontSize: "10px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", padding: "8px 12px 12px" }}>Management</p>
          {navItems.map(item => (
            <a key={item.label} href={item.href} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "11px 12px", borderRadius: "10px", marginBottom: "2px", color: item.active ? "white" : "#555", background: item.active ? "#1a1a1a" : "transparent", textDecoration: "none", fontSize: "14px", fontWeight: item.active ? "600" : "400", transition: "all 0.15s", borderLeft: item.active ? "3px solid #2563EB" : "3px solid transparent" }}>
              <item.icon />
              {item.label}
              {item.active && <span style={{ marginLeft: "auto" }}><Icons.ChevronRight /></span>}
            </a>
          ))}
        </nav>

        <div style={{ padding: "16px 12px", borderTop: "1px solid #1a1a1a" }}>
          <a href="/admin/logout" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "11px 12px", borderRadius: "10px", color: "#555", textDecoration: "none", fontSize: "14px" }}>
            <Icons.LogOut /> Sign Out
          </a>
        </div>
      </aside>
    </>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function StudentsPage() {
  const [students, setStudents]       = useState([]);
  const [filtered, setFiltered]       = useState([]);
  const [search, setSearch]           = useState("");
  const [loading, setLoading]         = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [filterStatus, setFilterStatus]   = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { fetchStudents(); }, []);
  useEffect(() => { filterStudents(); }, [search, students, filterStatus]);

  const fetchStudents = async () => {
    try {
      const res  = await fetch("/api/admin/students");
      const data = await res.json();
      if (data.success) setStudents(data.students);
      else toast.error(data.message);
    } catch { toast.error("Failed to load students"); }
    setLoading(false);
  };

  const filterStudents = () => {
    let data = [...students];
    if (search) data = data.filter(s => s.fullName?.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase()));
    if (filterStatus === "online")    data = data.filter(s => s.isOnline);
    if (filterStatus === "suspended") data = data.filter(s => s.isSuspended);
    if (filterStatus === "verified")  data = data.filter(s => s.isVerified);
    setFiltered(data);
  };

  const toggleSuspend = async (studentId, suspended) => {
    try {
      setActionLoading(studentId);
      const res  = await fetch(`/api/admin/students/${studentId}/suspend`, { method: "PATCH" });
      const data = await res.json();
      if (data.success) {
        toast.success(suspended ? "Student unsuspended" : "Student suspended");
        setStudents(prev => prev.map(s => s._id === studentId ? { ...s, isSuspended: !s.isSuspended } : s));
      } else toast.error(data.message);
    } catch { toast.error("Action failed"); }
    finally { setActionLoading(""); }
  };

  const deleteStudent = async (studentId) => {
    if (!confirm("Delete this student? They will be removed from the portal.")) return;
    try {
      setActionLoading(studentId);
      const res  = await fetch(`/api/admin/students/${studentId}/delete`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Student deleted successfully");
        setStudents(prev => prev.filter(s => s._id !== studentId));
      } else toast.error(data.message);
    } catch { toast.error("Delete failed"); }
    finally { setActionLoading(""); }
  };

  const stats = [
    { label: "Total Students", value: students.length,                         color: "#2563EB", bg: "#eff6ff" },
    { label: "Online Now",     value: students.filter(s => s.isOnline).length, color: "#16a34a", bg: "#f0fdf4" },
    { label: "Verified",       value: students.filter(s => s.isVerified).length, color: "#9333ea", bg: "#faf5ff" },
    { label: "Suspended",      value: students.filter(s => s.isSuspended).length, color: "#dc2626", bg: "#fef2f2" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Lato:wght@300;400;700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0 !important; }
        .student-row:hover { background: #f1f5fd !important; }
        .action-btn { transition: all 0.15s ease; }
        .action-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .filter-chip:hover { background: #e8edf8 !important; }
        aside a:hover { color: #aaa !important; background: #111 !important; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }

        /* Admin students page owns its portal layout; no public navbar offset. */
        .page-wrapper { min-height: 100vh; }
        @media (max-width: 768px) {
          .page-wrapper { min-height: 100vh; }
        }

        .sidebar-backdrop { display: none; }

        /* Mobile: sidebar slides in as overlay */
        .admin-sidebar {
          display: none;
        }
        @media (max-width: 768px) {
          .admin-sidebar {
            display: block !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            height: 100vh !important;
            transform: translateX(-100%);
            transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
            z-index: 160;
          }
          .admin-sidebar.open {
            transform: translateX(0) !important;
          }
          .sidebar-backdrop { display: block !important; }
          .sidebar-close-btn { display: flex !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        /* Desktop: sidebar always visible inline */
        @media (min-width: 769px) {
          .admin-sidebar {
            display: flex !important;
            position: sticky !important;
            top: 0 !important;
            height: 100vh !important;
          }
          .sidebar-close-btn { display: none !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
      <div className="page-wrapper" style={{ display: "flex", background: "#f8f9fb", fontFamily: "Lato, sans-serif" }}>

        {/* Admin Sidebar */}
        <div className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Main content */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflowX: "hidden" }}>

          {/* Admin top bar */}
          <div style={{ background: "white", borderBottom: "1px solid #e8edf3", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", position: "relative", zIndex: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {/* Mobile hamburger for sidebar */}
              <button
                className="mobile-menu-btn"
                onClick={() => setSidebarOpen(true)}
                style={{ display: "none", alignItems: "center", justifyContent: "center", background: "#f3f4f6", border: "none", borderRadius: "8px", width: "36px", height: "36px", cursor: "pointer", color: "#111", flexShrink: 0 }}
                aria-label="Open sidebar"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#9ca3af", fontSize: "13px" }}>
                <span>Admin</span>
                <Icons.ChevronRight />
                <span style={{ color: "#111", fontWeight: "600" }}>Student Management</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#2563EB", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", flexShrink: 0 }}>A</div>
              <div>
                <p style={{ fontSize: "13px", fontWeight: "700", color: "#111" }}>Admin</p>
                <p style={{ fontSize: "11px", color: "#9ca3af" }}>Super Admin</p>
              </div>
            </div>
          </div>

          {/* Page body */}
          <div style={{ padding: "28px 24px", flex: 1 }}>

            <div style={{ marginBottom: "24px" }}>
              <p style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.2em", textTransform: "uppercase", color: "#2563EB", marginBottom: "6px" }}>Administration</p>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px, 4vw, 32px)", fontWeight: "900", color: "#0a0a0a", lineHeight: 1.15 }}>Student Management</h1>
              <p style={{ color: "#6b7280", marginTop: "6px", fontSize: "14px" }}>Monitor, manage and control registered student accounts.</p>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "14px", marginBottom: "24px" }}>
              {stats.map(s => (
                <div key={s.label} style={{ background: "white", borderRadius: "14px", padding: "18px 20px", border: "1px solid #e8edf3", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                    <span style={{ color: s.color, fontSize: "17px", fontWeight: "900" }}>{s.value}</span>
                  </div>
                  <p style={{ color: "#6b7280", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Search + filter */}
            <div style={{ background: "white", borderRadius: "14px", border: "1px solid #e8edf3", padding: "14px 18px", marginBottom: "18px", display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ position: "relative", flex: 1, minWidth: "180px" }}>
                <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}><Icons.Search /></span>
                <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px 10px 40px", border: "1px solid #e5e7eb", borderRadius: "9px", fontSize: "13px", outline: "none", color: "#111", background: "#f9fafb" }} />
              </div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {[{ key: "all", label: "All" }, { key: "online", label: "Online" }, { key: "verified", label: "Verified" }, { key: "suspended", label: "Suspended" }].map(f => (
                  <button key={f.key} className="filter-chip" onClick={() => setFilterStatus(f.key)}
                    style={{ padding: "7px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", border: "1px solid", cursor: "pointer", transition: "all 0.15s", borderColor: filterStatus === f.key ? "#2563EB" : "#e5e7eb", background: filterStatus === f.key ? "#eff6ff" : "white", color: filterStatus === f.key ? "#2563EB" : "#6b7280" }}>
                    {f.label}
                  </button>
                ))}
              </div>
              <span style={{ color: "#9ca3af", fontSize: "12px", marginLeft: "auto", whiteSpace: "nowrap" }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
            </div>

            {/* Table */}
            <div style={{ background: "white", borderRadius: "18px", border: "1px solid #e8edf3", overflow: "hidden", boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "860px" }}>
                  <thead>
                    <tr style={{ background: "#f8f9fb", borderBottom: "2px solid #e8edf3" }}>
                      {["Student", "Role", "Status", "Online", "Login Count", "Last Login", "Joined", "Actions"].map(h => (
                        <th key={h} style={{ padding: "13px 18px", textAlign: "left", fontSize: "11px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {!loading && filtered.map((student, i) => (
                      <tr key={student._id} className="student-row" style={{ borderBottom: i < filtered.length - 1 ? "1px solid #f1f5f9" : "none", background: "white", transition: "background 0.15s" }}>
                        <td style={{ padding: "15px 18px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{ width: "40px", height: "40px", borderRadius: "11px", background: `hsl(${(student.fullName?.charCodeAt(0)||65)*13%360},65%,20%)`, color: `hsl(${(student.fullName?.charCodeAt(0)||65)*13%360},65%,75%)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "15px", flexShrink: 0, fontFamily: "'Playfair Display', serif" }}>
                              {student.fullName?.charAt(0)?.toUpperCase()}
                            </div>
                            <div>
                              <p style={{ fontWeight: "700", color: "#0a0a0a", fontSize: "13px" }}>{student.fullName}</p>
                              <p style={{ color: "#9ca3af", fontSize: "11px", marginTop: "2px" }}>{student.email}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "15px 18px" }}><span style={{ fontSize: "11px", fontWeight: "700", color: "#374151", background: "#f3f4f6", padding: "3px 9px", borderRadius: "5px", textTransform: "capitalize" }}>{student.role}</span></td>
                        <td style={{ padding: "15px 18px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            <StatusDot on={student.isVerified} onLabel="Verified" offLabel="Unverified" onColor="#16a34a" offColor="#d97706" />
                            {student.isSuspended && <StatusDot on={false} onLabel="" offLabel="Suspended" offColor="#dc2626" />}
                          </div>
                        </td>
                        <td style={{ padding: "15px 18px" }}><StatusDot on={student.isOnline} onLabel="Online" offLabel="Offline" onColor="#16a34a" offColor="#9ca3af" /></td>
                        <td style={{ padding: "15px 18px", fontWeight: "700", color: "#111", fontSize: "14px" }}>{student.loginCount || 0}</td>
                        <td style={{ padding: "15px 18px", color: "#6b7280", fontSize: "12px", whiteSpace: "nowrap" }}>{student.lastLogin ? new Date(student.lastLogin).toLocaleString() : <span style={{ color: "#d1d5db" }}>Never</span>}</td>
                        <td style={{ padding: "15px 18px", color: "#6b7280", fontSize: "12px", whiteSpace: "nowrap" }}>{new Date(student.createdAt).toLocaleDateString()}</td>
                        <td style={{ padding: "15px 18px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <ActionBtn onClick={() => window.location.href = `/admin/students/${student._id}`} color="#111" label="View" icon={<Icons.Eye />} />
                            <ActionBtn onClick={() => toggleSuspend(student._id, student.isSuspended)} disabled={actionLoading === student._id} color={student.isSuspended ? "#16a34a" : "#d97706"} label={actionLoading === student._id ? "…" : student.isSuspended ? "Unsuspend" : "Suspend"} icon={student.isSuspended ? <Icons.Unlock /> : <Icons.Lock />} />
                            <ActionBtn onClick={() => deleteStudent(student._id)} disabled={actionLoading === student._id} color="#dc2626" label={actionLoading === student._id ? "…" : "Delete"} icon={<Icons.Trash />} iconOnly />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {!loading && filtered.length === 0 && (
                <div style={{ padding: "72px 20px", textAlign: "center" }}>
                  <div style={{ width: "64px", height: "64px", borderRadius: "18px", background: "#f3f4f6", margin: "0 auto 18px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>🎓</div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: "900", color: "#111", marginBottom: "6px" }}>No Students Found</h3>
                  <p style={{ color: "#9ca3af", fontSize: "13px" }}>{search ? "Try adjusting your search or filters." : "No students registered yet."}</p>
                </div>
              )}

              {loading && (
                <div style={{ padding: "72px 20px", textAlign: "center" }}>
                  <div style={{ width: "40px", height: "40px", border: "3px solid #e5e7eb", borderTopColor: "#2563EB", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 18px" }} />
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  <p style={{ color: "#9ca3af", fontSize: "14px" }}>Loading students...</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

function StatusDot({ on, onLabel, offLabel, onColor, offColor }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: "600", color: on ? onColor : offColor }}>
      <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: on ? onColor : offColor, flexShrink: 0 }} />
      {on ? onLabel : offLabel}
    </span>
  );
}

function ActionBtn({ onClick, disabled, color, label, icon, iconOnly }) {
  return (
    <button className="action-btn" onClick={onClick} disabled={disabled}
      style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: iconOnly ? "7px" : "7px 12px", borderRadius: "8px", border: "none", cursor: disabled ? "not-allowed" : "pointer", background: color + "18", color, fontSize: "12px", fontWeight: "700", opacity: disabled ? 0.5 : 1 }}
      title={label}>
      {icon}
      {!iconOnly && label}
    </button>
  );
}
