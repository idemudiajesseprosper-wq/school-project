"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/* ─── Design tokens (matches assignments page) ───────────────── */
const T = {
  bg:        "#0B0E1A",
  surface:   "#111422",
  card:      "#161A2C",
  cardHover: "#1C2138",
  border:    "rgba(255,255,255,0.07)",
  borderMid: "rgba(255,255,255,0.12)",
  amber:     "#F5A623",
  amberDim:  "rgba(245,166,35,0.12)",
  amberGlow: "rgba(245,166,35,0.25)",
  blue:      "#4C8FE8",
  blueDim:   "rgba(76,143,232,0.12)",
  t1:        "#F0F2FF",
  t2:        "#9BA3C4",
  t3:        "#555D80",
};

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: ${T.bg}; }

  @keyframes spin    { to { transform: rotate(360deg); } }
  @keyframes fadeUp  { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

  .portal-page { font-family: 'DM Sans', sans-serif; color: ${T.t1}; }

  .nav-item {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 14px; border-radius: 10px;
    font-size: 13.5px; font-weight: 500; color: ${T.t3};
    text-decoration: none; transition: all 0.16s;
  }
  .nav-item:hover { background: rgba(255,255,255,0.04); color: ${T.t2}; }
  .nav-item.active {
    background: ${T.amberDim};
    color: ${T.amber};
    border: 1px solid ${T.amberGlow};
  }

  .notif-card {
    display: flex; gap: 14px;
    background: ${T.card};
    border: 1px solid ${T.border};
    border-radius: 14px;
    padding: 18px 20px;
    transition: border-color 0.2s, background 0.2s;
    animation: fadeUp 0.3s ease both;
  }
  .notif-card:hover { border-color: ${T.borderMid}; background: ${T.cardHover}; }

  /* Bottom nav */
  .bottom-nav {
    display: none;
    position: fixed; bottom: 0; left: 0; right: 0;
    background: ${T.surface};
    border-top: 1px solid ${T.border};
    padding: 8px 0 env(safe-area-inset-bottom);
    z-index: 200;
  }
  .bottom-nav-inner { display: flex; justify-content: space-around; align-items: center; }
  .bnav-item {
    display: flex; flex-direction: column; align-items: center; gap: 3px;
    font-size: 10px; font-weight: 500; color: ${T.t3};
    text-decoration: none; padding: 6px 12px;
    border: none; background: none; cursor: pointer;
  }
  .bnav-item.active { color: ${T.amber}; }
  .bnav-item svg { width: 22px; height: 22px; }

  @media (max-width: 768px) {
    .sidebar-wrap { display: none !important; }
    .portal-main  { padding: 20px 16px 90px !important; max-width: 100% !important; }
    .bottom-nav   { display: block; }
  }
`;

const NAV_ITEMS = [
  { label: "Dashboard",    href: "/student",                icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",                                                                           active: false },
  { label: "Assignments",  href: "/student/assignments",    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2 M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",   active: false },
  { label: "Timetable",    href: "/student/timetable",      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",                                              active: false },
  { label: "Alerts",       href: "/student/notifications",  icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9", active: true },
];

/* ─── Helpers ────────────────────────────────────────────────── */
function NavIcon({ path }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}

function formatDate(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now - d;
  if (diff < 60_000)   return "Just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  if (diff < 604_800_000) return `${Math.floor(diff / 86_400_000)}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function StudentNotificationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [notices, setNotices] = useState([]);
  const [studentClass, setStudentClass] = useState("");

  useEffect(() => {
    async function load() {
      const res  = await fetch("/api/student/notifications");
      const json = await res.json();
      if (!json.success) { router.push("/login/student"); return; }
      setNotices(json.notices || []);
      setStudentClass(json.studentClass || "");
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={S.loadWrap} className="portal-page">
        <div style={S.spinner} />
        <p style={{ fontSize: 14, color: T.t3, marginTop: 12, fontFamily: "'DM Sans',sans-serif" }}>
          Loading notifications…
        </p>
      </div>
    </>
  );

  return (
    <div style={S.page} className="portal-page">
      <style>{GLOBAL_CSS}</style>

      {/* ── Sidebar ─────────────────────────────── */}
      <div className="sidebar-wrap" style={S.sidebarWrap}>
        <aside style={S.sidebar}>
          {/* Brand */}
          <div style={S.brandRow}>
            <div style={S.logoMark}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke={T.amber} strokeWidth="2" strokeLinecap="round">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: T.t1, letterSpacing: "-0.01em" }}>EduPortal</p>
              <p style={{ fontSize: 11, color: T.t3, marginTop: 1 }}>{studentClass || "My class"}</p>
            </div>
          </div>

          <div style={S.divider} />

          {/* Nav */}
          <nav style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
            {NAV_ITEMS.map(n => (
              <a key={n.label} href={n.href} className={`nav-item${n.active ? " active" : ""}`}>
                <NavIcon path={n.icon} />
                <span>{n.label}</span>
                {n.active && notices.length > 0 && (
                  <span style={S.badge}>{notices.length}</span>
                )}
              </a>
            ))}
          </nav>

          {/* Footer */}
          <div style={S.sideFooter}>
            <div style={S.avatarCircle}>S</div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: T.t1 }}>Student</p>
              <p style={{ fontSize: 11, color: T.t3, marginTop: 1 }}>{studentClass}</p>
            </div>
          </div>
        </aside>
      </div>

      {/* ── Main ────────────────────────────────── */}
      <main className="portal-main" style={S.main}>

        {/* Header */}
        <header style={S.header}>
          <div>
            <p style={S.breadcrumb}>Student Portal · Alerts</p>
            <h1 style={S.pageTitle}>
              My{" "}
              <em style={{ fontFamily: "'Instrument Serif',serif", fontStyle: "italic", color: T.amber }}>
                Notifications
              </em>
            </h1>
            <p style={{ fontSize: 13, color: T.t3, marginTop: 6 }}>
              Announcements from teachers assigned to your class.
            </p>
          </div>
          {notices.length > 0 && (
            <div style={S.countPill}>
              <span style={{ fontSize: 18, fontWeight: 700, color: T.amber, fontFamily: "'JetBrains Mono',monospace", lineHeight: 1 }}>
                {notices.length}
              </span>
              <span style={{ fontSize: 11, color: T.t3, fontWeight: 500, marginTop: 2 }}>Total</span>
            </div>
          )}
        </header>

        {/* Empty */}
        {notices.length === 0 ? (
          <div style={S.emptyWrap}>
            <div style={S.emptyIcon}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                stroke={T.amber} strokeWidth="1.6" strokeLinecap="round">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <p style={{ fontSize: 16, fontWeight: 600, color: T.t1, marginBottom: 6 }}>All clear</p>
            <p style={{ fontSize: 13, color: T.t3, maxWidth: 280, lineHeight: 1.6, textAlign: "center" }}>
              When your teachers post announcements, they'll show up here.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {notices.map((notice, i) => (
              <article key={notice._id} className="notif-card" style={{ animationDelay: `${i * 0.06}s` }}>
                {/* Icon col */}
                <div style={S.notifIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke={T.amber} strokeWidth="1.8" strokeLinecap="round">
                    <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>

                {/* Content col */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
                    <h2 style={{ fontSize: 15, fontWeight: 600, color: T.t1, letterSpacing: "-0.01em", lineHeight: 1.3 }}>
                      {notice.title}
                    </h2>
                    <span style={{ fontSize: 11, color: T.t3, whiteSpace: "nowrap", fontFamily: "'JetBrains Mono',monospace", flexShrink: 0, marginTop: 2 }}>
                      {formatDate(notice.createdAt)}
                    </span>
                  </div>
                  <p style={{ fontSize: 14, color: T.t2, lineHeight: 1.6 }}>{notice.message}</p>
                  <p style={{ fontSize: 12, color: T.amber, fontWeight: 600, marginTop: 10 }}>
                    {notice.teacherName || "Teacher"}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* ── Mobile bottom nav ──────────────────── */}
      <nav className="bottom-nav">
        <div className="bottom-nav-inner">
          {NAV_ITEMS.map(n => (
            <a key={n.label} href={n.href} className={`bnav-item${n.active ? " active" : ""}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d={n.icon} />
              </svg>
              {n.label}
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}

/* ─── Styles ─────────────────────────────────────────────────── */
const S = {
  page:       { display: "flex", minHeight: "100vh", background: T.bg },
  sidebarWrap:{ width: 252, flexShrink: 0, position: "sticky", top: 0, height: "100vh" },
  sidebar:    { height: "100%", display: "flex", flexDirection: "column", padding: "24px 14px", background: T.surface, borderRight: `1px solid ${T.border}` },
  brandRow:   { display: "flex", alignItems: "center", gap: 10, padding: "0 6px 20px" },
  logoMark:   { width: 36, height: 36, borderRadius: 10, background: T.amberDim, border: `1px solid ${T.amberGlow}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  divider:    { height: "0.5px", background: T.border, margin: "0 0 14px" },
  badge:      { marginLeft: "auto", background: T.amber, color: T.bg, fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20 },
  sideFooter: { display: "flex", alignItems: "center", gap: 10, paddingTop: 16, borderTop: `1px solid ${T.border}`, marginTop: 16 },
  avatarCircle:{ width: 34, height: 34, borderRadius: "50%", background: T.amberDim, border: `1px solid ${T.amberGlow}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: T.amber, flexShrink: 0 },

  main:       { flex: 1, padding: "36px 40px", maxWidth: "calc(100vw - 252px)", overflowX: "hidden" },
  header:     { display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 32 },
  breadcrumb: { fontSize: 11, fontWeight: 600, color: T.t3, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 5 },
  pageTitle:  { fontSize: 30, fontWeight: 700, color: T.t1, letterSpacing: "-0.025em", lineHeight: 1.1 },
  countPill:  { display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 18px", borderRadius: 12, border: `1px solid ${T.amber}33`, background: T.amberDim, minWidth: 72 },

  notifIcon:  { width: 38, height: 38, borderRadius: 10, background: T.amberDim, border: `1px solid ${T.amberGlow}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },

  emptyWrap:  { display: "flex", flexDirection: "column", alignItems: "center", padding: "70px 20px" },
  emptyIcon:  { width: 64, height: 64, borderRadius: "50%", background: T.amberDim, border: `1px solid ${T.amberGlow}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 },

  loadWrap:   { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: T.bg },
  spinner:    { width: 30, height: 30, border: `2.5px solid ${T.amberDim}`, borderTopColor: T.amber, borderRadius: "50%", animation: "spin 0.7s linear infinite" },
};