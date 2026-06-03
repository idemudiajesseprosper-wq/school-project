"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const COLORS = {
  bg: "#0b0e1a",
  surface: "#111422",
  card: "#161a2c",
  border: "rgba(255,255,255,0.08)",
  text: "#f0f2ff",
  muted: "#9ba3c4",
  dim: "#555d80",
  amber: "#f5a623",
  green: "#3ecfa0",
  blue: "#4c8fe8",
};

export default function StudentGradesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ assignments: [], submissions: [] });

  useEffect(() => {
    loadGrades();
  }, []);

  async function loadGrades() {
    const res = await fetch("/api/student/assignments");
    const json = await res.json();
    if (!json.success) {
      router.push("/login/student");
      return;
    }
    setData(json);
    setLoading(false);
  }

  const rows = useMemo(() => {
    const submissionsByAssignment = new Map(
      (data.submissions || []).map((item) => [String(item.assignmentId), item])
    );

    return (data.assignments || []).map((assignment) => ({
      assignment,
      submission: submissionsByAssignment.get(String(assignment._id)),
    }));
  }, [data]);

  const gradedCount = rows.filter((row) => row.submission?.isGraded).length;
  const submittedCount = rows.filter((row) => row.submission).length;
  const pendingGradeCount = rows.filter(
    (row) => row.submission && !row.submission.isGraded
  ).length;

  if (loading) {
    return (
      <div style={S.loadWrap}>
        <div style={S.spinner} />
        <p style={S.loadingText}>Loading grades...</p>
        <style>{globalCss}</style>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <style>{globalCss}</style>

      <aside className="grade-sidebar" style={S.sidebar}>
        <div style={S.brand}>
          <div style={S.brandMark}>G</div>
          <div>
            <p style={S.brandTitle}>Grades</p>
            <p style={S.brandSub}>Student Portal</p>
          </div>
        </div>

        <nav style={S.nav}>
          <NavLink href="/student" label="Dashboard" />
          <NavLink href="/student/assignments" label="Assignments" />
          <NavLink href="/student/grades" label="Grades" active />
          <NavLink href="/student/schedule" label="Schedule" />
          <NavLink href="/student/notifications" label="Notifications" />
        </nav>
      </aside>

      <main style={S.main}>
        <header style={S.header}>
          <div>
            <p style={S.eyebrow}>Student Portal</p>
            <h1 style={S.title}>Assignment Grades</h1>
            <p style={S.subtitle}>Track submitted work, teacher grades, and feedback.</p>
          </div>
          <a href="/student/assignments" style={S.actionLink}>Open Assignments</a>
        </header>

        <section style={S.statsGrid}>
          <Stat label="Submitted" value={submittedCount} color={COLORS.blue} />
          <Stat label="Graded" value={gradedCount} color={COLORS.green} />
          <Stat label="Awaiting Grade" value={pendingGradeCount} color={COLORS.amber} />
        </section>

        <section style={S.card}>
          <div style={S.cardHead}>
            <h2 style={S.cardTitle}>Grade Book</h2>
            <span style={S.smallText}>{rows.length} assignment(s)</span>
          </div>

          <div style={S.tableWrap}>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Assignment</th>
                  <th style={S.th}>Subject</th>
                  <th style={S.th}>Submission</th>
                  <th style={S.th}>Grade</th>
                  <th style={S.th}>Feedback</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ assignment, submission }) => (
                  <tr key={assignment._id} style={S.tr}>
                    <td style={S.td}>
                      <p style={S.assignmentTitle}>{assignment.title}</p>
                      <p style={S.smallText}>
                        Due {new Date(assignment.deadline).toLocaleString()}
                      </p>
                    </td>
                    <td style={S.td}>{assignment.subject}</td>
                    <td style={S.td}>
                      <StatusBadge
                        color={submission ? COLORS.green : COLORS.dim}
                        label={submission ? "Submitted" : "Not submitted"}
                      />
                    </td>
                    <td style={S.td}>
                      <strong style={{ color: submission?.isGraded ? COLORS.amber : COLORS.dim }}>
                        {submission?.isGraded ? submission.grade : "Pending"}
                      </strong>
                    </td>
                    <td style={{ ...S.td, color: COLORS.muted }}>
                      {submission?.feedback || "No feedback yet."}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!rows.length && (
              <div style={S.empty}>
                <p style={S.emptyTitle}>No assignments yet</p>
                <p style={S.subtitle}>Grades will appear here after teachers post assignments.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function NavLink({ href, label, active }) {
  return (
    <a href={href} className={`grade-nav-link${active ? " active" : ""}`}>
      {label}
    </a>
  );
}

function Stat({ label, value, color }) {
  return (
    <div style={{ ...S.stat, borderColor: `${color}44` }}>
      <p style={{ ...S.statValue, color }}>{value}</p>
      <p style={S.statLabel}>{label}</p>
    </div>
  );
}

function StatusBadge({ color, label }) {
  return (
    <span style={{ ...S.badge, color, borderColor: `${color}44`, background: `${color}16` }}>
      {label}
    </span>
  );
}

const S = {
  page: {
    display: "flex",
    minHeight: "100vh",
    background: COLORS.bg,
    color: COLORS.text,
    fontFamily: "Inter, system-ui, sans-serif",
  },
  sidebar: {
    width: 244,
    minWidth: 244,
    height: "100vh",
    position: "sticky",
    top: 0,
    background: COLORS.surface,
    borderRight: `1px solid ${COLORS.border}`,
    padding: 20,
  },
  brand: { display: "flex", alignItems: "center", gap: 10, marginBottom: 28 },
  brandMark: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: "rgba(245,166,35,0.12)",
    border: "1px solid rgba(245,166,35,0.25)",
    color: COLORS.amber,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
  },
  brandTitle: { fontSize: 14, fontWeight: 800 },
  brandSub: { fontSize: 11, color: COLORS.dim, marginTop: 2 },
  nav: { display: "grid", gap: 5 },
  main: { flex: 1, padding: "34px 38px", minWidth: 0 },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
    flexWrap: "wrap",
    marginBottom: 22,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: 800,
    color: COLORS.amber,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    marginBottom: 6,
  },
  title: { fontSize: 30, fontWeight: 900, letterSpacing: "-0.03em" },
  subtitle: { color: COLORS.muted, fontSize: 14, marginTop: 5 },
  actionLink: {
    borderRadius: 9,
    background: COLORS.amber,
    color: COLORS.bg,
    padding: "10px 14px",
    textDecoration: "none",
    fontSize: 13,
    fontWeight: 900,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 12,
    marginBottom: 20,
  },
  stat: {
    background: COLORS.card,
    border: "1px solid",
    borderRadius: 12,
    padding: 16,
  },
  statValue: { fontSize: 28, fontWeight: 900 },
  statLabel: { color: COLORS.dim, fontSize: 12, fontWeight: 700, marginTop: 3 },
  card: {
    background: COLORS.card,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 14,
    overflow: "hidden",
  },
  cardHead: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    padding: "18px 20px",
    borderBottom: `1px solid ${COLORS.border}`,
  },
  cardTitle: { fontSize: 16, fontWeight: 900 },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", minWidth: 820, borderCollapse: "collapse" },
  th: {
    textAlign: "left",
    padding: "12px 16px",
    color: COLORS.dim,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    borderBottom: `1px solid ${COLORS.border}`,
  },
  tr: { borderBottom: `1px solid ${COLORS.border}` },
  td: { padding: "14px 16px", fontSize: 13, verticalAlign: "top" },
  assignmentTitle: { fontWeight: 800, marginBottom: 4 },
  smallText: { fontSize: 12, color: COLORS.dim },
  badge: {
    display: "inline-flex",
    border: "1px solid",
    borderRadius: 999,
    padding: "4px 9px",
    fontSize: 11,
    fontWeight: 800,
  },
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
    border: "3px solid rgba(255,255,255,0.12)",
    borderTopColor: COLORS.amber,
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
  loadingText: { color: COLORS.dim, marginTop: 12, fontSize: 14 },
};

const globalCss = `
  @keyframes spin { to { transform: rotate(360deg); } }
  body > header, body > nav, nav.site-nav, header.site-header { display: none !important; }
  .grade-nav-link {
    display: flex;
    border-radius: 9px;
    padding: 11px 12px;
    color: ${COLORS.dim};
    text-decoration: none;
    font-size: 13px;
    font-weight: 700;
  }
  .grade-nav-link:hover { background: rgba(255,255,255,0.04); color: ${COLORS.muted}; }
  .grade-nav-link.active {
    background: rgba(245,166,35,0.12);
    color: ${COLORS.amber};
    border: 1px solid rgba(245,166,35,0.25);
  }
  @media (max-width: 820px) {
    .grade-sidebar { display: none !important; }
    main { padding: 22px 16px 96px !important; }
  }
`;
