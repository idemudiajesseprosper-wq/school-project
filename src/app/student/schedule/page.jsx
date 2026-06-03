"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const COLORS = {
  bg: "#f8fafc",
  card: "#ffffff",
  border: "#e2e8f0",
  text: "#0f172a",
  muted: "#64748b",
  blue: "#2563eb",
  green: "#16a34a",
  amber: "#d97706",
};

export default function StudentSchedulePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [timetable, setTimetable] = useState(null);
  const [activeDay, setActiveDay] = useState(() => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    return DAYS.includes(today) ? today : "Monday";
  });

  useEffect(() => {
    loadSchedule();
  }, []);

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
    const day = timetable?.days?.find((item) => item.day === activeDay);
    return day?.periods || [];
  }, [timetable, activeDay]);

  if (loading) {
    return (
      <div style={S.loadWrap}>
        <div style={S.spinner} />
        <p style={S.loadingText}>Loading schedule...</p>
        <style>{globalCss}</style>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <style>{globalCss}</style>

      <header style={S.topbar}>
        <div>
          <p style={S.eyebrow}>Student Portal</p>
          <h1 style={S.title}>Class Schedule</h1>
          <p style={S.subtitle}>
            {timetable?.class ? `${timetable.class} weekly timetable` : "No timetable has been published for your class yet."}
          </p>
        </div>
        <div style={S.actions}>
          <a href="/student/assignments" style={S.secondaryBtn}>Assignments</a>
          <a href="/student/timetable" style={S.primaryBtn}>Full Timetable</a>
        </div>
      </header>

      <main style={S.main}>
        <section style={S.dayTabs}>
          {DAYS.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => setActiveDay(day)}
              style={{
                ...S.dayTab,
                ...(activeDay === day ? S.dayTabActive : {}),
              }}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </section>

        <section style={S.card}>
          <div style={S.cardHead}>
            <h2 style={S.cardTitle}>{activeDay}</h2>
            <span style={S.smallText}>{activePeriods.length} period(s)</span>
          </div>

          {activePeriods.length ? (
            <div style={S.periodGrid}>
              {activePeriods.map((period, index) => (
                <article key={`${activeDay}-${index}`} style={S.periodCard}>
                  <div style={S.periodTop}>
                    <span style={S.periodNo}>Period {period.periodNumber || index + 1}</span>
                    <span style={period.type === "subject" ? S.typeSubject : S.typeOther}>
                      {period.type || "subject"}
                    </span>
                  </div>
                  <h3 style={S.subject}>
                    {period.type === "subject" ? period.subject || "Subject" : period.type}
                  </h3>
                  <p style={S.meta}>
                    {period.startTime || "--:--"} - {period.endTime || "--:--"}
                  </p>
                  {period.teacherName && <p style={S.teacher}>{period.teacherName}</p>}
                </article>
              ))}
            </div>
          ) : (
            <div style={S.empty}>
              <p style={S.emptyTitle}>No periods scheduled</p>
              <p style={S.subtitle}>Check back after your class teacher updates the timetable.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

const S = {
  page: {
    minHeight: "100vh",
    background: COLORS.bg,
    color: COLORS.text,
    fontFamily: "Inter, system-ui, sans-serif",
  },
  topbar: {
    background: COLORS.card,
    borderBottom: `1px solid ${COLORS.border}`,
    padding: "26px 32px",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
    flexWrap: "wrap",
  },
  eyebrow: {
    color: COLORS.blue,
    fontSize: 11,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    marginBottom: 5,
  },
  title: { fontSize: 30, fontWeight: 900, letterSpacing: "-0.03em" },
  subtitle: { color: COLORS.muted, fontSize: 14, marginTop: 5 },
  actions: { display: "flex", gap: 8, flexWrap: "wrap" },
  primaryBtn: {
    background: COLORS.blue,
    color: "white",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 13,
    fontWeight: 900,
    textDecoration: "none",
  },
  secondaryBtn: {
    background: "#eff6ff",
    color: COLORS.blue,
    border: "1px solid #bfdbfe",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 13,
    fontWeight: 900,
    textDecoration: "none",
  },
  main: { padding: "24px 32px 80px", display: "grid", gap: 18 },
  dayTabs: {
    display: "flex",
    gap: 8,
    overflowX: "auto",
  },
  dayTab: {
    border: `1px solid ${COLORS.border}`,
    background: COLORS.card,
    color: COLORS.muted,
    borderRadius: 8,
    padding: "9px 15px",
    fontWeight: 900,
    cursor: "pointer",
  },
  dayTabActive: {
    background: COLORS.blue,
    borderColor: COLORS.blue,
    color: "white",
  },
  card: {
    background: COLORS.card,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 12,
    overflow: "hidden",
  },
  cardHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "16px 18px",
    borderBottom: `1px solid ${COLORS.border}`,
  },
  cardTitle: { fontSize: 17, fontWeight: 900 },
  smallText: { color: COLORS.muted, fontSize: 12, fontWeight: 700 },
  periodGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: 12,
    padding: 16,
  },
  periodCard: {
    border: `1px solid ${COLORS.border}`,
    borderRadius: 10,
    padding: 14,
    background: "#f8fafc",
  },
  periodTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 10,
  },
  periodNo: { color: COLORS.muted, fontSize: 12, fontWeight: 900 },
  typeSubject: {
    color: COLORS.green,
    background: "#dcfce7",
    borderRadius: 999,
    padding: "3px 8px",
    fontSize: 11,
    fontWeight: 900,
    textTransform: "capitalize",
  },
  typeOther: {
    color: COLORS.amber,
    background: "#fef3c7",
    borderRadius: 999,
    padding: "3px 8px",
    fontSize: 11,
    fontWeight: 900,
    textTransform: "capitalize",
  },
  subject: { fontSize: 16, fontWeight: 900, marginBottom: 6, textTransform: "capitalize" },
  meta: { color: COLORS.text, fontSize: 13, fontWeight: 800 },
  teacher: { color: COLORS.muted, fontSize: 12, marginTop: 5 },
  empty: { padding: 42, textAlign: "center" },
  emptyTitle: { fontWeight: 900, marginBottom: 5 },
  loadWrap: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: COLORS.bg,
  },
  spinner: {
    width: 34,
    height: 34,
    border: "3px solid #e2e8f0",
    borderTopColor: COLORS.blue,
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
  loadingText: { color: COLORS.muted, marginTop: 12, fontSize: 14 },
};

const globalCss = `
  @keyframes spin { to { transform: rotate(360deg); } }
  body > header, body > nav, nav.site-nav, header.site-header { display: none !important; }
  @media (max-width: 760px) {
    header { padding: 22px 16px !important; }
    main { padding: 18px 16px 94px !important; }
  }
`;
