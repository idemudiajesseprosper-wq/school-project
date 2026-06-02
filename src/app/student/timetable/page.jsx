"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const PERIOD_STYLES = {
  subject:  { bg: "#eff2ff", color: "#3b5bdb", border: "#c5d0f0", dot: "#3b5bdb" },
  break:    { bg: "#f0fdf4", color: "#0ca678", border: "#bbf7d0", dot: "#0ca678" },
  assembly: { bg: "#fff9db", color: "#f59f00", border: "#fde68a", dot: "#f59f00" },
};

const NAV_ITEMS = [
  { label: "Dashboard", href: "/student", icon: (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>) },
  { label: "Assignments", href: "/student/assignments", icon: (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>) },
  { label: "Timetable", href: "/student/timetable", active: true, icon: (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>) },
  { label: "Alerts", href: "/student/notifications", icon: (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>) },
];

function Sidebar() {
  return (
    <aside style={S.sidebar}>
      <div style={S.sidebarLogo}>
        <div style={S.logoIcon}><svg width="20" height="20" viewBox="0 0 28 28" fill="none"><rect width="28" height="28" rx="7" fill="#3b5bdb"/><path d="M7 14h14M14 7l7 7-7 7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
        <div><p style={S.logoName}>EduPortal</p><p style={S.logoSub}>Student Portal</p></div>
      </div>
      <nav style={S.sideNav}>
        <p style={S.navSection}>My Portal</p>
        {NAV_ITEMS.map(item => (
          <a key={item.label} href={item.href} className={`nav-link${item.active ? " nav-active" : ""}`}>
            {item.icon}<span>{item.label}</span>
          </a>
        ))}
      </nav>
      <div style={S.sideFooter}>
        <a href="/student" style={S.backLink}>← Back to Dashboard</a>
      </div>
    </aside>
  );
}

function MobileDrawer({ open, onClose }) {
  if (!open) return null;
  return (
    <>
      <div onClick={onClose} style={S.backdrop} />
      <div style={S.drawer}>
        <div style={S.drawerHead}>
          <div style={S.logoIcon}><svg width="20" height="20" viewBox="0 0 28 28" fill="none"><rect width="28" height="28" rx="7" fill="#3b5bdb"/><path d="M7 14h14M14 7l7 7-7 7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
          <div style={{ flex: 1 }}><p style={S.logoName}>EduPortal</p><p style={S.logoSub}>Student Portal</p></div>
          <button onClick={onClose} style={S.drawerClose}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>
        <nav style={{ padding: "12px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV_ITEMS.map(item => (
            <a key={item.label} href={item.href} className={`nav-link${item.active ? " nav-active" : ""}`}>{item.icon}<span>{item.label}</span></a>
          ))}
        </nav>
      </div>
    </>
  );
}

export default function StudentTimetablePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [timetable, setTimetable] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeDay, setActiveDay] = useState(() => {
    const today = new Date().getDay();
    const dayMap = { 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday" };
    return dayMap[today] || "Monday";
  });
  const [viewMode, setViewMode] = useState("day"); // "day" | "week" on mobile

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/student/timetable");
      const json = await res.json();
      if (!json.success) { router.push("/login/student"); return; }
      setTimetable(json.timetable);
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) return (
    <div style={S.loadWrap}>
      <div style={S.spinner} />
      <p style={S.loadText}>Loading your timetable…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const todayData = timetable?.days?.find(d => d.day === activeDay);
  const isToday = (day) => {
    const dayMap = { 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday" };
    return dayMap[new Date().getDay()] === day;
  };

  return (
    <div style={S.page}>
      <style>{globalCss}</style>

      <div className="tt-desktop-sidebar"><Sidebar /></div>
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <main style={S.main}>
        {/* Topbar */}
        <header style={S.topbar} className="tt-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setDrawerOpen(true)} className="tt-menu-btn">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <div>
              <p style={S.breadcrumb}>Student Portal / Timetable</p>
              <h1 style={S.pageTitle}>{timetable?.class || "Class"} Timetable</h1>
            </div>
          </div>
          {/* View mode toggle — mobile */}
          <div className="tt-view-toggle" style={S.viewToggle}>
            {["day", "week"].map(mode => (
              <button key={mode} onClick={() => setViewMode(mode)}
                style={{ ...S.viewBtn, background: viewMode === mode ? "#3b5bdb" : "transparent", color: viewMode === mode ? "white" : "#64748b" }}>
                {mode === "day" ? "Day" : "Week"}
              </button>
            ))}
          </div>
        </header>

        {!timetable ? (
          <div style={S.emptyWrap}>
            <div style={S.emptyIcon}>📅</div>
            <p style={S.emptyTitle}>No timetable yet</p>
            <p style={S.emptyMsg}>Your teacher hasn't published a timetable for your class yet. Check back soon.</p>
          </div>
        ) : (
          <div style={S.body} className="tt-body">

            {/* ── MOBILE: Day Selector ── */}
            <div className="tt-day-strip">
              {DAYS.map(day => (
                <button key={day} onClick={() => setActiveDay(day)}
                  className={`tt-day-btn${activeDay === day ? " tt-day-active" : ""}${isToday(day) ? " tt-day-today" : ""}`}>
                  <span style={{ fontSize: 10, display: "block", marginBottom: 1 }}>{day.slice(0, 3).toUpperCase()}</span>
                  {isToday(day) && <span style={S.todayDot} />}
                </button>
              ))}
            </div>

            {/* ── MOBILE DAY VIEW ── */}
            {viewMode === "day" && (
              <div className="tt-day-view">
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <h2 style={S.dayViewTitle}>{activeDay}</h2>
                  {isToday(activeDay) && <span style={S.todayBadge}>Today</span>}
                </div>
                <div style={{ display: "grid", gap: 10 }}>
                  {(todayData?.periods || []).map((period) => {
                    const ps = PERIOD_STYLES[period.type] || PERIOD_STYLES.subject;
                    return (
                      <div key={period.periodNumber} style={{ ...S.periodCard, background: ps.bg, borderColor: ps.border }}>
                        <div style={S.periodLeft}>
                          <div style={{ ...S.periodDot, background: ps.dot }} />
                          <div style={S.periodTimeCol}>
                            <p style={S.periodTime}>{period.startTime || "--"}–{period.endTime || "--"}</p>
                            <p style={{ ...S.periodNum, color: ps.color }}>Period {period.periodNumber}</p>
                          </div>
                        </div>
                        <div style={S.periodRight}>
                          <p style={{ ...S.periodSubject, color: ps.color }}>
                            {period.type === "subject" ? (period.subject || "Subject") : period.type.charAt(0).toUpperCase() + period.type.slice(1)}
                          </p>
                          {period.teacherName && <p style={S.periodTeacher}>{period.teacherName}</p>}
                          <span style={{ ...S.typeBadge, background: ps.color + "18", color: ps.color }}>{period.type}</span>
                        </div>
                      </div>
                    );
                  })}
                  {(!todayData?.periods?.length) && (
                    <div style={S.noPeriods}>No periods scheduled for {activeDay}.</div>
                  )}
                </div>
              </div>
            )}

            {/* ── MOBILE WEEK VIEW (compact cards) ── */}
            {viewMode === "week" && (
              <div className="tt-week-view" style={{ display: "grid", gap: 14 }}>
                {timetable.days?.map(day => (
                  <div key={day.day} style={{ ...S.weekDayCard, borderColor: isToday(day.day) ? "#3b5bdb" : "#e2e8f0" }}>
                    <div style={S.weekDayHead}>
                      <p style={S.weekDayName}>{day.day}</p>
                      {isToday(day.day) && <span style={S.todayBadge}>Today</span>}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                      {(day.periods || []).map(period => {
                        const ps = PERIOD_STYLES[period.type] || PERIOD_STYLES.subject;
                        return (
                          <div key={period.periodNumber} style={{ ...S.weekPeriodCell, background: ps.bg, borderColor: ps.border }}>
                            <p style={{ fontSize: 9, fontWeight: 700, color: ps.color, textTransform: "uppercase", letterSpacing: "0.04em" }}>P{period.periodNumber}</p>
                            <p style={{ fontSize: 11, fontWeight: 700, color: "#0f172a", marginTop: 2, lineHeight: 1.2 }}>{period.type === "subject" ? (period.subject || "—") : period.type}</p>
                            <p style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>{period.startTime || "--"}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── DESKTOP: Full table ── */}
            <div className="tt-desktop-table">
              <div style={{ overflowX: "auto", borderRadius: 16, border: "1px solid #e2e8f0", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
                <table style={S.table}>
                  <thead>
                    <tr style={{ background: "#0f172a" }}>
                      <th style={{ ...S.th, color: "#94a3b8", width: 110 }}>Day</th>
                      {Array.from({ length: 8 }, (_, i) => (
                        <th key={i} style={{ ...S.th, color: "#94a3b8" }}>Period {i+1}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timetable.days?.map((day, dIdx) => (
                      <tr key={day.day} style={{ background: isToday(day.day) ? "#f5f7ff" : dIdx % 2 === 0 ? "white" : "#fafbfc" }}>
                        <td style={{ ...S.dayCell, borderLeft: isToday(day.day) ? "3px solid #3b5bdb" : "3px solid transparent" }}>
                          <p style={S.dayCellName}>{day.day}</p>
                          {isToday(day.day) && <span style={{ ...S.todayBadge, fontSize: 9 }}>Today</span>}
                        </td>
                        {(day.periods || []).map(period => {
                          const ps = PERIOD_STYLES[period.type] || PERIOD_STYLES.subject;
                          return (
                            <td key={period.periodNumber} style={S.periodCell}>
                              {period.type !== "subject" ? (
                                <div style={{ ...S.periodCellInner, background: ps.bg, borderColor: ps.border }}>
                                  <p style={{ ...S.cellType, color: ps.color }}>{period.type}</p>
                                  <p style={S.cellTime}>{period.startTime || "--"}–{period.endTime || "--"}</p>
                                </div>
                              ) : (
                                <div style={{ ...S.periodCellInner, background: ps.bg, borderColor: ps.border }}>
                                  <p style={{ ...S.cellSubject, color: ps.color }}>{period.subject || "—"}</p>
                                  <p style={S.cellTime}>{period.startTime || "--"}–{period.endTime || "--"}</p>
                                  {period.teacherName && <p style={S.cellTeacher}>{period.teacherName}</p>}
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* Mobile bottom nav */}
        <nav style={S.mobileBottomNav} className="tt-bottom-nav">
          {NAV_ITEMS.map(item => (
            <a key={item.label} href={item.href} style={{ ...S.mobileNavItem, color: item.active ? "#3b5bdb" : "#94a3b8" }}>
              {item.icon}
              <span style={{ fontSize: 9, fontWeight: item.active ? 700 : 500 }}>{item.label}</span>
            </a>
          ))}
        </nav>
      </main>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
  page: { display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "'Sora', sans-serif" },
  sidebar: { width: 240, minWidth: 240, background: "#0f172a", display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0, flexShrink: 0 },
  sidebarLogo: { display: "flex", alignItems: "center", gap: 10, padding: "24px 20px 22px", borderBottom: "1px solid rgba(255,255,255,0.06)" },
  logoIcon: { width: 34, height: 34, borderRadius: 9, background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  logoName: { fontSize: 14, fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.02em" },
  logoSub: { fontSize: 11, color: "#475569", marginTop: 1 },
  sideNav: { flex: 1, padding: "14px 12px", display: "flex", flexDirection: "column", gap: 2 },
  navSection: { fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.15em", textTransform: "uppercase", padding: "6px 10px 10px" },
  sideFooter: { padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.06)" },
  backLink: { fontSize: 13, fontWeight: 600, color: "#475569", textDecoration: "none" },

  backdrop: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 40, backdropFilter: "blur(2px)" },
  drawer: { position: "fixed", top: 0, left: 0, bottom: 0, width: 280, background: "#0f172a", zIndex: 50, display: "flex", flexDirection: "column" },
  drawerHead: { display: "flex", alignItems: "center", gap: 10, padding: "20px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" },
  drawerClose: { background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: 4, marginLeft: "auto" },

  main: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0 },
  topbar: { background: "white", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 20, padding: "14px 32px" },
  breadcrumb: { fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" },
  pageTitle: { fontSize: 20, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", marginTop: 2 },

  viewToggle: { display: "none", background: "#f1f5f9", borderRadius: 9, padding: 3, gap: 2 },
  viewBtn: { padding: "5px 12px", border: "none", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora', sans-serif", transition: "all 0.15s" },

  body: { flex: 1, padding: "24px 32px 40px" },

  // Day selector strip (mobile)
  todayDot: { width: 5, height: 5, borderRadius: "50%", background: "#3b5bdb", display: "block", margin: "3px auto 0" },
  todayBadge: { fontSize: 10, fontWeight: 700, color: "#3b5bdb", background: "#eff2ff", padding: "3px 8px", borderRadius: 5, border: "1px solid #c5d0f0" },

  // Day view (mobile)
  dayViewTitle: { fontSize: 20, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" },
  periodCard: { display: "flex", alignItems: "stretch", gap: 0, border: "1px solid", borderRadius: 14, overflow: "hidden" },
  periodLeft: { display: "flex", alignItems: "center", gap: 10, padding: "14px 14px 14px 16px", minWidth: 100 },
  periodDot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
  periodTimeCol: {},
  periodTime: { fontSize: 12, fontWeight: 700, color: "#0f172a", fontFamily: "'JetBrains Mono', monospace" },
  periodNum: { fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 2 },
  periodRight: { flex: 1, padding: "14px 16px 14px 0", borderLeft: "1px solid rgba(0,0,0,0.06)" },
  periodSubject: { fontSize: 15, fontWeight: 800, letterSpacing: "-0.01em" },
  periodTeacher: { fontSize: 12, color: "#64748b", marginTop: 2 },
  typeBadge: { display: "inline-block", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", padding: "2px 7px", borderRadius: 5, marginTop: 6 },
  noPeriods: { fontSize: 14, color: "#94a3b8", textAlign: "center", padding: "32px 0" },

  // Week view mobile
  weekDayCard: { background: "white", border: "1.5px solid", borderRadius: 14, padding: "14px 16px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" },
  weekDayHead: { display: "flex", alignItems: "center", gap: 8, marginBottom: 12 },
  weekDayName: { fontSize: 13, fontWeight: 800, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.04em" },
  weekPeriodCell: { border: "1px solid", borderRadius: 8, padding: "8px 8px" },

  // Desktop table
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "12px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap" },
  dayCell: { padding: "14px 16px", verticalAlign: "top", borderBottom: "1px solid #f1f5f9" },
  dayCellName: { fontSize: 13, fontWeight: 800, color: "#0f172a", marginBottom: 4 },
  periodCell: { padding: "8px 10px", verticalAlign: "top", borderBottom: "1px solid #f1f5f9" },
  periodCellInner: { border: "1px solid", borderRadius: 10, padding: "10px 12px", minWidth: 120 },
  cellSubject: { fontSize: 13, fontWeight: 800, letterSpacing: "-0.01em" },
  cellType: { fontSize: 12, fontWeight: 700, textTransform: "capitalize" },
  cellTime: { fontSize: 11, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", marginTop: 3 },
  cellTeacher: { fontSize: 11, color: "#94a3b8", marginTop: 4 },

  mobileBottomNav: { position: "fixed", bottom: 0, left: 0, right: 0, background: "white", borderTop: "1px solid #e2e8f0", zIndex: 30, display: "none", padding: "8px 0" },
  mobileNavItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: 3, textDecoration: "none", flex: 1, padding: "0 6px" },

  loadWrap: { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, fontFamily: "'Sora', sans-serif", background: "#f8fafc" },
  spinner: { width: 36, height: 36, border: "3px solid #e2e8f0", borderTopColor: "#3b5bdb", borderRadius: "50%", animation: "spin 0.7s linear infinite" },
  loadText: { fontSize: 14, color: "#64748b", fontWeight: 500 },

  emptyWrap: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px", textAlign: "center" },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 6 },
  emptyMsg: { fontSize: 14, color: "#94a3b8", maxWidth: 340, lineHeight: 1.6 },
};

const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body > header, body > nav, nav.site-nav, header.site-header { display: none !important; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .nav-link {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 10px;
    font-size: 13.5px; font-weight: 500; color: #64748b;
    text-decoration: none; transition: all 0.15s ease; font-family: 'Sora', sans-serif;
  }
  .nav-link:hover { background: rgba(255,255,255,0.05); color: #cbd5e1; }
  .nav-active { background: rgba(59,91,219,0.2) !important; color: #a5b4fc !important; font-weight: 600; }

  .tt-desktop-sidebar { display: flex !important; }
  .tt-menu-btn { display: none !important; background: none; border: none; cursor: pointer; color: #0f172a; padding: 2px; }
  .tt-bottom-nav { display: none !important; }
  .tt-day-strip { display: none !important; }
  .tt-day-view { display: none !important; }
  .tt-week-view { display: none !important; }
  .tt-view-toggle { display: none !important; }
  .tt-desktop-table { display: block !important; }

  @media (max-width: 768px) {
    .tt-desktop-sidebar { display: none !important; }
    .tt-menu-btn { display: flex !important; }
    .tt-bottom-nav { display: flex !important; }
    .tt-day-strip { display: flex !important; gap: 8px; overflow-x: auto; padding: 14px 16px 10px; background: white; border-bottom: 1px solid #e2e8f0; scrollbar-width: none; }
    .tt-day-strip::-webkit-scrollbar { display: none; }
    .tt-day-view { display: block !important; }
    .tt-week-view { display: grid !important; }
    .tt-view-toggle { display: flex !important; }
    .tt-desktop-table { display: none !important; }
    .tt-topbar { padding: 12px 16px !important; }
    .tt-body { padding: 0 0 90px !important; }
  }

  .tt-day-btn {
    flex-shrink: 0; min-width: 52px; padding: 8px 10px; border-radius: 11px;
    border: 1.5px solid #e2e8f0; background: white; cursor: pointer;
    font-size: 11px; font-weight: 700; color: #64748b;
    font-family: 'Sora', sans-serif; transition: all 0.15s; text-align: center;
  }
  .tt-day-btn:hover { border-color: #3b5bdb; color: #3b5bdb; }
  .tt-day-active { background: #3b5bdb !important; color: white !important; border-color: #3b5bdb !important; }
  .tt-day-today { border-color: #3b5bdb; }

  .tt-day-view { padding: 16px 16px 0; }
  .tt-week-view { padding: 14px 16px 0; }
`;
