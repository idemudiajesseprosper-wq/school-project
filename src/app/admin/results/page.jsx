"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CLASSES = [
  "Nursery 1",
  "Nursery 2",
  "Primary 1",
  "Primary 2",
  "Primary 3",
  "Primary 4",
  "Primary 5",
  "Primary 6",
  "JSS1",
  "JSS2",
  "JSS3",
  "SS1",
  "SS2",
  "SS3",
];
const TERMS = ["First Term", "Second Term", "Third Term"];

function currentSession() {
  const year = new Date().getFullYear();
  return `${year}/${year + 1}`;
}

export default function AdminResultsPage() {
  const [form, setForm] = useState({
    academicSession: currentSession(),
    term: "First Term",
    className: "JSS1",
  });
  const [publications, setPublications] = useState([]);
  const [saving, setSaving] = useState(false);
  const [activeAction, setActiveAction] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await fetch("/api/admin/results/publications");
    const json = await res.json();
    if (json.success) setPublications(json.publications || []);
  }

  async function setPublished(isPublished) {
    setSaving(true);
    setActiveAction(isPublished ? "publish" : "unpublish");
    const res = await fetch("/api/admin/results/publications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, isPublished }),
    });
    const json = await res.json();
    setSaving(false);
    setActiveAction(null);
    if (!json.success) return toast.error(json.message || "Could not update publication");
    toast.success(json.message);
    load();
  }

  const publishedCount = publications.filter((p) => p.isPublished).length;
  const unpublishedCount = publications.filter((p) => !p.isPublished).length;

  return (
    <div style={styles.root}>
      {/* ── Header ── */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.headerLeft}>
            <div style={styles.badge}>Admin Portal</div>
            <h1 style={styles.heading}>Result Publication</h1>
            <p style={styles.subheading}>Control student result visibility by class, session and term</p>
          </div>
          <a href="/admin" style={styles.backBtn}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Dashboard
          </a>
        </div>

        {/* Stats row */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>{publications.length}</span>
            <span style={styles.statLabel}>Total Records</span>
          </div>
          <div style={{ ...styles.statCard, ...styles.statCardGreen }}>
            <span style={{ ...styles.statNumber, color: "#4ade80" }}>{publishedCount}</span>
            <span style={styles.statLabel}>Published</span>
          </div>
          <div style={{ ...styles.statCard, ...styles.statCardAmber }}>
            <span style={{ ...styles.statNumber, color: "#fbbf24" }}>{unpublishedCount}</span>
            <span style={styles.statLabel}>Unpublished</span>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        {/* ── Publish Panel ── */}
        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardIcon}>
              <svg width="18" height="18" fill="none" stroke="#f59e0b" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="M12 8v4l3 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h2 style={styles.cardTitle}>Publication Control</h2>
              <p style={styles.cardSubtitle}>Select criteria then publish or unpublish results</p>
            </div>
          </div>

          <div style={styles.formGrid}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Academic Session</label>
              <input
                style={styles.input}
                value={form.academicSession}
                onChange={(e) => setForm({ ...form, academicSession: e.target.value })}
                onFocus={(e) => { e.target.style.borderColor = "#f59e0b"; e.target.style.boxShadow = "0 0 0 3px rgba(245,158,11,0.15)"; }}
                onBlur={(e) => { e.target.style.borderColor = "#1e3a5f"; e.target.style.boxShadow = "none"; }}
              />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Term</label>
              <select
                style={styles.input}
                value={form.term}
                onChange={(e) => setForm({ ...form, term: e.target.value })}
                onFocus={(e) => { e.target.style.borderColor = "#f59e0b"; e.target.style.boxShadow = "0 0 0 3px rgba(245,158,11,0.15)"; }}
                onBlur={(e) => { e.target.style.borderColor = "#1e3a5f"; e.target.style.boxShadow = "none"; }}
              >
                {TERMS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Class</label>
              <select
                style={styles.input}
                value={form.className}
                onChange={(e) => setForm({ ...form, className: e.target.value })}
                onFocus={(e) => { e.target.style.borderColor = "#f59e0b"; e.target.style.boxShadow = "0 0 0 3px rgba(245,158,11,0.15)"; }}
                onBlur={(e) => { e.target.style.borderColor = "#1e3a5f"; e.target.style.boxShadow = "none"; }}
              >
                {CLASSES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Selection preview */}
          <div style={styles.preview}>
            <svg width="13" height="13" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
            </svg>
            <span style={styles.previewText}>
              {form.className} &nbsp;·&nbsp; {form.term} &nbsp;·&nbsp; {form.academicSession}
            </span>
          </div>

          <div style={styles.btnRow}>
            <button
              disabled={saving}
              style={{ ...styles.btn, ...styles.btnPublish, ...(saving && activeAction === "publish" ? styles.btnLoading : {}) }}
              onClick={() => setPublished(true)}
              onMouseEnter={(e) => { if (!saving) e.target.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.target.style.transform = "none"; }}
            >
              {saving && activeAction === "publish" ? (
                <><span style={styles.spinner} /> Publishing…</>
              ) : (
                <><PublishIcon /> Publish Results</>
              )}
            </button>
            <button
              disabled={saving}
              style={{ ...styles.btn, ...styles.btnUnpublish, ...(saving && activeAction === "unpublish" ? styles.btnLoading : {}) }}
              onClick={() => setPublished(false)}
              onMouseEnter={(e) => { if (!saving) e.target.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.target.style.transform = "none"; }}
            >
              {saving && activeAction === "unpublish" ? (
                <><span style={styles.spinner} /> Unpublishing…</>
              ) : (
                <><UnpublishIcon /> Unpublish Results</>
              )}
            </button>
          </div>
        </section>

        {/* ── Publication History ── */}
        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={{ ...styles.cardIcon, background: "rgba(99,102,241,0.12)" }}>
              <svg width="18" height="18" fill="none" stroke="#818cf8" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h2 style={styles.cardTitle}>Publication History</h2>
              <p style={styles.cardSubtitle}>{publications.length} record{publications.length !== 1 ? "s" : ""} found</p>
            </div>
          </div>

          {/* Desktop Table */}
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {["Class", "Session", "Term", "Status", "Last Updated"].map((h) => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {publications.map((item, i) => (
                  <tr
                    key={item._id}
                    style={{ ...styles.tr, animationDelay: `${i * 40}ms` }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <td style={styles.td}>
                      <span style={styles.classChip}>{item.className}</span>
                    </td>
                    <td style={{ ...styles.td, color: "#94a3b8" }}>{item.academicSession}</td>
                    <td style={{ ...styles.td, color: "#94a3b8" }}>{item.term}</td>
                    <td style={styles.td}>
                      <span style={item.isPublished ? styles.badgePublished : styles.badgeUnpublished}>
                        <span style={{ ...styles.dot, background: item.isPublished ? "#4ade80" : "#64748b" }} />
                        {item.isPublished ? "Published" : "Unpublished"}
                      </span>
                    </td>
                    <td style={{ ...styles.td, color: "#64748b", fontSize: 12 }}>
                      {new Date(item.updatedAt).toLocaleString("en-NG", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!publications.length && (
              <div style={styles.empty}>
                <div style={styles.emptyIcon}>
                  <svg width="28" height="28" fill="none" stroke="#334155" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" />
                  </svg>
                </div>
                <p style={styles.emptyTitle}>No records yet</p>
                <p style={styles.emptyText}>Publish or unpublish a result to see history here.</p>
              </div>
            )}
          </div>

          {/* Mobile Cards */}
          <div style={styles.mobileCards}>
            {publications.length === 0 && (
              <div style={styles.empty}>
                <div style={styles.emptyIcon}>
                  <svg width="28" height="28" fill="none" stroke="#334155" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" />
                  </svg>
                </div>
                <p style={styles.emptyTitle}>No records yet</p>
                <p style={styles.emptyText}>Publish or unpublish a result to see history here.</p>
              </div>
            )}
            {publications.map((item) => (
              <div key={item._id} style={styles.mobileCard}>
                <div style={styles.mobileCardTop}>
                  <span style={styles.classChip}>{item.className}</span>
                  <span style={item.isPublished ? styles.badgePublished : styles.badgeUnpublished}>
                    <span style={{ ...styles.dot, background: item.isPublished ? "#4ade80" : "#64748b" }} />
                    {item.isPublished ? "Published" : "Unpublished"}
                  </span>
                </div>
                <div style={styles.mobileCardBody}>
                  <span style={styles.mobileCardMeta}>{item.term}</span>
                  <span style={styles.mobileCardDivider}>·</span>
                  <span style={styles.mobileCardMeta}>{item.academicSession}</span>
                </div>
                <p style={styles.mobileCardDate}>
                  {new Date(item.updatedAt).toLocaleString("en-NG", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Sora:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          .res-table { display: none !important; }
          .res-mobile { display: flex !important; }
          .res-form-grid { grid-template-columns: 1fr !important; }
          .res-stats { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (min-width: 641px) {
          .res-table { display: block !important; }
          .res-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
}

function PublishIcon() {
  return (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UnpublishIcon() {
  return (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const base = {
  fontFamily: "'DM Sans', sans-serif",
  color: "#e2e8f0",
};

const styles = {
  root: {
    ...base,
    minHeight: "100vh",
    background: "#080f1e",
  },

  // ── Header ──
  header: {
    background: "linear-gradient(160deg, #0c1a2e 0%, #0a1628 100%)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    paddingBottom: 0,
  },
  headerInner: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    padding: "24px 20px 20px",
    maxWidth: 960,
    margin: "0 auto",
  },
  headerLeft: { flex: 1 },
  badge: {
    display: "inline-block",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#f59e0b",
    background: "rgba(245,158,11,0.1)",
    border: "1px solid rgba(245,158,11,0.2)",
    borderRadius: 20,
    padding: "3px 10px",
    marginBottom: 8,
  },
  heading: {
    fontFamily: "'Sora', sans-serif",
    fontSize: 24,
    fontWeight: 800,
    color: "#f8fafc",
    margin: "0 0 4px",
    lineHeight: 1.2,
  },
  subheading: {
    fontSize: 13,
    color: "#64748b",
    margin: 0,
  },
  backBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    fontWeight: 700,
    color: "#94a3b8",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 8,
    padding: "8px 14px",
    textDecoration: "none",
    whiteSpace: "nowrap",
    transition: "all 0.2s",
    flexShrink: 0,
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: 0,
    maxWidth: 960,
    margin: "0 auto",
    borderTop: "1px solid rgba(255,255,255,0.05)",
  },
  statCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "14px 12px",
    borderRight: "1px solid rgba(255,255,255,0.05)",
  },
  statCardGreen: {},
  statCardAmber: { borderRight: "none" },
  statNumber: {
    fontFamily: "'Sora', sans-serif",
    fontSize: 22,
    fontWeight: 800,
    color: "#e2e8f0",
    lineHeight: 1,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "#475569",
    marginTop: 3,
  },

  // ── Main ──
  main: {
    maxWidth: 960,
    margin: "0 auto",
    padding: "20px 16px 48px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  // ── Card ──
  card: {
    background: "linear-gradient(145deg, #0f1f38 0%, #0c1a2e 100%)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 16,
    padding: "20px",
    animation: "fadeUp 0.4s ease both",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: "rgba(245,158,11,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardTitle: {
    fontFamily: "'Sora', sans-serif",
    fontSize: 15,
    fontWeight: 700,
    color: "#f1f5f9",
    margin: "0 0 2px",
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#475569",
    margin: 0,
  },

  // ── Form ──
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 12,
    marginBottom: 14,
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    color: "#475569",
  },
  input: {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid #1e3a5f",
    borderRadius: 10,
    padding: "10px 12px",
    fontSize: 13,
    fontWeight: 500,
    color: "#e2e8f0",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    fontFamily: "'DM Sans', sans-serif",
    appearance: "none",
    WebkitAppearance: "none",
  },
  preview: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: 8,
    padding: "8px 12px",
    marginBottom: 16,
  },
  previewText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: 500,
  },
  btnRow: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  btn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "11px 20px",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 700,
    border: "none",
    cursor: "pointer",
    transition: "transform 0.15s, opacity 0.2s",
    fontFamily: "'DM Sans', sans-serif",
    flex: "1 1 auto",
    justifyContent: "center",
  },
  btnPublish: {
    background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
    color: "#fff",
    boxShadow: "0 4px 16px rgba(22,163,74,0.3)",
  },
  btnUnpublish: {
    background: "rgba(239,68,68,0.1)",
    color: "#f87171",
    border: "1px solid rgba(239,68,68,0.25)",
  },
  btnLoading: { opacity: 0.7 },
  spinner: {
    display: "inline-block",
    width: 13,
    height: 13,
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },

  // ── Table ──
  tableWrapper: {
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.06)",
    overflow: "hidden",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 13,
  },
  th: {
    background: "rgba(255,255,255,0.03)",
    padding: "10px 14px",
    textAlign: "left",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.09em",
    textTransform: "uppercase",
    color: "#475569",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  tr: {
    transition: "background 0.15s",
    animation: "fadeUp 0.3s ease both",
  },
  td: {
    padding: "12px 14px",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    color: "#cbd5e1",
    fontWeight: 500,
  },
  classChip: {
    display: "inline-block",
    background: "rgba(245,158,11,0.1)",
    color: "#f59e0b",
    border: "1px solid rgba(245,158,11,0.2)",
    borderRadius: 6,
    padding: "2px 10px",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.04em",
  },
  badgePublished: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    background: "rgba(74,222,128,0.08)",
    color: "#4ade80",
    border: "1px solid rgba(74,222,128,0.2)",
    borderRadius: 20,
    padding: "3px 10px",
    fontSize: 11,
    fontWeight: 700,
  },
  badgeUnpublished: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    background: "rgba(100,116,139,0.1)",
    color: "#64748b",
    border: "1px solid rgba(100,116,139,0.2)",
    borderRadius: 20,
    padding: "3px 10px",
    fontSize: 11,
    fontWeight: 700,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    display: "inline-block",
  },

  // ── Empty state ──
  empty: {
    padding: "40px 20px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: { fontSize: 14, fontWeight: 700, color: "#475569", margin: 0 },
  emptyText: { fontSize: 12, color: "#334155", margin: 0 },

  // ── Mobile cards ──
  mobileCards: {
    display: "none",
    flexDirection: "column",
    gap: 10,
  },
  mobileCard: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 12,
    padding: "14px",
    animation: "fadeUp 0.3s ease both",
  },
  mobileCardTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  mobileCardBody: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  mobileCardMeta: { fontSize: 13, color: "#94a3b8", fontWeight: 500 },
  mobileCardDivider: { color: "#334155", fontSize: 13 },
  mobileCardDate: { fontSize: 11, color: "#475569", margin: 0 },
};
