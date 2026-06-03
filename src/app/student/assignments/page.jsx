"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

/* ─── Design tokens ───────────────────────────────────────────────── */
const T = {
  bg:        "#F8F9FC",
  surface:   "#FFFFFF",
  card:      "#FFFFFF",
  cardHover: "#F5F6FA",
  border:    "rgba(0,0,0,0.08)",
  borderMid: "rgba(0,0,0,0.14)",

  amber:     "#F5A623",
  amberDim:  "rgba(245,166,35,0.12)",
  amberGlow: "rgba(245,166,35,0.25)",

  blue:      "#4C8FE8",
  blueDim:   "rgba(76,143,232,0.12)",

  green:     "#3ECFA0",
  greenDim:  "rgba(62,207,160,0.12)",

  red:       "#F05252",
  redDim:    "rgba(240,82,82,0.12)",

  t1:        "#0F1629",
  t2:        "#4A5378",
  t3:        "#8B93B0",
};

/* ─── Global CSS ─────────────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes spin   { to { transform: rotate(360deg); } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse  { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
  @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }

  html, body { background: ${T.bg}; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 4px; }

  .portal-page { font-family: 'DM Sans', sans-serif; color: ${T.t1}; }

  /* Sidebar nav links */
  .nav-item {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 14px; border-radius: 10px;
    font-size: 13.5px; font-weight: 500; color: ${T.t3};
    text-decoration: none; transition: all 0.18s ease; cursor: pointer;
    border: none; background: none; width: 100%;
  }
  .nav-item:hover { background: rgba(255,255,255,0.04); color: ${T.t2}; }
  .nav-item.active {
    background: ${T.amberDim};
    color: ${T.amber};
    border: 1px solid ${T.amberGlow};
  }
  .nav-item .nav-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: ${T.amber}; flex-shrink: 0;
    display: none;
  }
  .nav-item.active .nav-dot { display: block; }

  /* Cards */
  .assign-card {
    border-radius: 14px;
    border: 1px solid ${T.border};
    background: ${T.card};
    overflow: hidden;
    transition: border-color 0.2s, background 0.2s;
    animation: fadeUp 0.3s ease both;
  }
  .assign-card:hover { border-color: ${T.borderMid}; background: ${T.cardHover}; }

  .card-header {
    padding: 18px 20px 16px;
    cursor: pointer;
    user-select: none;
    display: grid; gap: 6px;
  }
  .card-header:hover { background: rgba(255,255,255,0.02); }

  .card-body {
    max-height: 0; overflow: hidden;
    transition: max-height 0.38s cubic-bezier(0.4,0,0.2,1);
  }
  .card-body.open { max-height: 900px; }

  /* Notice cards */
  .notice-card {
    border-radius: 12px;
    border: 1px solid ${T.border};
    background: ${T.card};
    padding: 16px 18px;
    display: flex; gap: 14px;
    transition: border-color 0.18s;
    animation: fadeUp 0.3s ease both;
  }
  .notice-card:hover { border-color: rgba(245,166,35,0.25); }

  /* Bottom nav (mobile) */
  .bottom-nav {
    display: none;
    position: fixed; bottom: 0; left: 0; right: 0;
    background: ${T.surface};
    border-top: 1px solid ${T.border};
    padding: 8px 0 env(safe-area-inset-bottom);
    z-index: 200;
    backdrop-filter: blur(12px);
  }
  .bottom-nav-inner {
    display: flex; justify-content: space-around; align-items: center;
  }
  .bnav-item {
    display: flex; flex-direction: column; align-items: center; gap: 3px;
    font-size: 10px; font-weight: 500; color: ${T.t3};
    text-decoration: none; padding: 6px 14px; border-radius: 10px;
    transition: color 0.18s; cursor: pointer;
    border: none; background: none;
  }
  .bnav-item.active { color: ${T.amber}; }
  .bnav-item svg { width: 22px; height: 22px; }

  /* Form inputs */
  .field-textarea {
    width: 100%; border: 1px solid ${T.border};
    border-radius: 10px; padding: 12px 14px;
    font-size: 14px; color: ${T.t1};
    font-family: 'DM Sans', sans-serif;
    background: #F8F9FC; resize: vertical;
    transition: border-color 0.15s, box-shadow 0.15s;
    line-height: 1.6;
  }
  .field-textarea:focus {
    outline: none;
    border-color: ${T.amber};
    box-shadow: 0 0 0 3px ${T.amberGlow};
  }
  .field-textarea::placeholder { color: ${T.t3}; }

  .file-drop {
    border: 1.5px dashed ${T.border};
    border-radius: 10px;
    padding: 14px 16px;
    background: #F8F9FC;
    cursor: pointer;
    transition: border-color 0.15s;
    display: flex; align-items: center; gap: 10px;
  }
  .file-drop:hover { border-color: ${T.amber}; }
  .file-drop input { flex: 1; font-size: 13px; color: ${T.t2}; background: none; border: none; cursor: pointer; }
  .file-drop input:focus { outline: none; }
  .file-drop input::file-selector-button {
    background: ${T.amberDim}; border: 1px solid ${T.amberGlow};
    color: ${T.amber}; border-radius: 6px;
    padding: 4px 10px; font-size: 12px; font-weight: 600;
    cursor: pointer; margin-right: 10px;
    font-family: 'DM Sans', sans-serif;
  }

  .submit-btn {
    display: inline-flex; align-items: center; gap: 8px;
    border: none; border-radius: 10px;
    padding: 12px 22px; font-size: 13px; font-weight: 600;
    color: #fff; cursor: pointer;
    transition: all 0.2s ease;
    font-family: 'DM Sans', sans-serif;
    letter-spacing: 0.01em;
  }
  .submit-btn:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); }
  .submit-btn:active:not(:disabled) { transform: translateY(0); }
  .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }

  /* Responsive */
  @media (max-width: 768px) {
    .sidebar-wrap { display: none !important; }
    .portal-main { padding: 20px 16px 90px !important; max-width: 100% !important; }
    .page-topbar { margin-bottom: 24px !important; }
    .stats-row { gap: 8px !important; }
    .stat-pill { padding: 8px 12px !important; min-width: 60px !important; }
    .stat-count { font-size: 18px !important; }
    .section-title-wrap { margin-bottom: 12px !important; }
    .page-title { font-size: 24px !important; }
    .bottom-nav { display: block; }
  }
`;

/* ─── Page ───────────────────────────────────────────────────────── */
export default function StudentAssignmentsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ assignments: [], submissions: [], notices: [] });
  const [drafts, setDrafts] = useState({});
  const [savingId, setSavingId] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [mobileTab, setMobileTab] = useState("assignments");

  const submissionsByAssignment = useMemo(
    () => Object.fromEntries((data.submissions || []).map((s) => [s.assignmentId, s])),
    [data.submissions]
  );

  useEffect(() => { load(); }, []);

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
    } catch (err) {
      toast.error(err.message || "Could not submit");
    } finally {
      setSavingId("");
    }
  }

  const pending = (data.assignments || []).filter(a => {
    const sub = submissionsByAssignment[a._id];
    return new Date(a.deadline) >= new Date() && !sub;
  });
  const submitted = (data.assignments || []).filter(a => submissionsByAssignment[a._id]);
  const overdue   = (data.assignments || []).filter(a => {
    return new Date(a.deadline) < new Date() && !submissionsByAssignment[a._id];
  });

  if (loading) return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={S.loadWrap} className="portal-page">
        <div style={S.loadSpinner} />
        <p style={{ fontSize: 14, color: T.t3, fontFamily: "'DM Sans', sans-serif", marginTop: 12 }}>
          Loading assignments…
        </p>
      </div>
    </>
  );

  return (
    <div style={S.page} className="portal-page">
      <style>{GLOBAL_CSS}</style>

      {/* ── Sidebar ───────────────────────────────── */}
      <div className="sidebar-wrap" style={S.sidebarWrap}>
        <aside style={S.sidebar}>
          {/* Logo */}
          <div style={S.logoRow}>
            <div style={S.logoMark}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 10h14M10 3l7 7-7 7" stroke={T.amber} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: T.t1, letterSpacing: "-0.01em" }}>EduPortal</p>
              <p style={{ fontSize: 11, color: T.t3, marginTop: 1 }}>Winners' Foundation</p>
            </div>
          </div>

          {/* Stats mini */}
          <div style={S.miniStats}>
            {[
              { v: pending.length,   l: "Pending",   c: T.amber },
              { v: submitted.length, l: "Done",       c: T.green },
              { v: overdue.length,   l: "Overdue",    c: T.red   },
            ].map(s => (
              <div key={s.l} style={{ ...S.miniStat, borderColor: s.c + "33" }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: s.c, fontFamily: "'JetBrains Mono', monospace" }}>{s.v}</span>
                <span style={{ fontSize: 10, color: T.t3, fontWeight: 500, marginTop: 1 }}>{s.l}</span>
              </div>
            ))}
          </div>

          <div style={S.divider} />

          {/* Nav */}
          <nav style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
            {NAV_ITEMS.map(n => (
              <a key={n.label} href={n.href} className={`nav-item${n.active ? " active" : ""}`}>
                <span className="nav-dot" />
                <span style={{ fontSize: 15 }}>{n.icon}</span>
                <span>{n.label}</span>
              </a>
            ))}
          </nav>

          {/* Footer */}
          <div style={S.sideFooter}>
            <div style={S.avatarCircle}>S</div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: T.t1 }}>Student</p>
              <p style={{ fontSize: 11, color: T.t3, marginTop: 1 }}>Class 10B</p>
            </div>
          </div>
        </aside>
      </div>

      {/* ── Main ─────────────────────────────────── */}
      <main className="portal-main" style={S.main}>

        {/* Top bar */}
        <header className="page-topbar" style={S.topbar}>
          <div>
            <p style={S.breadcrumb}>Student Portal · Assignments</p>
            <h1 className="page-title" style={S.pageTitle}>
              My <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", color: T.amber }}>Assignments</em>
            </h1>
          </div>
          <div className="stats-row" style={S.statsRow}>
            <StatPill label="Pending"   count={pending.length}   color={T.amber} />
            <StatPill label="Submitted" count={submitted.length} color={T.green} />
            <StatPill label="Overdue"   count={overdue.length}   color={T.red}   />
          </div>
        </header>

        {/* Notices */}
        {(data.notices || []).length > 0 && (
          <section style={S.section}>
            <SectionLabel icon="📢" title="Announcements" />
            <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
              {data.notices.map((n, i) => (
                <div key={n._id} className="notice-card" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.amber, marginTop: 6, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: T.t1 }}>{n.title}</p>
                    <p style={{ fontSize: 13, color: T.t2, marginTop: 5, lineHeight: 1.55 }}>{n.message}</p>
                    <p style={{ fontSize: 11, color: T.t3, marginTop: 6, fontStyle: "italic" }}>— {n.teacherName}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Assignment groups */}
        {[
          { label: "Pending",   list: pending,   accent: T.amber, icon: "⏳" },
          { label: "Overdue",   list: overdue,   accent: T.red,   icon: "⚠️" },
          { label: "Submitted", list: submitted, accent: T.green, icon: "✓"  },
        ].map(g => g.list.length > 0 && (
          <section key={g.label} style={S.section}>
            <SectionLabel icon={g.icon} title={g.label} accent={g.accent} />
            <div style={{ display: "grid", gap: 10 }}>
              {g.list.map((a, i) => (
                <AssignmentCard
                  key={a._id}
                  assignment={a}
                  submission={submissionsByAssignment[a._id]}
                  accent={g.accent}
                  draft={drafts[a._id] || ""}
                  onDraftChange={v => setDrafts({ ...drafts, [a._id]: v })}
                  onSubmit={e => submitAssignment(e, a._id)}
                  saving={savingId === a._id}
                  expanded={expandedId === a._id}
                  onToggle={() => setExpandedId(expandedId === a._id ? null : a._id)}
                  delay={i * 0.07}
                />
              ))}
            </div>
          </section>
        ))}

        {!data.assignments?.length && <EmptyState />}
      </main>

      {/* ── Mobile bottom nav ─────────────────────── */}
      <nav className="bottom-nav">
        <div className="bottom-nav-inner">
          {MOBILE_NAV.map(n => (
            <a key={n.label} href={n.href} className={`bnav-item${n.active ? " active" : ""}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={n.path} />
              </svg>
              {n.label}
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}

/* ─── Sub-components ───────────────────────────────────────────── */
function StatPill({ label, count, color }) {
  return (
    <div className="stat-pill" style={{ ...S.statPill, borderColor: color + "33", background: color + "11" }}>
      <span className="stat-count" style={{ fontSize: 22, fontWeight: 800, color, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{count}</span>
      <span style={{ fontSize: 11, color: T.t3, fontWeight: 500, marginTop: 2 }}>{label}</span>
    </div>
  );
}

function SectionLabel({ icon, title, accent = T.t2 }) {
  return (
    <div className="section-title-wrap" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      <span style={{ fontSize: 14 }}>{icon}</span>
      <span style={{ fontSize: 11, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "0.1em" }}>{title}</span>
      <div style={{ flex: 1, height: "0.5px", background: accent + "33" }} />
    </div>
  );
}

function AssignmentCard({ assignment, submission, accent, draft, onDraftChange, onSubmit, saving, expanded, onToggle, delay }) {
  const now       = new Date();
  const deadline  = new Date(assignment.deadline);
  const overdue   = deadline < now;
  const daysLeft  = Math.ceil((deadline - now) / 86_400_000);
  const deadlineStr = deadline.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  const statusColor = overdue ? T.red : daysLeft <= 2 ? "#F59E0B" : T.t3;
  const statusText  = overdue ? "Overdue" : daysLeft === 0 ? "Due today" : daysLeft === 1 ? "Due tomorrow" : `${daysLeft}d left`;

  return (
    <article className="assign-card" style={{ borderTop: `2px solid ${accent}44`, animationDelay: `${delay}s` }}>
      <div className="card-header" onClick={onToggle}>
        {/* Row 1: subject + deadline */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: accent }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: T.t3, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {assignment.subject}
            </span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: statusColor, fontFamily: "'JetBrains Mono', monospace" }}>
            {statusText}
          </span>
        </div>

        {/* Row 2: title + chevron */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: T.t1, lineHeight: 1.3, letterSpacing: "-0.01em" }}>
            {assignment.title}
          </h3>
          <span style={{
            color: T.t3, fontSize: 12, marginTop: 3, flexShrink: 0,
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.25s ease",
          }}>▾</span>
        </div>

        {/* Row 3: teacher + deadline */}
        <p style={{ fontSize: 12, color: T.t3 }}>
          by <span style={{ color: T.t2 }}>{assignment.teacherName}</span> · Due {deadlineStr}
        </p>

        {/* Row 4: pills */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 2 }}>
          {submission && (
            <span style={{ ...S.badge, background: T.greenDim, color: T.green, borderColor: T.green + "33" }}>
              ✓ Submitted
            </span>
          )}
          {submission?.isGraded && (
            <span style={{ ...S.badge, background: T.amberDim, color: T.amber, borderColor: T.amber + "33" }}>
              Grade: {submission.grade}
            </span>
          )}
          {overdue && !submission && (
            <span style={{ ...S.badge, background: T.redDim, color: T.red, borderColor: T.red + "33" }}>
              Missing
            </span>
          )}
        </div>
      </div>

      {/* Expanded body */}
      <div className={`card-body${expanded ? " open" : ""}`}>
        <div style={{ padding: "0 20px 22px", borderTop: `1px solid ${T.border}` }}>
          <p style={{ fontSize: 14, color: T.t2, lineHeight: 1.65, paddingTop: 16, marginBottom: 14 }}>
            {assignment.description}
          </p>

          {assignment.fileUrl && (
            <a href={assignment.fileUrl} target="_blank" rel="noopener noreferrer" style={S.fileLink}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21.44 11.05L12.25 20.24a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66L9.41 17.41A2 2 0 016.59 14.59L15.07 6" />
              </svg>
              Teacher's attachment
            </a>
          )}

          {submission && (
            <div style={S.submittedBox}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: T.green }}>Submission received</span>
                {submission.fileUrl && (
                  <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 12, fontWeight: 600, color: T.green, textDecoration: "none" }}>
                    View file →
                  </a>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={S.gradeLabel}>Grade</span>
                <span style={{
                  fontSize: 16, fontWeight: 800, color: submission.isGraded ? T.amber : T.t3,
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {submission.isGraded ? submission.grade : "Pending"}
                </span>
              </div>
              {submission.feedback && (
                <div style={{ marginTop: 10 }}>
                  <span style={S.gradeLabel}>Feedback</span>
                  <p style={{ fontSize: 13, color: T.t2, lineHeight: 1.55, marginTop: 5 }}>{submission.feedback}</p>
                </div>
              )}
            </div>
          )}

          {!overdue && (
            <form onSubmit={onSubmit} style={{ display: "grid", gap: 14, marginTop: 16 }}>
              <div style={{ display: "grid", gap: 6 }}>
                <label style={S.fieldLabel}>Answer / Notes</label>
                <textarea
                  rows={4}
                  value={draft}
                  onChange={e => onDraftChange(e.target.value)}
                  placeholder="Type your answer or notes here…"
                  className="field-textarea"
                />
              </div>
              <div style={{ display: "grid", gap: 6 }}>
                <label style={S.fieldLabel}>Attach File</label>
                <div className="file-drop">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.t3} strokeWidth="2" strokeLinecap="round">
                    <path d="M21.44 11.05L12.25 20.24a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66L9.41 17.41A2 2 0 016.59 14.59L15.07 6" />
                  </svg>
                  <input name="file" type="file" />
                </div>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="submit-btn"
                style={{ background: saving ? T.t3 : accent }}
              >
                {saving
                  ? <><Spinner /> Submitting…</>
                  : submission ? "Update Submission" : "Submit Assignment"}
              </button>
            </form>
          )}
        </div>
      </div>
    </article>
  );
}

function Spinner() {
  return (
    <span style={{
      width: 14, height: 14, border: "2px solid rgba(0,0,0,0.2)",
      borderTopColor: "rgba(0,0,0,0.7)", borderRadius: "50%",
      display: "inline-block", animation: "spin 0.6s linear infinite",
    }} />
  );
}

function EmptyState() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 20px", textAlign: "center" }}>
      <div style={{
        width: 72, height: 72, borderRadius: "50%",
        background: T.amberDim, border: `1px solid ${T.amberGlow}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 32, marginBottom: 20,
      }}>📭</div>
      <p style={{ fontSize: 18, fontWeight: 600, color: T.t1, marginBottom: 8 }}>No assignments yet</p>
      <p style={{ fontSize: 14, color: T.t3, maxWidth: 300, lineHeight: 1.6 }}>
        Your teacher hasn't posted any assignments for your class.
      </p>
    </div>
  );
}

/* ─── Nav data ────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { icon: "⊞",  label: "Dashboard",     href: "/student",               active: false },
  { icon: "📋", label: "Assignments",    href: "#",                       active: true  },
  { icon: "📊", label: "Grades",         href: "/student/grades",         active: false },
  { icon: "📅", label: "Schedule",       href: "/student/schedule",       active: false },
  { icon: "🔔", label: "Notifications",  href: "/student/notifications",  active: false },
];

const MOBILE_NAV = [
  { label: "Home",    href: "/student",              active: false, path: "m3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10" },
  { label: "Tasks",   href: "#",                      active: true,  path: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2 M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { label: "Grades",  href: "/student/grades",        active: false, path: "M18 20V10 M12 20V4 M6 20v-6" },
  { label: "Schedule",href: "/student/schedule",      active: false, path: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { label: "Alerts",  href: "/student/notifications", active: false, path: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
];

/* ─── Styles ─────────────────────────────────────────────────── */
const S = {
  page: {
    display: "flex", minHeight: "100vh",
    background: T.bg,
  },
  sidebarWrap: {
    width: 252, flexShrink: 0,
    position: "sticky", top: 0, height: "100vh",
  },
  sidebar: {
    height: "100%", display: "flex", flexDirection: "column",
    padding: "24px 14px",
    background: T.surface,
    borderRight: '1px solid rgba(0,0,0,0.08)',
  },
  logoRow: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "0 6px 22px",
  },
  logoMark: {
    width: 36, height: 36, borderRadius: 10,
    background: T.amberDim, border: `1px solid ${T.amberGlow}`,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  miniStats: {
    display: "flex", gap: 6, marginBottom: 18,
  },
  miniStat: {
    flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
    padding: "10px 6px", borderRadius: 10, border: "1px solid",
    background: "rgba(255,255,255,0.02)",
  },
  divider: { height: "0.5px", background: T.border, margin: "0 0 14px" },
  sideFooter: {
    display: "flex", alignItems: "center", gap: 10,
    paddingTop: 16, borderTop: `1px solid ${T.border}`, marginTop: 16,
  },
  avatarCircle: {
    width: 34, height: 34, borderRadius: "50%",
    background: T.amberDim, border: `1px solid ${T.amberGlow}`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 13, fontWeight: 700, color: T.amber, flexShrink: 0,
  },

  main: {
    flex: 1, padding: "36px 40px",
    maxWidth: "calc(100vw - 252px)", overflowX: "hidden",
  },
  topbar: {
    display: "flex", alignItems: "flex-end", justifyContent: "space-between",
    flexWrap: "wrap", gap: 16, marginBottom: 36,
  },
  breadcrumb: {
    fontSize: 11, fontWeight: 600, color: T.t3,
    textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 5,
  },
  pageTitle: {
    fontSize: 30, fontWeight: 700, color: T.t1,
    letterSpacing: "-0.025em", lineHeight: 1.1,
  },
  statsRow: { display: "flex", gap: 10, flexWrap: "wrap" },
  statPill: {
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: "10px 18px", borderRadius: 12, border: "1px solid",
    minWidth: 72,
  },

  section: { marginBottom: 32 },

  badge: {
    display: "inline-flex", alignItems: "center",
    fontSize: 11, fontWeight: 700,
    padding: "3px 8px", borderRadius: 6, border: "1px solid",
  },

  fileLink: {
    display: "inline-flex", alignItems: "center", gap: 7,
    fontSize: 12, fontWeight: 600, color: T.amber,
    padding: "7px 12px", background: T.amberDim,
    border: `1px solid ${T.amberGlow}`,
    borderRadius: 8, textDecoration: "none", marginBottom: 14,
    transition: "filter 0.15s",
  },

  submittedBox: {
    background: T.greenDim, border: `1px solid ${T.green}22`,
    borderRadius: 10, padding: "14px 16px", marginBottom: 12,
  },
  gradeLabel: {
    fontSize: 11, fontWeight: 700, color: T.t3,
    textTransform: "uppercase", letterSpacing: "0.07em",
  },

  fieldLabel: {
    fontSize: 11, fontWeight: 700, color: T.t3,
    textTransform: "uppercase", letterSpacing: "0.08em",
  },

  loadWrap: {
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", minHeight: "100vh",
    background: T.bg,
  },
  loadSpinner: {
    width: 32, height: 32,
    border: "2.5px solid rgba(245,166,35,0.15)",
    borderTopColor: T.amber,
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
};