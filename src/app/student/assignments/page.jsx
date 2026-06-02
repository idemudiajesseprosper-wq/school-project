"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function StudentAssignmentsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ assignments: [], submissions: [], notices: [] });
  const [drafts, setDrafts] = useState({});
  const [savingId, setSavingId] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const submissionsByAssignment = useMemo(() => {
    return Object.fromEntries((data.submissions || []).map((item) => [item.assignmentId, item]));
  }, [data.submissions]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await fetch("/api/student/assignments");
    const json = await res.json();
    if (!json.success) { router.push("/login/student"); return; }
    setData(json);
    setLoading(false);
  }

  async function uploadFile(file) {
    if (!file) return null;
    const form = new FormData();
    form.append("file", file);
    form.append("folder", "school-portal/submissions");
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || "Upload failed");
    return json;
  }

  async function submitAssignment(e, assignmentId) {
    e.preventDefault();
    setSavingId(assignmentId);
    try {
      const upload = await uploadFile(e.currentTarget.file.files[0]);
      const res = await fetch("/api/student/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentId,
          content: drafts[assignmentId] || "",
          fileUrl: upload?.url || "",
          fileName: upload?.originalName || "",
        }),
      });
      const json = await res.json();
      if (!json.success) return toast.error(json.message || "Could not submit");
      toast.success("Assignment submitted!");
      e.currentTarget.reset();
      setExpandedId(null);
      load();
    } catch (error) {
      toast.error(error.message || "Could not submit");
    } finally {
      setSavingId("");
    }
  }

  const pending = (data.assignments || []).filter(a => {
    const sub = submissionsByAssignment[a._id];
    const overdue = new Date(a.deadline) < new Date();
    return !overdue && !sub;
  });
  const submitted = (data.assignments || []).filter(a => submissionsByAssignment[a._id]);
  const overdue = (data.assignments || []).filter(a => {
    const sub = submissionsByAssignment[a._id];
    return new Date(a.deadline) < new Date() && !sub;
  });

  if (loading) return (
    <div style={styles.loadWrap}>
      <div style={styles.loadSpinner} />
      <p style={styles.loadText}>Loading your assignments…</p>
    </div>
  );

  return (
    <div style={styles.page}>
      <style>{css}</style>

      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarInner}>
          <div style={styles.logoMark}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="#3b5bdb"/>
              <path d="M7 14h14M14 7l7 7-7 7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={styles.logoText}>EduPortal</span>
          </div>
          <nav style={styles.sideNav}>
            {[
              { icon: "⊞", label: "Dashboard", href: "/student" },
              { icon: "📋", label: "Assignments", href: "#", active: true },
              { icon: "📊", label: "Grades", href: "/student/grades" },
              { icon: "📅", label: "Schedule", href: "/student/schedule" },
              { icon: "🔔", label: "Notifications", href: "/student/notifications" },
            ].map(nav => (
              <a key={nav.label} href={nav.href} className={`nav-link${nav.active ? " nav-active" : ""}`}>
                <span style={styles.navIcon}>{nav.icon}</span>
                <span>{nav.label}</span>
              </a>
            ))}
          </nav>
          <div style={styles.sideFooter}>
            <div style={styles.avatarCircle}>S</div>
            <div>
              <p style={styles.avatarName}>Student</p>
              <p style={styles.avatarRole}>Class 10B</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={styles.main}>
        {/* Top bar */}
        <header style={styles.topbar}>
          <div>
            <p style={styles.breadcrumb}>Student Portal / Assignments</p>
            <h1 style={styles.pageTitle}>My Assignments</h1>
          </div>
          <div style={styles.statsRow}>
            <StatPill label="Pending" count={pending.length} color="#3b5bdb" />
            <StatPill label="Submitted" count={submitted.length} color="#0ca678" />
            <StatPill label="Overdue" count={overdue.length} color="#f03e3e" />
          </div>
        </header>

        {/* Notices */}
        {(data.notices || []).length > 0 && (
          <section style={styles.section}>
            <SectionTitle icon="📢" title="Announcements" />
            <div style={styles.noticesGrid}>
              {data.notices.map(item => (
                <div key={item._id} className="notice-card">
                  <div style={styles.noticeDot} />
                  <div>
                    <p style={styles.noticeTitle}>{item.title}</p>
                    <p style={styles.noticeMsg}>{item.message}</p>
                    <p style={styles.noticeTeacher}>— {item.teacherName}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Assignments */}
        {[
          { label: "Pending", list: pending, accent: "#3b5bdb", icon: "🕐" },
          { label: "Overdue", list: overdue, accent: "#f03e3e", icon: "⚠️" },
          { label: "Submitted", list: submitted, accent: "#0ca678", icon: "✅" },
        ].map(group => group.list.length > 0 && (
          <section key={group.label} style={styles.section}>
            <SectionTitle icon={group.icon} title={group.label} accent={group.accent} />
            <div style={styles.assignmentsGrid}>
              {group.list.map(assignment => (
                <AssignmentCard
                  key={assignment._id}
                  assignment={assignment}
                  submission={submissionsByAssignment[assignment._id]}
                  accent={group.accent}
                  draft={drafts[assignment._id] || ""}
                  onDraftChange={(val) => setDrafts({ ...drafts, [assignment._id]: val })}
                  onSubmit={(e) => submitAssignment(e, assignment._id)}
                  saving={savingId === assignment._id}
                  expanded={expandedId === assignment._id}
                  onToggle={() => setExpandedId(expandedId === assignment._id ? null : assignment._id)}
                />
              ))}
            </div>
          </section>
        ))}

        {!data.assignments?.length && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📭</div>
            <p style={styles.emptyTitle}>No assignments yet</p>
            <p style={styles.emptyMsg}>Your teacher hasn't posted any assignments for your class.</p>
          </div>
        )}
      </main>
    </div>
  );
}

function StatPill({ label, count, color }) {
  return (
    <div style={{ ...styles.statPill, borderColor: color + "33", background: color + "11" }}>
      <span style={{ ...styles.statCount, color }}>{count}</span>
      <span style={styles.statLabel}>{label}</span>
    </div>
  );
}

function SectionTitle({ icon, title, accent = "#1e293b" }) {
  return (
    <div style={styles.sectionTitleWrap}>
      <span style={styles.sectionIcon}>{icon}</span>
      <h2 style={{ ...styles.sectionTitle, color: accent }}>{title}</h2>
      <div style={{ ...styles.sectionLine, background: accent + "33" }} />
    </div>
  );
}

function AssignmentCard({ assignment, submission, accent, draft, onDraftChange, onSubmit, saving, expanded, onToggle }) {
  const overdue = new Date(assignment.deadline) < new Date();
  const daysLeft = Math.ceil((new Date(assignment.deadline) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <article className="assign-card" style={{ borderLeftColor: accent }}>
      <div style={styles.cardHead} onClick={onToggle} className="card-head">
        <div style={styles.cardMeta}>
          <div style={styles.subjectBadge}>
            <span style={{ ...styles.subjectDot, background: accent }} />
            {assignment.subject}
          </div>
          <div style={{ ...styles.deadlineBadge, color: overdue ? "#f03e3e" : daysLeft <= 2 ? "#f59f00" : "#64748b" }}>
            {overdue
              ? "Overdue"
              : daysLeft === 0
              ? "Due today"
              : daysLeft === 1
              ? "Due tomorrow"
              : `${daysLeft}d left`}
          </div>
        </div>
        <div style={styles.cardTitleRow}>
          <h3 style={styles.cardTitle}>{assignment.title}</h3>
          <span style={{ ...styles.chevron, transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
        </div>
        <p style={styles.cardTeacher}>by {assignment.teacherName} · Due {new Date(assignment.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
      </div>

      <div className={`card-body${expanded ? " card-body--open" : ""}`}>
        <div style={styles.cardBodyInner}>
          <p style={styles.cardDesc}>{assignment.description}</p>

          {assignment.fileUrl && (
            <a href={assignment.fileUrl} target="_blank" style={styles.fileLink}>
              <span>📎</span> Open teacher file
            </a>
          )}

          {submission && (
            <div style={styles.submittedBox}>
              <div style={styles.submittedHeader}>
                <span style={styles.submittedBadge}>✓ Submitted</span>
                {submission.fileUrl && (
                  <a href={submission.fileUrl} target="_blank" style={styles.submittedFileLink}>View your file</a>
                )}
              </div>
              <div style={styles.gradeRow}>
                <div style={styles.gradeItem}>
                  <span style={styles.gradeLabel}>Grade</span>
                  <span style={{ ...styles.gradeValue, color: submission.isGraded ? "#0ca678" : "#94a3b8" }}>
                    {submission.isGraded ? submission.grade : "Pending"}
                  </span>
                </div>
                {submission.feedback && (
                  <div style={styles.feedbackBox}>
                    <span style={styles.gradeLabel}>Feedback</span>
                    <p style={styles.feedbackText}>{submission.feedback}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {!overdue && (
            <form onSubmit={onSubmit} style={styles.form}>
              <div style={styles.fieldGroup}>
                <label style={styles.fieldLabel}>Answer / Notes</label>
                <textarea
                  rows={4}
                  value={draft}
                  onChange={(e) => onDraftChange(e.target.value)}
                  placeholder="Type your answer or notes here…"
                  style={styles.textarea}
                  className="field-input"
                />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.fieldLabel}>Attach File</label>
                <div style={styles.fileInputWrap} className="file-input-wrap">
                  <input name="file" type="file" style={styles.fileInput} />
                </div>
              </div>
              <button
                type="submit"
                disabled={saving}
                style={{ ...styles.submitBtn, background: saving ? "#94a3b8" : accent }}
                className="submit-btn"
              >
                {saving ? "Submitting…" : submission ? "Update Submission" : "Submit Assignment"}
              </button>
            </form>
          )}
        </div>
      </div>
    </article>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Sora', sans-serif; }

  .nav-link {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px; border-radius: 10px;
    font-size: 13.5px; font-weight: 500; color: #94a3b8;
    text-decoration: none; transition: all 0.18s ease;
  }
  .nav-link:hover { background: rgba(255,255,255,0.06); color: #e2e8f0; }
  .nav-active { background: rgba(59,91,219,0.25) !important; color: #a5b4fc !important; font-weight: 600; }

  .notice-card {
    display: flex; gap: 14px; align-items: flex-start;
    background: #fff; border: 1px solid #f1f5f9;
    border-radius: 12px; padding: 16px 18px;
    transition: box-shadow 0.18s; cursor: default;
  }
  .notice-card:hover { box-shadow: 0 4px 20px rgba(59,91,219,0.08); }

  .assign-card {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-left: 4px solid;
    border-radius: 14px;
    overflow: hidden;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .assign-card:hover { box-shadow: 0 6px 28px rgba(0,0,0,0.08); transform: translateY(-1px); }

  .card-head { padding: 18px 20px 16px; cursor: pointer; user-select: none; }
  .card-head:hover { background: #fafbfc; }

  .card-body { max-height: 0; overflow: hidden; transition: max-height 0.35s cubic-bezier(0.4,0,0.2,1); }
  .card-body--open { max-height: 800px; }

  .field-input:focus { outline: none; border-color: #3b5bdb !important; box-shadow: 0 0 0 3px rgba(59,91,219,0.12); }
  .file-input-wrap { position: relative; }

  .submit-btn:hover:not(:disabled) { filter: brightness(1.08); transform: translateY(-1px); }
  .submit-btn:active:not(:disabled) { transform: translateY(0); }

  @media (max-width: 768px) {
    .portal-sidebar { display: none !important; }
    .portal-main { padding: 16px !important; }
    .portal-topbar { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
    .portal-stats { width: 100%; justify-content: flex-start !important; flex-wrap: wrap; }
  }
`;

const styles = {
  page: {
    display: "flex", minHeight: "100vh",
    background: "#f8fafc", fontFamily: "'Sora', sans-serif",
  },
  sidebar: {
    className: "portal-sidebar",
    width: 240, minHeight: "100vh", flexShrink: 0,
    background: "#0f172a",
    position: "sticky", top: 0, height: "100vh",
    display: "flex", flexDirection: "column",
  },
  sidebarInner: {
    display: "flex", flexDirection: "column",
    height: "100%", padding: "24px 16px",
  },
  logoMark: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "0 8px 28px",
  },
  logoText: {
    fontSize: 16, fontWeight: 700, color: "#f1f5f9",
    letterSpacing: "-0.02em",
  },
  sideNav: { display: "flex", flexDirection: "column", gap: 2, flex: 1 },
  navIcon: { fontSize: 16, width: 22, textAlign: "center" },
  sideFooter: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "16px 8px 0", borderTop: "1px solid rgba(255,255,255,0.07)",
    marginTop: 16,
  },
  avatarCircle: {
    width: 36, height: 36, borderRadius: "50%",
    background: "#3b5bdb", display: "flex",
    alignItems: "center", justifyContent: "center",
    fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0,
  },
  avatarName: { fontSize: 13, fontWeight: 600, color: "#e2e8f0" },
  avatarRole: { fontSize: 11, color: "#64748b", marginTop: 1 },

  main: {
    className: "portal-main",
    flex: 1, padding: "32px 36px",
    maxWidth: "calc(100vw - 240px)", overflowX: "hidden",
  },
  topbar: {
    className: "portal-topbar",
    display: "flex", alignItems: "flex-end",
    justifyContent: "space-between", flexWrap: "wrap", gap: 16,
    marginBottom: 32,
  },
  breadcrumb: {
    fontSize: 11, fontWeight: 600, color: "#94a3b8",
    textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4,
  },
  pageTitle: {
    fontSize: 28, fontWeight: 800, color: "#0f172a",
    letterSpacing: "-0.03em", lineHeight: 1.1,
  },
  statsRow: {
    className: "portal-stats",
    display: "flex", gap: 10,
  },
  statPill: {
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: "8px 16px", borderRadius: 10, border: "1px solid",
    minWidth: 72,
  },
  statCount: { fontSize: 20, fontWeight: 800, lineHeight: 1 },
  statLabel: { fontSize: 11, color: "#64748b", fontWeight: 500, marginTop: 2 },

  section: { marginBottom: 32 },
  sectionTitleWrap: {
    display: "flex", alignItems: "center", gap: 8, marginBottom: 14,
  },
  sectionIcon: { fontSize: 16 },
  sectionTitle: { fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" },
  sectionLine: { flex: 1, height: 1, borderRadius: 2 },

  noticesGrid: { display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" },
  noticeDot: { width: 8, height: 8, borderRadius: "50%", background: "#3b5bdb", marginTop: 6, flexShrink: 0 },
  noticeTitle: { fontSize: 14, fontWeight: 700, color: "#1e293b" },
  noticeMsg: { fontSize: 13, color: "#475569", marginTop: 4, lineHeight: 1.55 },
  noticeTeacher: { fontSize: 11, color: "#94a3b8", marginTop: 6, fontStyle: "italic" },

  assignmentsGrid: { display: "grid", gap: 12 },

  cardHead: {},
  cardMeta: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  subjectBadge: {
    display: "flex", alignItems: "center", gap: 6,
    fontSize: 11, fontWeight: 600, color: "#475569",
    textTransform: "uppercase", letterSpacing: "0.06em",
  },
  subjectDot: { width: 6, height: 6, borderRadius: "50%" },
  deadlineBadge: { fontSize: 12, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" },
  cardTitleRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 },
  cardTitle: { fontSize: 16, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.01em", lineHeight: 1.3 },
  chevron: { fontSize: 18, color: "#94a3b8", transition: "transform 0.25s ease", flexShrink: 0 },
  cardTeacher: { fontSize: 12, color: "#94a3b8", marginTop: 5 },

  cardBodyInner: { padding: "0 20px 20px" },
  cardDesc: { fontSize: 14, color: "#475569", lineHeight: 1.6, marginBottom: 14 },

  fileLink: {
    display: "inline-flex", alignItems: "center", gap: 6,
    fontSize: 13, fontWeight: 600, color: "#3b5bdb",
    padding: "6px 12px", background: "#eff2ff",
    borderRadius: 8, textDecoration: "none", marginBottom: 14,
  },

  submittedBox: {
    background: "#f0fdf4", border: "1px solid #bbf7d0",
    borderRadius: 10, padding: "14px 16px", marginBottom: 14,
  },
  submittedHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  submittedBadge: {
    fontSize: 12, fontWeight: 700, color: "#0ca678",
    background: "#d1fae5", padding: "4px 10px", borderRadius: 6,
  },
  submittedFileLink: { fontSize: 12, fontWeight: 600, color: "#0ca678", textDecoration: "none" },
  gradeRow: { display: "flex", flexDirection: "column", gap: 6 },
  gradeItem: { display: "flex", alignItems: "center", gap: 8 },
  gradeLabel: { fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", minWidth: 60 },
  gradeValue: { fontSize: 15, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" },
  feedbackBox: { display: "flex", flexDirection: "column", gap: 2 },
  feedbackText: { fontSize: 13, color: "#334155", lineHeight: 1.5 },

  form: { display: "grid", gap: 14, paddingTop: 4 },
  fieldGroup: { display: "grid", gap: 6 },
  fieldLabel: { fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" },
  textarea: {
    width: "100%", border: "1px solid #e2e8f0", borderRadius: 10,
    padding: "10px 14px", fontSize: 14, color: "#1e293b",
    fontFamily: "'Sora', sans-serif", resize: "vertical",
    background: "#f8fafc", transition: "border-color 0.15s, box-shadow 0.15s",
  },
  fileInputWrap: {
    border: "1.5px dashed #cbd5e1", borderRadius: 10,
    padding: "12px 14px", background: "#f8fafc",
    cursor: "pointer",
  },
  fileInput: { width: "100%", fontSize: 13, color: "#475569", cursor: "pointer" },
  submitBtn: {
    width: "fit-content", border: "none", borderRadius: 10,
    padding: "11px 22px", fontSize: 13, fontWeight: 700,
    color: "#fff", cursor: "pointer",
    transition: "all 0.18s ease", letterSpacing: "0.01em",
  },

  emptyState: {
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: "60px 20px", textAlign: "center",
  },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: 700, color: "#1e293b", marginBottom: 6 },
  emptyMsg: { fontSize: 14, color: "#94a3b8", maxWidth: 340 },

  loadWrap: {
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", minHeight: "100vh", gap: 14,
    fontFamily: "'Sora', sans-serif",
  },
  loadSpinner: {
    width: 36, height: 36, border: "3px solid #e2e8f0",
    borderTopColor: "#3b5bdb", borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
  loadText: { fontSize: 14, color: "#64748b", fontWeight: 500 },
};
