"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";

const TERMS = ["First Term", "Second Term", "Third Term"];

function currentSession() {
  const year = new Date().getFullYear();
  return `${year}/${year + 1}`;
}

export default function StudentResultsPage() {
  const [filters, setFilters] = useState({
    academicSession: currentSession(),
    term: "First Term",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function loadResult() {
    setLoading(true);
    const params = new URLSearchParams(filters);
    const res = await fetch(`/api/student/results?${params}`);
    const json = await res.json();
    setLoading(false);
    if (!json.success) return toast.error(json.message || "Result is not available");
    setResult(json.result);
  }

  function downloadPdf() {
    if (!result) return;
    const student = result.student;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(result.schoolName, 105, 18, { align: "center" });
    doc.setFontSize(12);
    doc.text("Student Report Card", 105, 26, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Name: ${student.studentName}`, 14, 42);
    doc.text(`Admission Number: ${student.admissionNumber}`, 14, 49);
    doc.text(`Class: ${result.className}`, 14, 56);
    doc.text(`Session: ${result.academicSession}`, 120, 42);
    doc.text(`Term: ${result.term}`, 120, 49);
    doc.text(`Position: ${student.position}`, 120, 56);
    let y = 72;
    doc.setFont(undefined, "bold");
    doc.text("Subject", 14, y); doc.text("CA", 82, y); doc.text("Exam", 104, y);
    doc.text("Total", 130, y); doc.text("Grade", 158, y);
    doc.setFont(undefined, "normal");
    y += 7;
    student.subjects.forEach((item) => {
      doc.text(item.subject, 14, y); doc.text(String(item.caScore), 84, y);
      doc.text(String(item.examScore), 108, y); doc.text(String(item.totalScore), 134, y);
      doc.text(item.grade, 162, y); y += 7;
    });
    y += 8;
    doc.text(`Total Score: ${student.totalScore}`, 14, y);
    doc.text(`Average: ${student.averageScore}%`, 70, y);
    doc.text(`Overall Grade: ${student.overallGrade}`, 124, y);
    y += 10; doc.text(`Attendance: ${student.attendance || "N/A"}`, 14, y);
    y += 10; doc.text(`Class Teacher Remark: ${student.classTeacherRemark || ""}`, 14, y, { maxWidth: 180 });
    y += 16; doc.text(`Principal Remark: ${student.principalRemark || ""}`, 14, y, { maxWidth: 180 });
    doc.save(`${student.admissionNumber.replaceAll("/", "-")}-report-card.pdf`);
  }

  return (
    <div style={s.root}>
      {/* Header */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <div style={s.headerLeft}>
            <span style={s.portalBadge}>Student Portal</span>
            <h1 style={s.heading}>My Results</h1>
            <p style={s.subheading}>View and download your academic report cards</p>
          </div>
          <a href="/student" style={s.backBtn}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Dashboard
          </a>
        </div>
      </header>

      <main style={s.main}>
        {/* Filter card */}
        <section style={s.filterCard}>
          <div style={s.filterIcon}>
            <svg width="16" height="16" fill="none" stroke="#f59e0b" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
            </svg>
          </div>
          <div style={s.filterFields}>
            <div style={s.fieldWrap}>
              <label style={s.label}>Academic Session</label>
              <input
                style={s.input}
                value={filters.academicSession}
                onChange={(e) => setFilters({ ...filters, academicSession: e.target.value })}
                onFocus={(e) => Object.assign(e.target.style, { borderColor: "#f59e0b", boxShadow: "0 0 0 3px rgba(245,158,11,0.15)" })}
                onBlur={(e) => Object.assign(e.target.style, { borderColor: "#1e3a5f", boxShadow: "none" })}
              />
            </div>
            <div style={s.fieldWrap}>
              <label style={s.label}>Term</label>
              <select
                style={s.input}
                value={filters.term}
                onChange={(e) => setFilters({ ...filters, term: e.target.value })}
                onFocus={(e) => Object.assign(e.target.style, { borderColor: "#f59e0b", boxShadow: "0 0 0 3px rgba(245,158,11,0.15)" })}
                onBlur={(e) => Object.assign(e.target.style, { borderColor: "#1e3a5f", boxShadow: "none" })}
              >
                {TERMS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <button
              disabled={loading}
              style={{ ...s.viewBtn, ...(loading ? s.viewBtnDisabled : {}) }}
              onClick={loadResult}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
            >
              {loading
                ? <><span style={s.spinner} /> Loading…</>
                : <><SearchIcon /> View Results</>}
            </button>
          </div>
        </section>

        {!result && !loading && (
          <div style={s.emptyState}>
            <div style={s.emptyIconWrap}>
              <svg width="32" height="32" fill="none" stroke="#1e3a5f" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M12 12h.01M12 16h.01" strokeLinecap="round" />
              </svg>
            </div>
            <p style={s.emptyTitle}>No result loaded</p>
            <p style={s.emptyText}>Select a session and term above, then click <strong style={{ color: "#f59e0b" }}>View Results</strong>.</p>
          </div>
        )}

        {result && <ReportCard result={result} onPdf={downloadPdf} />}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Sora:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        @media (max-width:640px) {
          .rc-info-grid { grid-template-columns: 1fr 1fr !important; }
          .rc-summary-grid { grid-template-columns: 1fr 1fr !important; }
          .rc-remark-grid { grid-template-columns: 1fr !important; }
          .rc-filter-row { flex-direction: column !important; }
          .rc-action-row { flex-direction: column !important; }
          .rc-school-header { flex-direction: column !important; align-items: flex-start !important; }
          .rc-table-wrap { display: none !important; }
          .rc-mobile-subjects { display: flex !important; }
        }
        @media (min-width:641px) {
          .rc-table-wrap { display: block !important; }
          .rc-mobile-subjects { display: none !important; }
        }
        @media print {
          body * { visibility: hidden; }
          #report-card, #report-card * { visibility: visible; }
          #report-card { position: absolute; inset: 0; width: 100%; background: white !important; }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
}

function ReportCard({ result, onPdf }) {
  const student = result.student;

  function gradeColor(grade) {
    if (!grade) return "#94a3b8";
    const g = grade.toUpperCase();
    if (g === "A" || g === "A1") return "#4ade80";
    if (g === "B" || g.startsWith("B")) return "#60a5fa";
    if (g === "C" || g.startsWith("C")) return "#f59e0b";
    if (g === "D" || g.startsWith("D")) return "#fb923c";
    return "#f87171";
  }

  function scoreBar(total, max = 100) {
    const pct = Math.min(100, (total / max) * 100);
    const color = pct >= 70 ? "#4ade80" : pct >= 50 ? "#f59e0b" : "#f87171";
    return { pct, color };
  }

  return (
    <section id="report-card" style={s.reportCard}>
      {/* Action bar */}
      <div className="no-print" style={s.actionBar}>
        <button
          style={s.pdfBtn}
          onClick={onPdf}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
        >
          <DownloadIcon /> Download PDF
        </button>
        <button
          style={s.printBtn}
          onClick={() => window.print()}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
        >
          <PrintIcon /> Print
        </button>
      </div>

      {/* School header */}
      <div className="rc-school-header" style={s.schoolHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1 }}>
          {result.schoolLogo && (
            <div style={s.logoWrap}>
              <img src={result.schoolLogo} alt="School Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
          )}
          <div>
            <h2 style={s.schoolName}>{result.schoolName}</h2>
            <p style={s.reportLabel}>Academic Report Card</p>
            <div style={s.sessionTag}>{result.term} &nbsp;·&nbsp; {result.academicSession}</div>
          </div>
        </div>
        <div style={s.passportWrap}>
          {student.passport
            ? <img src={student.passport} alt={student.studentName} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 10 }} />
            : <div style={s.passportPlaceholder}>
                <svg width="22" height="22" fill="none" stroke="#334155" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round" />
                </svg>
              </div>}
        </div>
      </div>

      {/* Divider */}
      <div style={s.divider} />

      {/* Student info grid */}
      <div className="rc-info-grid" style={s.infoGrid}>
        {[
          ["Student Name", student.studentName],
          ["Admission No.", student.admissionNumber],
          ["Class", result.className],
          ["Position in Class", student.position],
        ].map(([label, value]) => (
          <InfoBox key={label} label={label} value={value} />
        ))}
      </div>

      {/* Subjects table */}
      <div style={s.tableSection}>
        <h3 style={s.sectionTitle}>
          <BookIcon /> Subject Performance
        </h3>

        {/* Desktop table */}
        <div className="rc-table-wrap" style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                {["Subject", "C.A. Score", "Exam Score", "Total", "Grade", "Performance"].map((h) => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {student.subjects.map((item, i) => {
                const { pct, color } = scoreBar(item.totalScore);
                return (
                  <tr key={item.subject} style={{ ...s.tr, animationDelay: `${i * 35}ms` }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <td style={{ ...s.td, fontWeight: 600, color: "#e2e8f0" }}>{item.subject}</td>
                    <td style={{ ...s.td, color: "#94a3b8" }}>{item.caScore}</td>
                    <td style={{ ...s.td, color: "#94a3b8" }}>{item.examScore}</td>
                    <td style={{ ...s.td, fontWeight: 700, color: "#f1f5f9" }}>{item.totalScore}</td>
                    <td style={s.td}>
                      <span style={{ ...s.gradeChip, color: gradeColor(item.grade), background: gradeColor(item.grade) + "18", border: `1px solid ${gradeColor(item.grade)}30` }}>
                        {item.grade}
                      </span>
                    </td>
                    <td style={{ ...s.td, minWidth: 100 }}>
                      <div style={s.barBg}>
                        <div style={{ ...s.barFill, width: `${pct}%`, background: color }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile subject cards */}
        <div className="rc-mobile-subjects" style={s.mobileSubjects}>
          {student.subjects.map((item, i) => {
            const { pct, color } = scoreBar(item.totalScore);
            return (
              <div key={item.subject} style={{ ...s.subjectCard, animationDelay: `${i * 35}ms` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: "#e2e8f0" }}>{item.subject}</span>
                  <span style={{ ...s.gradeChip, color: gradeColor(item.grade), background: gradeColor(item.grade) + "18", border: `1px solid ${gradeColor(item.grade)}30` }}>
                    {item.grade}
                  </span>
                </div>
                <div style={s.barBg}>
                  <div style={{ ...s.barFill, width: `${pct}%`, background: color }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  <span style={{ fontSize: 11, color: "#475569" }}>CA: <strong style={{ color: "#94a3b8" }}>{item.caScore}</strong></span>
                  <span style={{ fontSize: 11, color: "#475569" }}>Exam: <strong style={{ color: "#94a3b8" }}>{item.examScore}</strong></span>
                  <span style={{ fontSize: 11, color: "#475569" }}>Total: <strong style={{ color: "#f1f5f9" }}>{item.totalScore}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary row */}
      <div className="rc-summary-grid" style={s.summaryGrid}>
        {[
          ["Total Score", student.totalScore, "#60a5fa"],
          ["Average Score", `${student.averageScore}%`, "#f59e0b"],
          ["Overall Grade", student.overallGrade, gradeColor(student.overallGrade)],
          ["Attendance", student.attendance || "N/A", "#a78bfa"],
        ].map(([label, value, color]) => (
          <div key={label} style={s.summaryCard}>
            <span style={{ ...s.summaryValue, color }}>{value}</span>
            <span style={s.summaryLabel}>{label}</span>
          </div>
        ))}
      </div>

      {/* Remarks */}
      <div className="rc-remark-grid" style={s.remarkGrid}>
        <RemarkBox title="Class Teacher's Remark" text={student.classTeacherRemark} icon="🎓" />
        <RemarkBox title="Principal's Remark" text={student.principalRemark || "N/A"} icon="🏫" />
      </div>
    </section>
  );
}

function InfoBox({ label, value }) {
  return (
    <div style={s.infoBox}>
      <span style={s.infoLabel}>{label}</span>
      <span style={s.infoValue}>{value}</span>
    </div>
  );
}

function RemarkBox({ title, text, icon }) {
  return (
    <div style={s.remarkBox}>
      <div style={s.remarkHeader}>
        <span style={{ fontSize: 14 }}>{icon}</span>
        <span style={s.remarkTitle}>{title}</span>
      </div>
      <p style={s.remarkText}>{text}</p>
    </div>
  );
}

function SearchIcon() {
  return <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" /></svg>;
}
function DownloadIcon() {
  return <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function PrintIcon() {
  return <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6z" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function BookIcon() {
  return <svg width="14" height="14" fill="none" stroke="#f59e0b" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 014 17V5a2 2 0 012-2h14v14H6.5A2.5 2.5 0 004 19.5z" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

const base = { fontFamily: "'DM Sans', sans-serif", color: "#e2e8f0" };

const s = {
  root: { ...base, minHeight: "100vh", background: "#080f1e" },

  // Header
  header: {
    background: "linear-gradient(160deg, #0c1a2e 0%, #0a1628 100%)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  headerInner: {
    display: "flex", alignItems: "flex-start", justifyContent: "space-between",
    gap: 12, padding: "24px 20px 20px", maxWidth: 960, margin: "0 auto",
  },
  headerLeft: { flex: 1 },
  portalBadge: {
    display: "inline-block", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
    textTransform: "uppercase", color: "#60a5fa", background: "rgba(96,165,250,0.1)",
    border: "1px solid rgba(96,165,250,0.2)", borderRadius: 20, padding: "3px 10px", marginBottom: 8,
  },
  heading: {
    fontFamily: "'Sora', sans-serif", fontSize: 24, fontWeight: 800,
    color: "#f8fafc", margin: "0 0 4px", lineHeight: 1.2,
  },
  subheading: { fontSize: 13, color: "#64748b", margin: 0 },
  backBtn: {
    display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700,
    color: "#94a3b8", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 8, padding: "8px 14px", textDecoration: "none", whiteSpace: "nowrap",
    transition: "all 0.2s", flexShrink: 0,
  },

  // Main
  main: { maxWidth: 960, margin: "0 auto", padding: "20px 16px 60px", display: "flex", flexDirection: "column", gap: 16 },

  // Filter card
  filterCard: {
    background: "linear-gradient(145deg, #0f1f38 0%, #0c1a2e 100%)",
    border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "18px 20px",
    display: "flex", alignItems: "flex-end", gap: 14, animation: "fadeUp 0.3s ease both",
  },
  filterIcon: {
    width: 38, height: 38, borderRadius: 10, background: "rgba(245,158,11,0.1)",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginBottom: 2,
  },
  filterFields: { display: "flex", flex: 1, gap: 10, alignItems: "flex-end", flexWrap: "wrap" },
  fieldWrap: { display: "flex", flexDirection: "column", gap: 5, flex: "1 1 140px" },
  label: { fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#475569" },
  input: {
    width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid #1e3a5f",
    borderRadius: 10, padding: "10px 12px", fontSize: 13, fontWeight: 500,
    color: "#e2e8f0", outline: "none", transition: "border-color 0.2s, box-shadow 0.2s",
    fontFamily: "'DM Sans', sans-serif", appearance: "none", WebkitAppearance: "none",
  },
  viewBtn: {
    display: "flex", alignItems: "center", gap: 7, padding: "10px 20px",
    borderRadius: 10, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer",
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    color: "#fff", boxShadow: "0 4px 16px rgba(37,99,235,0.35)",
    transition: "transform 0.15s, box-shadow 0.15s", fontFamily: "'DM Sans', sans-serif",
    flexShrink: 0, whiteSpace: "nowrap",
  },
  viewBtnDisabled: { opacity: 0.7, cursor: "not-allowed" },
  spinner: {
    display: "inline-block", width: 12, height: 12,
    border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff",
    borderRadius: "50%", animation: "spin 0.7s linear infinite",
  },

  // Empty state
  emptyState: {
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: "56px 20px", gap: 10, animation: "fadeUp 0.3s ease both",
  },
  emptyIconWrap: {
    width: 64, height: 64, borderRadius: 18, background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.06)", display: "flex",
    alignItems: "center", justifyContent: "center", marginBottom: 6,
  },
  emptyTitle: { fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 700, color: "#334155", margin: 0 },
  emptyText: { fontSize: 13, color: "#1e3a5f", margin: 0, textAlign: "center", maxWidth: 280, lineHeight: 1.6 },

  // Report card
  reportCard: {
    background: "linear-gradient(145deg, #0f1f38 0%, #0c1a2e 100%)",
    border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16,
    padding: "20px", animation: "fadeUp 0.4s ease both",
  },

  // Action bar
  actionBar: { display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" },
  pdfBtn: {
    display: "flex", alignItems: "center", gap: 7, padding: "10px 18px",
    borderRadius: 10, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    color: "#f59e0b", border: "1px solid rgba(245,158,11,0.3)",
    boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
    transition: "transform 0.15s", fontFamily: "'DM Sans', sans-serif",
  },
  printBtn: {
    display: "flex", alignItems: "center", gap: 7, padding: "10px 18px",
    borderRadius: 10, fontSize: 13, fontWeight: 700,
    background: "rgba(255,255,255,0.04)", color: "#94a3b8",
    border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer",
    transition: "transform 0.15s", fontFamily: "'DM Sans', sans-serif",
  },

  // School header
  schoolHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    gap: 16, marginBottom: 18, flexWrap: "wrap",
  },
  logoWrap: {
    width: 52, height: 52, borderRadius: 12, overflow: "hidden",
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
    flexShrink: 0, padding: 4,
  },
  schoolName: {
    fontFamily: "'Sora', sans-serif", fontSize: 18, fontWeight: 800,
    color: "#f8fafc", margin: "0 0 2px",
  },
  reportLabel: { fontSize: 12, color: "#475569", margin: "0 0 6px" },
  sessionTag: {
    display: "inline-block", fontSize: 11, fontWeight: 600, color: "#60a5fa",
    background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.18)",
    borderRadius: 20, padding: "2px 10px",
  },
  passportWrap: {
    width: 72, height: 80, borderRadius: 10, overflow: "hidden",
    border: "2px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)",
    flexShrink: 0,
  },
  passportPlaceholder: {
    width: "100%", height: "100%", display: "flex",
    alignItems: "center", justifyContent: "center",
  },

  // Divider
  divider: { height: 1, background: "rgba(255,255,255,0.05)", margin: "0 0 18px" },

  // Info grid
  infoGrid: {
    display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20,
  },
  infoBox: {
    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 10, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 4,
  },
  infoLabel: { fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#334155" },
  infoValue: { fontSize: 14, fontWeight: 800, color: "#f1f5f9", fontFamily: "'Sora', sans-serif" },

  // Table section
  tableSection: { marginBottom: 20 },
  sectionTitle: {
    display: "flex", alignItems: "center", gap: 8,
    fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700,
    color: "#94a3b8", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.07em",
  },
  tableWrap: { borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: {
    background: "rgba(255,255,255,0.03)", padding: "10px 14px", textAlign: "left",
    fontSize: 10, fontWeight: 700, letterSpacing: "0.09em",
    textTransform: "uppercase", color: "#334155", borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  tr: { transition: "background 0.15s", animation: "fadeUp 0.3s ease both" },
  td: { padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,0.04)", color: "#94a3b8" },
  gradeChip: {
    display: "inline-block", borderRadius: 6, padding: "2px 10px",
    fontSize: 12, fontWeight: 800, fontFamily: "'Sora', sans-serif",
  },
  barBg: { height: 5, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 99, transition: "width 0.8s cubic-bezier(0.34,1.56,0.64,1)" },

  // Mobile subjects
  mobileSubjects: {
    display: "none", flexDirection: "column", gap: 8,
  },
  subjectCard: {
    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 10, padding: "12px 14px", animation: "fadeUp 0.3s ease both",
  },

  // Summary
  summaryGrid: {
    display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20,
  },
  summaryCard: {
    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 12, padding: "14px 16px", display: "flex",
    flexDirection: "column", alignItems: "center", gap: 4, textAlign: "center",
  },
  summaryValue: { fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 800, lineHeight: 1 },
  summaryLabel: { fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#334155" },

  // Remarks
  remarkGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  remarkBox: {
    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 12, padding: "14px 16px",
  },
  remarkHeader: { display: "flex", alignItems: "center", gap: 7, marginBottom: 10 },
  remarkTitle: { fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#475569" },
  remarkText: { fontSize: 13, color: "#94a3b8", lineHeight: 1.7, margin: 0 },
};