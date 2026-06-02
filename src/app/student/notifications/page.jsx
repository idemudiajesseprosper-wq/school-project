"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/student", icon: "home" },
  { label: "Assignments", href: "/student/assignments", icon: "book" },
  { label: "Timetable", href: "/student/timetable", icon: "calendar" },
  { label: "Alerts", href: "/student/notifications", icon: "bell", active: true },
];

const ICONS = {
  home: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
  ),
  book: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
  ),
  calendar: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
  ),
  bell: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
  ),
};

export default function StudentNotificationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [notices, setNotices] = useState([]);
  const [studentClass, setStudentClass] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/student/notifications");
      const json = await res.json();

      if (!json.success) {
        router.push("/login/student");
        return;
      }

      setNotices(json.notices || []);
      setStudentClass(json.studentClass || "");
      setLoading(false);
    }

    load();
  }, [router]);

  if (loading) {
    return (
      <div style={S.loading}>
        <div style={S.spinner} />
        <p>Loading notifications...</p>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <style>{css}</style>
      <aside style={S.sidebar}>
        <div style={S.brand}>
          <div style={S.logo}>W</div>
          <div>
            <p style={S.brandTitle}>Student Portal</p>
            <p style={S.brandSub}>{studentClass || "My class"}</p>
          </div>
        </div>
        <nav style={S.nav}>
          {NAV_ITEMS.map((item) => (
            <a key={item.label} href={item.href} className={`nav-link${item.active ? " nav-active" : ""}`}>
              {ICONS[item.icon]}
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </aside>

      <main style={S.main}>
        <header style={S.header}>
          <div>
            <p style={S.eyebrow}>Class alerts</p>
            <h1 style={S.title}>Notifications</h1>
            <p style={S.subtitle}>Announcements from teachers assigned to your class.</p>
          </div>
          <a href="/student" style={S.backLink}>Back to dashboard</a>
        </header>

        {notices.length === 0 ? (
          <section style={S.emptyCard}>
            <div style={S.emptyIcon}>{ICONS.bell}</div>
            <h2 style={S.emptyTitle}>No notifications yet</h2>
            <p style={S.emptyText}>When your teachers send a class announcement, it will appear here.</p>
          </section>
        ) : (
          <section style={S.list}>
            {notices.map((notice) => (
              <article key={notice._id} style={S.card}>
                <div style={S.cardIcon}>{ICONS.bell}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={S.cardTop}>
                    <h2 style={S.noticeTitle}>{notice.title}</h2>
                    <span style={S.date}>{new Date(notice.createdAt).toLocaleString()}</span>
                  </div>
                  <p style={S.message}>{notice.message}</p>
                  <p style={S.teacher}>{notice.teacherName || "Teacher"}</p>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

const S = {
  loading: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    background: "#f6f8fb",
    color: "#64748b",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  spinner: {
    width: 34,
    height: 34,
    border: "3px solid #dbe4ff",
    borderTopColor: "#3b5bdb",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  page: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "260px 1fr",
    background: "#f6f8fb",
    color: "#172033",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  sidebar: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "#fff",
    padding: "24px 16px",
  },
  brand: { display: "flex", alignItems: "center", gap: 12, marginBottom: 28 },
  logo: {
    width: 38,
    height: 38,
    borderRadius: 10,
    background: "#3b5bdb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
  },
  brandTitle: { fontWeight: 800, fontSize: 14, margin: 0 },
  brandSub: { color: "#94a3b8", fontSize: 12, margin: "2px 0 0" },
  nav: { display: "grid", gap: 4 },
  main: { padding: "30px", minWidth: 0 },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 22,
  },
  eyebrow: { margin: "0 0 6px", color: "#3b5bdb", fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" },
  title: { margin: 0, fontSize: "clamp(28px, 5vw, 42px)", lineHeight: 1.05, fontWeight: 900 },
  subtitle: { margin: "8px 0 0", color: "#64748b", fontSize: 14 },
  backLink: {
    textDecoration: "none",
    color: "#3b5bdb",
    fontWeight: 800,
    fontSize: 14,
    whiteSpace: "nowrap",
  },
  emptyCard: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    padding: "52px 20px",
    textAlign: "center",
  },
  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    background: "#eff2ff",
    color: "#3b5bdb",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  emptyTitle: { margin: 0, fontSize: 20, fontWeight: 900 },
  emptyText: { margin: "8px auto 0", color: "#64748b", maxWidth: 420 },
  list: { display: "grid", gap: 12 },
  card: {
    display: "flex",
    gap: 14,
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    padding: 18,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    background: "#eff2ff",
    color: "#3b5bdb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardTop: { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" },
  noticeTitle: { margin: 0, fontSize: 17, fontWeight: 900 },
  date: { color: "#94a3b8", fontSize: 12, whiteSpace: "nowrap" },
  message: { margin: "8px 0 0", color: "#334155", lineHeight: 1.6 },
  teacher: { margin: "10px 0 0", color: "#3b5bdb", fontSize: 12, fontWeight: 800 },
};

const css = `
.nav-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 12px;
  border-radius: 8px;
  color: #94a3b8;
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
}
.nav-link:hover,
.nav-active {
  background: rgba(59,91,219,0.16);
  color: #fff;
}
@keyframes spin { to { transform: rotate(360deg); } }
@media (max-width: 820px) {
  div[style*="grid-template-columns: 260px 1fr"] {
    grid-template-columns: 1fr !important;
  }
  aside {
    min-height: auto !important;
  }
  main {
    padding: 20px 14px 90px !important;
  }
}
`;
