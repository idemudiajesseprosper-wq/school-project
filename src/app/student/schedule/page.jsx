"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

/* ─── Design tokens ──────────────────────────────────────────── */
const T = {
  bg: "#F8F9FC",
  surface: "#FFFFFF",
  card: "#FFFFFF",
  cardHover: "#F5F6FA",
  border: "rgba(0,0,0,0.08)",
  borderMid: "rgba(0,0,0,0.14)",
  amber: "#F5A623",
  amberDim: "rgba(245,166,35,0.10)",
  amberGlow: "rgba(245,166,35,0.25)",
  green: "#3ECFA0",
  greenDim: "rgba(62,207,160,0.10)",
  blue: "#4C8FE8",
  blueDim: "rgba(76,143,232,0.10)",
  t1: "#0F1629",
  t2: "#4A5378",
  t3: "#8B93B0",
};

/* ─── Period accent palette ──────────────────────────────────── */
const SUBJECT_COLORS = [
  {
    bg: "rgba(76,143,232,0.10)",
    border: "rgba(76,143,232,0.25)",
    text: "#4C8FE8",
  },
  {
    bg: "rgba(245,166,35,0.10)",
    border: "rgba(245,166,35,0.25)",
    text: "#D4890A",
  },
  {
    bg: "rgba(62,207,160,0.10)",
    border: "rgba(62,207,160,0.25)",
    text: "#2BA882",
  },
  {
    bg: "rgba(240,82,82,0.10)",
    border: "rgba(240,82,82,0.25)",
    text: "#D94040",
  },
  {
    bg: "rgba(149,97,226,0.10)",
    border: "rgba(149,97,226,0.25)",
    text: "#8B5CD6",
  },
  {
    bg: "rgba(245,158,11,0.10)",
    border: "rgba(245,158,11,0.25)",
    text: "#B45309",
  },
];

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: ${T.bg}; }

  @keyframes spin   { to { transform: rotate(360deg); } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

  .portal-page { font-family: 'DM Sans', sans-serif; color: ${T.t1}; }

  .nav-item {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 14px; border-radius: 10px;
    font-size: 13.5px; font-weight: 500; color: ${T.t3};
    text-decoration: none; transition: all 0.16s;
  }
  .nav-item:hover { background: rgba(0,0,0,0.04); color: ${T.t2}; }
  .nav-item.active {
    background: ${T.amberDim};
    color: ${T.amber};
    border: 1px solid ${T.amberGlow};
  }

  .day-tab {
    padding: 9px 18px; border-radius: 10px;
    border: 1px solid ${T.border};
    background: ${T.card}; color: ${T.t3};
    font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.16s;
    font-family: 'DM Sans', sans-serif;
    white-space: nowrap;
  }
  .day-tab:hover { border-color: ${T.borderMid}; color: ${T.t2}; }
  .day-tab.active {
    background: ${T.amber}; border-color: ${T.amber};
    color: #fff;
  }
  .day-tab.today-tab {
    border-color: ${T.amberGlow};
    color: ${T.amber};
  }
  .day-tab.today-tab.active { color: #fff; }

  .period-card {
    border-radius: 12px; border: 1px solid;
    padding: 16px 18px;
    transition: transform 0.18s, box-shadow 0.18s;
    animation: fadeUp 0.3s ease both;
  }
  .period-card:hover { transform: translateY(-2px); box-shadow: 0 4px 20px rgba(0,0,0,0.06); }

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
    .period-grid  { grid-template-columns: 1fr !important; }
  }
`;

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/student",
    icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
    active: false,
  },
  {
    label: "Assignments",
    href: "/student/assignments",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2 M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    active: false,
  },
  {
    label: "Grades",
    href: "/student/grades",
    icon: "M18 20V10 M12 20V4 M6 20v-6",
    active: false,
  },
  {
    label: "Timetable",
    href: "/student/timetable",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    active: true,
  },
  {
    label: "Alerts",
    href: "/student/notifications",
    icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
    active: false,
  },
];

/* ─── Page ───────────────────────────────────────────────────── */
export default function StudentSchedulePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [timetable, setTimetable] = useState(null);
  const [activeDay, setActiveDay] = useState(() => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    return DAYS.includes(today) ? today : "Monday";
  });

  const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });

  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  async function loadSchedule() {
    const res = await fetch("/api/student/timetable");
    const json = await res.json();
    if (!json.success) {
      router.push("/login/student");
      return;
    }
    setTimetable(json.timetable);
    setLoading(false);
  }

  const activePeriods = useMemo(() => {
    const day = timetable?.days?.find((d) => d.day === activeDay);
    return day?.periods || [];
  }, [timetable, activeDay]);

  /* Assign a stable color to each unique subject */
  const subjectColorMap = useMemo(() => {
    const map = {};
    let idx = 0;
    (timetable?.days || []).forEach((d) => {
      (d.periods || []).forEach((p) => {
        const key = (p.subject || p.type || "").toLowerCase();
        if (key && !map[key]) {
          map[key] = SUBJECT_COLORS[idx % SUBJECT_COLORS.length];
          idx++;
        }
      });
    });
    return map;
  }, [timetable]);

  function getColor(period) {
    const key = (period.subject || period.type || "").toLowerCase();
    return subjectColorMap[key] || SUBJECT_COLORS[0];
  }

  if (loading)
    return (
      <>
        <style>{GLOBAL_CSS}</style>
        <div style={S.loadWrap} className="portal-page">
          <div style={S.spinner} />
          <p
            style={{
              fontSize: 14,
              color: T.t3,
              marginTop: 12,
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            Loading schedule…
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
          <div style={S.brandRow}>
            <div style={S.logoMark}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke={T.amber}
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: T.t1,
                  letterSpacing: "-0.01em",
                }}
              >
                EduPortal
              </p>
              <p style={{ fontSize: 11, color: T.t3, marginTop: 1 }}>
                {timetable?.class || "Winners' Foundation"}
              </p>
            </div>
          </div>

          <div style={S.divider} />

          <nav
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              flex: 1,
            }}
          >
            {NAV_ITEMS.map((n) => (
              <a
                key={n.label}
                href={n.href}
                className={`nav-item${n.active ? " active" : ""}`}
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={n.icon} />
                </svg>
                <span>{n.label}</span>
              </a>
            ))}
          </nav>

          {/* Mini week overview */}
          <div style={S.miniWeek}>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: T.t3,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 8,
              }}
            >
              This week
            </p>
            {DAYS.map((day) => {
              const dayData = timetable?.days?.find((d) => d.day === day);
              const count = dayData?.periods?.length || 0;
              const isToday = day === todayName;
              const isActive = day === activeDay;
              return (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "6px 8px",
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer",
                    background: isActive ? T.amberDim : "transparent",
                    marginBottom: 2,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: isToday ? 700 : 500,
                      color: isActive ? T.amber : isToday ? T.t1 : T.t3,
                    }}
                  >
                    {day.slice(0, 3)}
                    {isToday ? " ·" : ""}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      fontFamily: "'JetBrains Mono',monospace",
                      color: count ? (isActive ? T.amber : T.t2) : T.t3,
                    }}
                  >
                    {count > 0 ? `${count}p` : "—"}
                  </span>
                </button>
              );
            })}
          </div>

          <div style={S.sideFooter}>
            <div style={S.avatarCircle}>S</div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: T.t1 }}>
                Student
              </p>
              <p style={{ fontSize: 11, color: T.t3, marginTop: 1 }}>
                Class 10B
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* ── Main ────────────────────────────────── */}
      <main className="portal-main" style={S.main}>
        {/* Header */}
        <header style={S.header}>
          <div>
            <p style={S.breadcrumb}>Student Portal · Timetable</p>
            <h1 style={S.pageTitle}>
              Class{" "}
              <em
                style={{
                  fontFamily: "'Instrument Serif',serif",
                  fontStyle: "italic",
                  color: T.amber,
                }}
              >
                Schedule
              </em>
            </h1>
            <p style={{ fontSize: 13, color: T.t3, marginTop: 6 }}>
              {timetable?.class
                ? `${timetable.class} · Weekly timetable`
                : "No timetable published for your class yet."}
            </p>
          </div>
        </header>

        {/* Day tabs */}
        <div
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            marginBottom: 24,
            paddingBottom: 4,
          }}
        >
          {DAYS.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`day-tab${activeDay === day ? " active" : ""}${day === todayName && activeDay !== day ? " today-tab" : ""}`}
            >
              <span style={{ display: "block" }}>{day.slice(0, 3)}</span>
              {day === todayName && (
                <span
                  style={{
                    display: "block",
                    fontSize: 9,
                    fontWeight: 700,
                    marginTop: 1,
                    opacity: 0.7,
                    letterSpacing: "0.06em",
                  }}
                >
                  TODAY
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Day card */}
        <div style={S.dayCard}>
          {/* Card head */}
          <div style={S.dayCardHead}>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: T.t1 }}>
                {activeDay}
              </p>
              <p style={{ fontSize: 12, color: T.t3, marginTop: 2 }}>
                {activePeriods.length} period
                {activePeriods.length !== 1 ? "s" : ""}
              </p>
            </div>
            {activeDay === todayName && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: T.amber,
                  background: T.amberDim,
                  border: `1px solid ${T.amberGlow}`,
                  padding: "4px 10px",
                  borderRadius: 20,
                }}
              >
                Today
              </span>
            )}
          </div>

          {/* Periods */}
          {activePeriods.length > 0 ? (
            <div
              className="period-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 12,
                padding: 16,
              }}
            >
              {activePeriods.map((period, i) => {
                const col = getColor(period);
                const isBreak = period.type && period.type !== "subject";
                return (
                  <article
                    key={i}
                    className="period-card"
                    style={{
                      background: col.bg,
                      borderColor: col.border,
                      animationDelay: `${i * 0.06}s`,
                    }}
                  >
                    {/* Period number + type badge */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 10,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: T.t3,
                          fontFamily: "'JetBrains Mono',monospace",
                        }}
                      >
                        P{period.periodNumber || i + 1}
                      </span>
                      {isBreak && (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: col.text,
                            background: T.surface,
                            border: `1px solid ${col.border}`,
                            padding: "2px 7px",
                            borderRadius: 20,
                            textTransform: "capitalize",
                          }}
                        >
                          {period.type}
                        </span>
                      )}
                    </div>

                    {/* Subject name */}
                    <p
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: col.text,
                        letterSpacing: "-0.01em",
                        marginBottom: 6,
                        textTransform: "capitalize",
                      }}
                    >
                      {period.type === "subject"
                        ? period.subject || "Subject"
                        : period.type}
                    </p>

                    {/* Time */}
                    <p
                      style={{
                        fontSize: 12,
                        color: T.t2,
                        fontFamily: "'JetBrains Mono',monospace",
                        marginBottom: period.teacherName ? 6 : 0,
                      }}
                    >
                      {period.startTime || "--:--"} –{" "}
                      {period.endTime || "--:--"}
                    </p>

                    {/* Teacher */}
                    {period.teacherName && (
                      <p style={{ fontSize: 12, color: T.t3, marginTop: 2 }}>
                        {period.teacherName}
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <div style={{ padding: "56px 20px", textAlign: "center" }}>
              <div style={S.emptyIcon}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={T.amber}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                >
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: T.t1,
                  marginBottom: 6,
                }}
              >
                No periods scheduled
              </p>
              <p style={{ fontSize: 13, color: T.t3 }}>
                Check back after your class teacher updates the timetable.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* ── Mobile bottom nav ──────────────────── */}
      <nav className="bottom-nav">
        <div className="bottom-nav-inner">
          {NAV_ITEMS.map((n) => (
            <a
              key={n.label}
              href={n.href}
              className={`bnav-item${n.active ? " active" : ""}`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
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
  page: { display: "flex", minHeight: "100vh", background: T.bg },
  sidebarWrap: {
    width: 252,
    flexShrink: 0,
    position: "sticky",
    top: 0,
    height: "100vh",
  },
  sidebar: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    padding: "24px 14px",
    background: T.surface,
    borderRight: `1px solid ${T.border}`,
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 6px 20px",
  },
  logoMark: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: T.amberDim,
    border: `1px solid ${T.amberGlow}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  divider: { height: "0.5px", background: T.border, margin: "0 0 14px" },
  miniWeek: {
    padding: "14px 4px 4px",
    borderTop: `1px solid ${T.border}`,
    marginTop: 12,
  },
  sideFooter: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    paddingTop: 14,
    borderTop: `1px solid ${T.border}`,
    marginTop: 12,
  },
  avatarCircle: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: T.amberDim,
    border: `1px solid ${T.amberGlow}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 700,
    color: T.amber,
    flexShrink: 0,
  },

  main: {
    flex: 1,
    padding: "36px 40px",
    maxWidth: "calc(100vw - 252px)",
    overflowX: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 24,
  },
  breadcrumb: {
    fontSize: 11,
    fontWeight: 600,
    color: T.t3,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    marginBottom: 5,
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: 700,
    color: T.t1,
    letterSpacing: "-0.025em",
    lineHeight: 1.1,
  },

  dayCard: {
    background: T.card,
    border: `1px solid ${T.border}`,
    borderRadius: 14,
    overflow: "hidden",
  },
  dayCardHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    borderBottom: `1px solid ${T.border}`,
  },

  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: T.amberDim,
    border: `1px solid ${T.amberGlow}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
  },

  loadWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: T.bg,
  },
  spinner: {
    width: 30,
    height: 30,
    border: `2.5px solid ${T.amberDim}`,
    borderTopColor: T.amber,
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
};
