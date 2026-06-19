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
  }, [load]);

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
    if (!json.success)
      return toast.error(json.message || "Could not update publication");
    toast.success(json.message);
    load();
  }

  const publishedCount = publications.filter((p) => p.isPublished).length;
  const unpublishedCount = publications.filter((p) => !p.isPublished).length;

  return (
    <div style={s.root}>
      {/* Header */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <div style={s.headerLeft}>
            <div style={s.badge}>Admin Portal</div>
            <h1 style={s.heading}>Result Publication</h1>
            <p style={s.subheading}>
              Control student result visibility by class, session and term
            </p>
          </div>
          <a href="/admin" style={s.backBtn}>
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                d="M19 12H5M12 5l-7 7 7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Dashboard
          </a>
        </div>

        {/* Stats row */}
        <div style={s.statsRow}>
          <div style={s.statCard}>
            <span style={s.statNumber}>{publications.length}</span>
            <span style={s.statLabel}>Total Records</span>
          </div>
          <div style={s.statCard}>
            <span style={{ ...s.statNumber, color: "#16a34a" }}>
              {publishedCount}
            </span>
            <span style={s.statLabel}>Published</span>
          </div>
          <div style={{ ...s.statCard, borderRight: "none" }}>
            <span style={{ ...s.statNumber, color: "#d97706" }}>
              {unpublishedCount}
            </span>
            <span style={s.statLabel}>Unpublished</span>
          </div>
        </div>
      </header>

      <main style={s.main}>
        {/* Publication Control */}
        <section style={s.card}>
          <div style={s.cardHeader}>
            <div style={s.cardIcon}>
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="#d97706"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path
                  d="M12 8v4l3 3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <h2 style={s.cardTitle}>Publication Control</h2>
              <p style={s.cardSubtitle}>
                Select criteria then publish or unpublish results
              </p>
            </div>
          </div>

          <div style={s.formGrid}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Academic Session</label>
              <input
                style={s.input}
                value={form.academicSession}
                onChange={(e) =>
                  setForm({ ...form, academicSession: e.target.value })
                }
                onFocus={(e) => {
                  e.target.style.borderColor = "#f59e0b";
                  e.target.style.boxShadow = "0 0 0 3px rgba(245,158,11,0.12)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Term</label>
              <select
                style={s.input}
                value={form.term}
                onChange={(e) => setForm({ ...form, term: e.target.value })}
                onFocus={(e) => {
                  e.target.style.borderColor = "#f59e0b";
                  e.target.style.boxShadow = "0 0 0 3px rgba(245,158,11,0.12)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              >
                {TERMS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Class</label>
              <select
                style={s.input}
                value={form.className}
                onChange={(e) =>
                  setForm({ ...form, className: e.target.value })
                }
                onFocus={(e) => {
                  e.target.style.borderColor = "#f59e0b";
                  e.target.style.boxShadow = "0 0 0 3px rgba(245,158,11,0.12)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              >
                {CLASSES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={s.preview}>
            <svg
              width="13"
              height="13"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
            </svg>
            <span style={s.previewText}>
              {form.className} &nbsp;·&nbsp; {form.term} &nbsp;·&nbsp;{" "}
              {form.academicSession}
            </span>
          </div>

          <div style={s.btnRow}>
            <button
              disabled={saving}
              style={{ ...s.btn, ...s.btnPublish }}
              onClick={() => setPublished(true)}
              onMouseEnter={(e) => {
                if (!saving)
                  e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
              }}
            >
              {saving && activeAction === "publish" ? (
                <>
                  <span style={s.spinnerWhite} /> Publishing…
                </>
              ) : (
                <>
                  <CheckIcon /> Publish Results
                </>
              )}
            </button>
            <button
              disabled={saving}
              style={{ ...s.btn, ...s.btnUnpublish }}
              onClick={() => setPublished(false)}
              onMouseEnter={(e) => {
                if (!saving)
                  e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
              }}
            >
              {saving && activeAction === "unpublish" ? (
                <>
                  <span style={s.spinnerRed} /> Unpublishing…
                </>
              ) : (
                <>
                  <XIcon /> Unpublish Results
                </>
              )}
            </button>
          </div>
        </section>

        {/* History */}
        <section style={s.card}>
          <div style={s.cardHeader}>
            <div style={{ ...s.cardIcon, background: "#ede9fe" }}>
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="#7c3aed"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <h2 style={s.cardTitle}>Publication History</h2>
              <p style={s.cardSubtitle}>
                {publications.length} record
                {publications.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>

          {/* Desktop table */}
          <div className="res-table" style={s.tableWrapper}>
            <table style={s.table}>
              <thead>
                <tr>
                  {["Class", "Session", "Term", "Status", "Last Updated"].map(
                    (h) => (
                      <th key={h} style={s.th}>
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {publications.map((item, i) => (
                  <tr
                    key={item._id}
                    style={{ ...s.tr, animationDelay: `${i * 40}ms` }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#f8fafc";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <td style={s.td}>
                      <span style={s.classChip}>{item.className}</span>
                    </td>
                    <td style={{ ...s.td, color: "#475569" }}>
                      {item.academicSession}
                    </td>
                    <td style={{ ...s.td, color: "#475569" }}>{item.term}</td>
                    <td style={s.td}>
                      <span
                        style={
                          item.isPublished
                            ? s.badgePublished
                            : s.badgeUnpublished
                        }
                      >
                        <span
                          style={{
                            ...s.dot,
                            background: item.isPublished
                              ? "#16a34a"
                              : "#94a3b8",
                          }}
                        />
                        {item.isPublished ? "Published" : "Unpublished"}
                      </span>
                    </td>
                    <td style={{ ...s.td, color: "#94a3b8", fontSize: 12 }}>
                      {new Date(item.updatedAt).toLocaleString("en-NG", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!publications.length && <EmptyState />}
          </div>

          {/* Mobile cards */}
          <div className="res-mobile" style={s.mobileCards}>
            {!publications.length && <EmptyState />}
            {publications.map((item) => (
              <div key={item._id} style={s.mobileCard}>
                <div style={s.mobileCardTop}>
                  <span style={s.classChip}>{item.className}</span>
                  <span
                    style={
                      item.isPublished ? s.badgePublished : s.badgeUnpublished
                    }
                  >
                    <span
                      style={{
                        ...s.dot,
                        background: item.isPublished ? "#16a34a" : "#94a3b8",
                      }}
                    />
                    {item.isPublished ? "Published" : "Unpublished"}
                  </span>
                </div>
                <div style={s.mobileCardBody}>
                  <span style={s.mobileCardMeta}>{item.term}</span>
                  <span style={{ color: "#cbd5e1" }}>·</span>
                  <span style={s.mobileCardMeta}>{item.academicSession}</span>
                </div>
                <p style={s.mobileCardDate}>
                  {new Date(item.updatedAt).toLocaleString("en-NG", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Sora:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          .res-table { display: none !important; }
          .res-mobile { display: flex !important; }
        }
        @media (min-width: 641px) {
          .res-table { display: block !important; }
          .res-mobile { display: none !important; }
        }
        button:disabled { opacity: 0.65; cursor: not-allowed; }
      `}</style>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        padding: "40px 20px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: "#f1f5f9",
          border: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 4,
        }}
      >
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <p style={{ fontSize: 14, fontWeight: 700, color: "#94a3b8", margin: 0 }}>
        No records yet
      </p>
      <p style={{ fontSize: 12, color: "#cbd5e1", margin: 0 }}>
        Publish or unpublish a result to see history here.
      </p>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      viewBox="0 0 24 24"
      style={{ flexShrink: 0 }}
    >
      <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      viewBox="0 0 24 24"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M18 6L6 18M6 6l12 12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const s = {
  root: {
    fontFamily: "'DM Sans', sans-serif",
    minHeight: "100vh",
    background: "#f1f5f9",
    color: "#0f172a",
  },

  // Header
  header: {
    background: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
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
    color: "#d97706",
    background: "#fef3c7",
    border: "1px solid #fde68a",
    borderRadius: 20,
    padding: "3px 10px",
    marginBottom: 8,
  },
  heading: {
    fontFamily: "'Sora', sans-serif",
    fontSize: 24,
    fontWeight: 800,
    color: "#0f172a",
    margin: "0 0 4px",
    lineHeight: 1.2,
  },
  subheading: { fontSize: 13, color: "#94a3b8", margin: 0 },
  backBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    fontWeight: 700,
    color: "#64748b",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    padding: "8px 14px",
    textDecoration: "none",
    whiteSpace: "nowrap",
    flexShrink: 0,
    transition: "all 0.2s",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    maxWidth: 960,
    margin: "0 auto",
    borderTop: "1px solid #f1f5f9",
  },
  statCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "14px 12px",
    borderRight: "1px solid #f1f5f9",
  },
  statNumber: {
    fontFamily: "'Sora', sans-serif",
    fontSize: 22,
    fontWeight: 800,
    color: "#0f172a",
    lineHeight: 1,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "#94a3b8",
    marginTop: 3,
  },

  // Main
  main: {
    maxWidth: 960,
    margin: "0 auto",
    padding: "20px 16px 48px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  // Card
  card: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 16,
    padding: "20px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
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
    background: "#fef3c7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardTitle: {
    fontFamily: "'Sora', sans-serif",
    fontSize: 15,
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 2px",
  },
  cardSubtitle: { fontSize: 12, color: "#94a3b8", margin: 0 },

  // Form
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: 12,
    marginBottom: 14,
  },
  fieldGroup: { display: "flex", flexDirection: "column", gap: 6 },
  label: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    color: "#94a3b8",
  },
  input: {
    width: "100%",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    padding: "10px 12px",
    fontSize: 13,
    fontWeight: 500,
    color: "#0f172a",
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
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    padding: "8px 12px",
    marginBottom: 16,
  },
  previewText: { fontSize: 12, color: "#94a3b8", fontWeight: 500 },
  btnRow: { display: "flex", gap: 10, flexWrap: "wrap" },
  btn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "11px 20px",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    transition: "transform 0.15s, box-shadow 0.15s",
    fontFamily: "'DM Sans', sans-serif",
    flex: "1 1 auto",
    justifyContent: "center",
  },
  btnPublish: {
    background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
    color: "#fff",
    border: "none",
    boxShadow: "0 4px 14px rgba(22,163,74,0.25)",
  },
  btnUnpublish: {
    background: "#fff5f5",
    color: "#dc2626",
    border: "1px solid #fecaca",
  },
  spinnerWhite: {
    display: "inline-block",
    width: 13,
    height: 13,
    border: "2px solid rgba(255,255,255,0.4)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
  spinnerRed: {
    display: "inline-block",
    width: 13,
    height: 13,
    border: "2px solid #fecaca",
    borderTopColor: "#dc2626",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },

  // Table
  tableWrapper: {
    borderRadius: 10,
    border: "1px solid #e2e8f0",
    overflow: "hidden",
  },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: {
    background: "#f8fafc",
    padding: "10px 14px",
    textAlign: "left",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.09em",
    textTransform: "uppercase",
    color: "#94a3b8",
    borderBottom: "1px solid #e2e8f0",
  },
  tr: { transition: "background 0.15s", animation: "fadeUp 0.3s ease both" },
  td: {
    padding: "12px 14px",
    borderBottom: "1px solid #f1f5f9",
    color: "#334155",
    fontWeight: 500,
  },
  classChip: {
    display: "inline-block",
    background: "#fef3c7",
    color: "#d97706",
    border: "1px solid #fde68a",
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
    background: "#f0fdf4",
    color: "#16a34a",
    border: "1px solid #bbf7d0",
    borderRadius: 20,
    padding: "3px 10px",
    fontSize: 11,
    fontWeight: 700,
  },
  badgeUnpublished: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    background: "#f8fafc",
    color: "#94a3b8",
    border: "1px solid #e2e8f0",
    borderRadius: 20,
    padding: "3px 10px",
    fontSize: 11,
    fontWeight: 700,
  },
  dot: { width: 6, height: 6, borderRadius: "50%", display: "inline-block" },

  // Mobile cards
  mobileCards: { display: "none", flexDirection: "column", gap: 10 },
  mobileCard: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
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
  mobileCardMeta: { fontSize: 13, color: "#64748b", fontWeight: 500 },
  mobileCardDate: { fontSize: 11, color: "#94a3b8", margin: 0 },
};
