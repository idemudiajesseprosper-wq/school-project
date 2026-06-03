"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

/* ─── Design tokens ──────────────────────────────────────────── */
const T = {
  bg:        "#F8F9FC",
  surface:   "#FFFFFF",
  card:      "#FFFFFF",
  cardHover: "#F5F6FA",
  border:    "rgba(0,0,0,0.08)",
  borderMid: "rgba(0,0,0,0.14)",
  amber:     "#F5A623",
  amberDim:  "rgba(245,166,35,0.10)",
  amberGlow: "rgba(245,166,35,0.25)",
  green:     "#3ECFA0",
  greenDim:  "rgba(62,207,160,0.10)",
  blue:      "#4C8FE8",
  blueDim:   "rgba(76,143,232,0.10)",
  red:       "#F05252",
  redDim:    "rgba(240,82,82,0.10)",
  t1:        "#0F1629",
  t2:        "#4A5378",
  t3:        "#8B93B0",
};

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

  .grade-row {
    display: grid;
    grid-template-columns: 2fr 1fr 110px 90px 2fr;
    align-items: start;
    gap: 0;
    border-bottom: 1px solid ${T.border};
    transition: background 0.15s;
    animation: fadeUp 0.25s ease both;
  }
  .grade-row:hover { background: ${T.cardHover}; }
  .grade-row:last-child { border-bottom: none; }

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
    .grade-row    { grid-template-columns: 1fr 1fr !important; }
    .col-feedback { display: none; }
    .col-subject  { display: none; }
  }
`;

const NAV_ITEMS = [
  { label: "Dashboard",    href: "/student",                icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",                                                                            active: false },
  { label: "Assignments",  href: "/student/assignments",    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2 M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",    active: false },
  { label: "Grades",       href: "/student/grades",         icon: "M18 20V10 M12 20V4 M6 20v-6",                                                                                                            active: true  },
  { label: "Timetable",    href: "/student/timetable",      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",                                               active: false },
  { label: "Alerts",       href: "/student/notifications",  icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9", active: false },
];

/* ─── Page ───────────────────────────────────────────────────── */
export default function StudentGradesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ assignments: [], submissions: [] });

  useEffect(() => { loadGrades(); }, []);

  async function loadGrades() {
    const res  = await fetch("/api/student/assignments");
    const json = await res.json();
    if (!json.success) { router.push("/login/student"); return; }
    setData(json);
    setLoading(false);
  }

  const rows = useMemo(() => {
    const map = new Map((data.submissions || []).map(s => [String(s.assignmentId), s]));
    return (data.assignments || []).map(a => ({ assignment: a, submission: map.get(String(a._id)) }));
  }, [data]);

  const submittedCount    = rows.filter(r => r.submission).length;
  const gradedCount       = rows.filter(r => r.submission?.isGraded).length;
  const pendingGradeCount = rows.filter(r => r.submission && !r.submission.isGraded).length;

  if (loading) return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={S.loadWrap} className="portal-page">
        <div style={S.spinner} />
        <p style={{ fontSize: 14, color: T.t3, marginTop: 12, fontFamily: "'DM Sans',sans-serif" }}>
          Loading grades…
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke={T.amber} strokeWidth="2" strokeLinecap="round">
                <path d="M18 20V10 M12 20V4 M6 20v-6" />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: T.t1, letterSpacing: "-0.01em" }}>EduPortal</p>
              <p style={{ fontSize: 11, color: T.t3, marginTop: 1 }}>Winners' Foundation</p>
            </div>
          </div>

          <div style={S.divider} />

          <nav style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
            {NAV_ITEMS.map(n => (
              <a key={n.label} href={n.href} className={`nav-item${n.active ? " active" : ""}`}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d={n.icon} />
                </svg>
                <span>{n.label}</span>
              </a>
            ))}
          </nav>

          <div style={S.sideFooter}>
            <div style={S.avatarCircle}>S</div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: T.t1 }}>Student</p>
              <p style={{ fontSize: 11, color: T.t3, marginTop: 1 }}>Class 10B</p>
            </div>
          </div>
        </aside>
      </div>

      {/* ── Main ────────────────────────────────── */}
      <main className="portal-main" style={S.main}>

        {/* Header */}
        <header style={S.header}>
          <div>
            <p style={S.breadcrumb}>Student Portal · Grades</p>
            <h1 style={S.pageTitle}>
              My{" "}
              <em style={{ fontFamily: "'Instrument Serif',serif", fontStyle: "italic", color: T.amber }}>
                Grades
              </em>
            </h1>
            <p style={{ fontSize: 13, color: T.t3, marginTop: 6 }}>
              Track submitted work, teacher grades, and feedback.
            </p>
          </div>
          <a href="/student/assignments" style={S.actionBtn}>Open Assignments →</a>
        </header>

        {/* Stats */}
        <div style={S.statsRow}>
          {[
            { label: "Submitted",      value: submittedCount,    color: T.blue,  dim: T.blueDim  },
            { label: "Graded",         value: gradedCount,       color: T.green, dim: T.greenDim },
            { label: "Awaiting Grade", value: pendingGradeCount, color: T.amber, dim: T.amberDim },
          ].map(s => (
            <div key={s.label} style={{ ...S.statCard, borderColor: s.color + "33", background: s.dim }}>
              <span style={{ fontSize: 26, fontWeight: 800, color: s.color, fontFamily: "'JetBrains Mono',monospace", lineHeight: 1 }}>
                {s.value}
              </span>
              <span style={{ fontSize: 11, color: T.t3, fontWeight: 600, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Grade book */}
        <div style={S.tableCard}>
          {/* Card header */}
          <div style={S.tableCardHead}>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: T.t1 }}>Grade Book</p>
              <p style={{ fontSize: 12, color: T.t3, marginTop: 2 }}>{rows.length} assignment{rows.length !== 1 ? "s" : ""}</p>
            </div>
          </div>

          {/* Column headers */}
          {rows.length > 0 && (
            <div style={S.colHeaders}>
              <span>Assignment</span>
              <span className="col-subject">Subject</span>
              <span>Status</span>
              <span>Grade</span>
              <span className="col-feedback">Feedback</span>
            </div>
          )}

          {/* Rows */}
          {rows.length > 0 ? rows.map(({ assignment, submission }, i) => (
            <div key={assignment._id} className="grade-row" style={{ animationDelay: `${i * 0.05}s` }}>
              {/* Assignment */}
              <div style={S.cell}>
                <p style={{ fontSize: 14, fontWeight: 600, color: T.t1, marginBottom: 3 }}>{assignment.title}</p>
                <p style={{ fontSize: 12, color: T.t3 }}>
                  Due {new Date(assignment.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
              </div>
              {/* Subject */}
              <div style={S.cell} className="col-subject">
                <span style={{ fontSize: 13, color: T.t2 }}>{assignment.subject}</span>
              </div>
              {/* Status */}
              <div style={S.cell}>
                {submission
                  ? <Pill label="Submitted" color={T.green} bg={T.greenDim} />
                  : <Pill label="Not submitted" color={T.t3} bg="rgba(0,0,0,0.04)" />}
              </div>
              {/* Grade */}
              <div style={S.cell}>
                <span style={{
                  fontSize: 15, fontWeight: 800,
                  fontFamily: "'JetBrains Mono',monospace",
                  color: submission?.isGraded ? T.amber : T.t3,
                }}>
                  {submission?.isGraded ? submission.grade : "—"}
                </span>
              </div>
              {/* Feedback */}
              <div style={{ ...S.cell, paddingRight: 20 }} className="col-feedback">
                <p style={{ fontSize: 13, color: T.t2, lineHeight: 1.55 }}>
                  {submission?.feedback || <span style={{ color: T.t3, fontStyle: "italic" }}>No feedback yet</span>}
                </p>
              </div>
            </div>
          )) : (
            <div style={{ padding: "56px 20px", textAlign: "center" }}>
              <div style={{ ...S.emptyIcon }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={T.amber} strokeWidth="1.6" strokeLinecap="round">
                  <path d="M18 20V10 M12 20V4 M6 20v-6" />
                </svg>
              </div>
              <p style={{ fontSize: 16, fontWeight: 600, color: T.t1, marginBottom: 6 }}>No grades yet</p>
              <p style={{ fontSize: 13, color: T.t3 }}>Grades will appear here after teachers post and grade assignments.</p>
            </div>
          )}
        </div>
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

function Pill({ label, color, bg }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      fontSize: 11, fontWeight: 700, color,
      padding: "3px 9px", borderRadius: 20,
      background: bg, border: `1px solid ${color}33`,
    }}>{label}</span>
  );
}

/* ─── Styles ─────────────────────────────────────────────────── */
const S = {
  page:        { display: "flex", minHeight: "100vh", background: T.bg },
  sidebarWrap: { width: 252, flexShrink: 0, position: "sticky", top: 0, height: "100vh" },
  sidebar:     { height: "100%", display: "flex", flexDirection: "column", padding: "24px 14px", background: T.surface, borderRight: `1px solid ${T.border}` },
  brandRow:    { display: "flex", alignItems: "center", gap: 10, padding: "0 6px 20px" },
  logoMark:    { width: 36, height: 36, borderRadius: 10, background: T.amberDim, border: `1px solid ${T.amberGlow}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  divider:     { height: "0.5px", background: T.border, margin: "0 0 14px" },
  sideFooter:  { display: "flex", alignItems: "center", gap: 10, paddingTop: 16, borderTop: `1px solid ${T.border}`, marginTop: 16 },
  avatarCircle:{ width: 34, height: 34, borderRadius: "50%", background: T.amberDim, border: `1px solid ${T.amberGlow}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: T.amber, flexShrink: 0 },

  main:        { flex: 1, padding: "36px 40px", maxWidth: "calc(100vw - 252px)", overflowX: "hidden" },
  header:      { display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 28 },
  breadcrumb:  { fontSize: 11, fontWeight: 600, color: T.t3, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 5 },
  pageTitle:   { fontSize: 30, fontWeight: 700, color: T.t1, letterSpacing: "-0.025em", lineHeight: 1.1 },
  actionBtn:   { display: "inline-flex", alignItems: "center", padding: "10px 18px", borderRadius: 10, background: T.amber, color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none", flexShrink: 0 },

  statsRow:    { display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12, marginBottom: 24 },
  statCard:    { display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "16px 20px", borderRadius: 12, border: "1px solid" },

  tableCard:     { background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden" },
  tableCardHead: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", borderBottom: `1px solid ${T.border}` },
  colHeaders:    {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 110px 90px 2fr",
    padding: "10px 0",
    borderBottom: `1px solid ${T.border}`,
    background: T.bg,
  },
  cell:          { padding: "14px 16px", fontSize: 13 },
  emptyIcon:     { width: 56, height: 56, borderRadius: "50%", background: T.amberDim, border: `1px solid ${T.amberGlow}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" },

  loadWrap:    { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: T.bg },
  spinner:     { width: 30, height: 30, border: `2.5px solid ${T.amberDim}`, borderTopColor: T.amber, borderRadius: "50%", animation: "spin 0.7s linear infinite" },
};