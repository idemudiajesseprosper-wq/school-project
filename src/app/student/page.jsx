"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  Grid: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  ),
  BookOpen: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
  Clock: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Bell: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  LogOut: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  Monitor: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  ),
  Smartphone: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
    </svg>
  ),
  Shield: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  User: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Mail: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ onLogout }) {
  const navItems = [
    { label: "Dashboard", icon: Icons.Grid, active: true, href: "/student" },
    { label: "Results", icon: Icons.BookOpen, href: "/student/results" },
    { label: "Timetable", icon: Icons.Clock, href: "/student/timetable" },
    { label: "Notifications", icon: Icons.Bell, href: "/student/notifications" },
  ];

  return (
    <aside style={{
      width: "240px", minWidth: "240px",
      background: "#0a0a0a", borderRight: "1px solid #1a1a1a",
      display: "flex", flexDirection: "column",
      height: "100vh", position: "sticky", top: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: "28px 24px 24px", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src="/images/logo.png"
            alt="Logo"
            style={{ width: "38px", height: "38px", objectFit: "contain", borderRadius: "10px" }}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
          <div style={{
            width: "38px", height: "38px", borderRadius: "10px",
            background: "linear-gradient(135deg, #2563EB, #1d4ed8)",
            display: "none", alignItems: "center", justifyContent: "center",
            fontSize: "16px", fontWeight: "900", color: "white",
            fontFamily: "'Playfair Display', serif", flexShrink: 0,
          }}>W</div>
          <div>
            <p style={{ color: "white", fontWeight: "700", fontSize: "13px", lineHeight: 1.2, fontFamily: "'Playfair Display', serif" }}>
              Winners' Foundation
            </p>
            <p style={{ color: "#555", fontSize: "11px", marginTop: "2px" }}>Student Portal</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 12px" }}>
        <p style={{ color: "#333", fontSize: "10px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", padding: "8px 12px 12px" }}>
          My Portal
        </p>
        {navItems.map((item) => (
          <a key={item.label} href={item.href} style={{
            display: "flex", alignItems: "center", gap: "12px",
            padding: "11px 12px", borderRadius: "10px", marginBottom: "2px",
            color: item.active ? "white" : "#555",
            background: item.active ? "#1a1a1a" : "transparent",
            textDecoration: "none", fontSize: "14px", fontWeight: item.active ? "600" : "400",
            transition: "all 0.15s",
            borderLeft: item.active ? "3px solid #2563EB" : "3px solid transparent",
          }}>
            <item.icon />
            {item.label}
            {item.active && <span style={{ marginLeft: "auto" }}><Icons.ChevronRight /></span>}
          </a>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: "16px 12px", borderTop: "1px solid #1a1a1a" }}>
        <button onClick={onLogout} style={{
          display: "flex", alignItems: "center", gap: "12px",
          padding: "11px 12px", borderRadius: "10px", width: "100%",
          color: "#ef4444", background: "transparent", border: "none",
          fontSize: "14px", cursor: "pointer", transition: "all 0.15s",
          fontFamily: "Lato, sans-serif",
        }}>
          <Icons.LogOut />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchUser(); }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.success) setUser(data.user);
    } catch (e) { console.log(e); }
    setLoading(false);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login/student");
  };

  const initials = user?.fullName?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";
  const hue = (user?.fullName?.charCodeAt(0) || 65) * 13 % 360;

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f9fb", fontFamily: "Lato, sans-serif" }}>
        <div>
          <div style={{ width: "44px", height: "44px", border: "3px solid #e5e7eb", borderTopColor: "#2563EB", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: "#9ca3af", textAlign: "center" }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Login Count", value: user?.loginCount || 0, color: "#2563EB", bg: "#eff6ff" },
    { label: "Account Role", value: user?.role || "—", color: "#9333ea", bg: "#faf5ff", capitalize: true },
    { label: "Status", value: user?.isOnline ? "Online" : "Offline", color: user?.isOnline ? "#16a34a" : "#6b7280", bg: user?.isOnline ? "#f0fdf4" : "#f9fafb" },
    { label: "Verified", value: user?.isVerified ? "Verified" : "Unverified", color: user?.isVerified ? "#16a34a" : "#d97706", bg: user?.isVerified ? "#f0fdf4" : "#fffbeb" },
  ];

  const infoFields = [
    { label: "Full Name", value: user?.fullName, icon: Icons.User },
    { label: "Email Address", value: user?.email, icon: Icons.Mail },
    { label: "Account Role", value: user?.role, icon: Icons.Shield, capitalize: true },
    { label: "Last Login", value: user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : "N/A", icon: Icons.Calendar },
  ];

  const recentActivity = user?.loginHistory?.slice().reverse().slice(0, 5) || [];
  const isMobile = (ua) => /iphone|android|mobile/i.test(ua || "");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8f9fb", fontFamily: "Lato, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Lato:wght@300;400;700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0 !important; }
        aside a:hover { color: #aaa !important; background: #111 !important; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
      `}</style>

      <Sidebar onLogout={logout} />

      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Top bar */}
        <div style={{
          background: "white", borderBottom: "1px solid #e8edf3",
          padding: "18px 32px", display: "flex", alignItems: "center",
          justifyContent: "space-between", position: "sticky", top: 0, zIndex: 20,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#9ca3af", fontSize: "13px" }}>
            <span>Portal</span>
            <Icons.ChevronRight />
            <span style={{ color: "#111", fontWeight: "600" }}>Dashboard</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "38px", height: "38px", borderRadius: "50%",
              background: `hsl(${hue}, 60%, 18%)`,
              color: `hsl(${hue}, 60%, 72%)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "13px", fontWeight: "800", fontFamily: "'Playfair Display', serif",
            }}>{initials}</div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: "700", color: "#111" }}>{user?.fullName}</p>
              <p style={{ fontSize: "11px", color: "#9ca3af" }}>{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "32px", flex: 1 }}>

          {/* Greeting */}
          <div style={{ marginBottom: "28px" }}>
            <p style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.2em", textTransform: "uppercase", color: "#2563EB", marginBottom: "8px" }}>
              Student Portal
            </p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "34px", fontWeight: "900", color: "#0a0a0a", lineHeight: 1.15 }}>
              Welcome back, {user?.fullName?.split(" ")[0]}.
            </h1>
            <p style={{ color: "#6b7280", marginTop: "6px", fontSize: "15px" }}>
              Here's an overview of your account and recent activity.
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
            {stats.map((s) => (
              <div key={s.label} style={{
                background: "white", borderRadius: "16px",
                padding: "20px 22px", border: "1px solid #e8edf3",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}>
                <p style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af", marginBottom: "10px" }}>
                  {s.label}
                </p>
                <div style={{
                  display: "inline-block", padding: "6px 14px", borderRadius: "8px",
                  background: s.bg, color: s.color,
                  fontSize: "15px", fontWeight: "800",
                  textTransform: s.capitalize ? "capitalize" : "none",
                }}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>

          {/* Main grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "20px" }}>

            {/* Profile card */}
            <div style={{
              background: "white", borderRadius: "20px",
              border: "1px solid #e8edf3", padding: "28px",
              boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
            }}>
              {/* Card header */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px", paddingBottom: "24px", borderBottom: "1px solid #f1f5f9" }}>
                <div style={{
                  width: "60px", height: "60px", borderRadius: "16px",
                  background: `hsl(${hue}, 60%, 18%)`,
                  color: `hsl(${hue}, 60%, 72%)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "22px", fontWeight: "900", fontFamily: "'Playfair Display', serif",
                  flexShrink: 0,
                }}>{initials}</div>
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: "900", color: "#0a0a0a" }}>
                    {user?.fullName}
                  </h2>
                  <p style={{ color: "#9ca3af", fontSize: "13px", marginTop: "3px" }}>{user?.email}</p>
                </div>
                <div style={{ marginLeft: "auto" }}>
                  <span style={{
                    padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "700",
                    background: user?.isOnline ? "#f0fdf4" : "#f9fafb",
                    color: user?.isOnline ? "#16a34a" : "#9ca3af",
                    display: "flex", alignItems: "center", gap: "6px",
                  }}>
                    <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: user?.isOnline ? "#16a34a" : "#d1d5db" }} />
                    {user?.isOnline ? "Online" : "Offline"}
                  </span>
                </div>
              </div>

              <h3 style={{ fontSize: "13px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px" }}>
                Account Information
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {infoFields.map((field) => (
                  <div key={field.label} style={{
                    background: "#f8f9fb", borderRadius: "12px",
                    padding: "16px", border: "1px solid #f1f5f9",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "7px", color: "#9ca3af", fontSize: "12px", fontWeight: "600", marginBottom: "8px" }}>
                      <field.icon />
                      {field.label}
                    </div>
                    <p style={{
                      fontWeight: "700", color: "#0a0a0a", fontSize: "14px",
                      wordBreak: "break-word",
                      textTransform: field.capitalize ? "capitalize" : "none",
                    }}>
                      {field.value || "—"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity sidebar */}
            <div style={{
              background: "white", borderRadius: "20px",
              border: "1px solid #e8edf3", padding: "28px",
              boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
              display: "flex", flexDirection: "column",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: "900", color: "#0a0a0a" }}>
                  Recent Activity
                </h3>
                <span style={{
                  background: "#eff6ff", color: "#2563EB",
                  fontSize: "11px", fontWeight: "700",
                  padding: "4px 10px", borderRadius: "20px",
                }}>
                  {recentActivity.length} sessions
                </span>
              </div>

              {recentActivity.length === 0 ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#d1d5db", paddingTop: "20px" }}>
                  <Icons.Clock />
                  <p style={{ fontSize: "13px", marginTop: "10px" }}>No activity yet</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {recentActivity.map((item, i) => {
                    const mobile = isMobile(item.device);
                    return (
                      <div key={i} style={{
                        padding: "14px 16px", borderRadius: "12px",
                        background: i === 0 ? "#f0f7ff" : "#f8f9fb",
                        border: `1px solid ${i === 0 ? "#dbeafe" : "#f1f5f9"}`,
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                          <span style={{ color: i === 0 ? "#2563EB" : "#9ca3af" }}>
                            {mobile ? <Icons.Smartphone /> : <Icons.Monitor />}
                          </span>
                          <p style={{ fontSize: "13px", fontWeight: "700", color: i === 0 ? "#1d4ed8" : "#374151" }}>
                            Login {i === 0 ? <span style={{ fontSize: "10px", background: "#2563EB", color: "white", padding: "2px 7px", borderRadius: "10px", marginLeft: "4px" }}>Latest</span> : ""}
                          </p>
                        </div>
                        <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>
                          {new Date(item.time).toLocaleString()}
                        </p>
                        <p style={{ fontSize: "11px", color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {item.device || "Unknown device"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}