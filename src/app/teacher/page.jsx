"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const TABS = [
  "Overview",
  "Assignments",
  "Submissions",
  "Students",
  "Announcements",
  "Timetable",
  "Results",
];

const TAB_ICONS = {
  Overview: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  ),
  Assignments: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  Submissions: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  Students: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Announcements: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  Timetable: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Results: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5V4a2 2 0 0 1 2-2h12v17.5" />
      <path d="M8 7h6" />
      <path d="M8 11h8" />
      <path d="M8 15h5" />
      <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20" />
    </svg>
  ),
};

const emptyPeriods = () =>
  Array.from({ length: 8 }, (_, i) => ({
    periodNumber: i + 1,
    type: "subject",
    subject: "",
    teacherName: "",
    startTime: "",
    endTime: "",
  }));
const emptyDays = () => DAYS.map((day) => ({ day, periods: emptyPeriods() }));

const PERIOD_COLORS = {
  subject: { bg: "#eff2ff", color: "#3b5bdb", border: "#c5d0f0" },
  break: { bg: "#f0fdf4", color: "#0ca678", border: "#bbf7d0" },
  assembly: { bg: "#fff9db", color: "#f59f00", border: "#fde68a" },
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ tab, setTab, teacher, onLogout }) {
  return (
    <aside style={S.sidebar}>
      <div style={S.sidebarTop}>
        <div style={S.logoRow}>
          <div style={S.logoIcon}>
            <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="7" fill="#3b5bdb" />
              <path
                d="M7 14h14M14 7l7 7-7 7"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <p style={S.logoName}>EduPortal</p>
            <p style={S.logoSub}>Teacher Portal</p>
          </div>
        </div>
        <div style={S.teacherInfo}>
          <div style={S.teacherAvatar}>
            {teacher?.fullName
              ?.split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase() || "T"}
          </div>
          <div>
            <p style={S.teacherName}>{teacher?.fullName}</p>
            <p style={S.teacherSubject}>{teacher?.subject || "Teacher"}</p>
          </div>
        </div>
      </div>
      <nav style={S.sideNav}>
        <p style={S.navSection}>Navigation</p>
        {TABS.map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`t-nav-link${tab === item ? " t-nav-active" : ""}`}
          >
            {TAB_ICONS[item]}
            <span>{item}</span>
          </button>
        ))}
      </nav>
      <div style={S.sideFooter}>
        <button onClick={onLogout} className="t-logout">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

// ─── Mobile Drawer ────────────────────────────────────────────────────────────
function MobileDrawer({ open, onClose, tab, setTab, teacher, onLogout }) {
  if (!open) return null;
  return (
    <>
      <div onClick={onClose} style={S.backdrop} />
      <div style={S.drawer}>
        <div style={S.drawerHead}>
          <div style={S.logoRow}>
            <div style={S.logoIcon}>
              <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="7" fill="#3b5bdb" />
                <path
                  d="M7 14h14M14 7l7 7-7 7"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <p style={S.logoName}>EduPortal</p>
              <p style={S.logoSub}>Teacher Portal</p>
            </div>
          </div>
          <button onClick={onClose} style={S.drawerClose}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div style={{ ...S.teacherInfo, margin: "12px 16px 0" }}>
          <div style={S.teacherAvatar}>
            {teacher?.fullName
              ?.split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase() || "T"}
          </div>
          <div>
            <p style={S.teacherName}>{teacher?.fullName}</p>
            <p style={S.teacherSubject}>{teacher?.subject || "Teacher"}</p>
          </div>
        </div>
        <nav
          style={{
            padding: "12px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            flex: 1,
          }}
        >
          {TABS.map((item) => (
            <button
              key={item}
              onClick={() => {
                setTab(item);
                onClose();
              }}
              className={`t-nav-link${tab === item ? " t-nav-active" : ""}`}
            >
              {TAB_ICONS[item]}
              <span>{item}</span>
            </button>
          ))}
        </nav>
        <div style={S.sideFooter}>
          <button onClick={onLogout} className="t-logout">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function TeacherDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState("Overview");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [assignment, setAssignment] = useState({
    title: "",
    subject: "",
    description: "",
    classes: [],
    deadline: "",
    fileUrl: "",
    fileName: "",
  });
  const [notice, setNotice] = useState({ title: "", message: "", classes: [] });
  const [selectedClass, setSelectedClass] = useState("");
  const [timetable, setTimetable] = useState(emptyDays());

  const classes = data?.teacher?.assignedClasses || [];
  const subjects = useMemo(
    () =>
      Array.from(
        new Set(
          [
            data?.teacher?.subject,
            ...(data?.teacher?.assignedSubjects || []),
          ].filter(Boolean),
        ),
      ),
    [data?.teacher],
  );
  const submissions = data?.submissions || [];
  const stats = useMemo(
    () => ({
      students: data?.students?.length || 0,
      assignments: data?.assignments?.length || 0,
      pending: submissions.filter((s) => !s.isGraded).length,
      graded: submissions.filter((s) => s.isGraded).length,
    }),
    [data, submissions],
  );

  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    if (!selectedClass && classes.length) setSelectedClass(classes[0]);
  }, [classes, selectedClass]);
  useEffect(() => {
    const existing = data?.timetables?.find((t) => t.class === selectedClass);
    setTimetable(existing?.days?.length ? existing.days : emptyDays());
  }, [data, selectedClass]);

  async function load({ showSpinner = true, redirectOnAuthError = true } = {}) {
    if (showSpinner) setLoading(true);
    try {
      const res = await fetch("/api/teacher/overview", { cache: "no-store" });
      const json = await res.json();
      if (!json.success) {
        if (redirectOnAuthError) router.push("/login/student");
        return false;
      }
      setData(json);
      return true;
    } catch {
      if (redirectOnAuthError) router.push("/login/student");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Logout failed");
      toast.success("Logged out");
      router.push("/login/student");
    } catch {
      toast.error("Logout failed");
    }
  }

  async function uploadFile(file, folder) {
    if (!file) return null;
    const form = new FormData();
    form.append("file", file);
    form.append("folder", folder);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || "Upload failed");
    return json;
  }

  async function createAssignment(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const file = form.file?.files?.[0];
    setSaving(true);
    try {
      const upload = await uploadFile(file, "school-portal/assignments");
      const payload = {
        ...assignment,
        fileUrl: upload?.url || assignment.fileUrl,
        fileName: upload?.originalName || assignment.fileName,
      };
      const res = await fetch("/api/teacher/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success)
        return toast.error(json.message || "Could not create assignment");
      toast.success("Assignment posted!");
      setAssignment({
        title: "",
        subject: "",
        description: "",
        classes: [],
        deadline: "",
        fileUrl: "",
        fileName: "",
      });
      form.reset();
      setData((prev) =>
        prev
          ? {
              ...prev,
              assignments: [json.assignment, ...(prev.assignments || [])],
            }
          : prev,
      );
      load({ showSpinner: false, redirectOnAuthError: false });
    } catch (error) {
      toast.error(error.message || "Could not create assignment");
    } finally {
      setSaving(false);
    }
  }

  async function gradeSubmission(id, grade, feedback) {
    const res = await fetch(`/api/teacher/submissions/${id}/grade`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grade, feedback }),
    });
    const json = await res.json();
    if (!json.success)
      return toast.error(json.message || "Could not save grade");
    toast.success("Grade saved!");
    load();
  }

  async function sendNotice(e) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/teacher/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(notice),
    });
    const json = await res.json();
    setSaving(false);
    if (!json.success)
      return toast.error(json.message || "Could not send announcement");
    toast.success("Announcement sent!");
    setNotice({ title: "", message: "", classes: [] });
    setData((prev) =>
      prev
        ? {
            ...prev,
            notices: [json.notice, ...(prev.notices || [])],
          }
        : prev,
    );
    load({ showSpinner: false, redirectOnAuthError: false });
  }

  async function saveTimetable() {
    if (!selectedClass) return toast.error("Select a class");
    setSaving(true);
    const res = await fetch("/api/teacher/timetable", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ class: selectedClass, days: timetable }),
    });
    const json = await res.json();
    setSaving(false);
    if (!json.success)
      return toast.error(json.message || "Could not save timetable");
    toast.success("Timetable saved!");
    load();
  }

  function toggleClass(key, className, setter) {
    setter((prev) => ({
      ...prev,
      [key]: prev[key].includes(className)
        ? prev[key].filter((c) => c !== className)
        : [...prev[key], className],
    }));
  }

  function updatePeriod(dayIndex, periodIndex, field, value) {
    setTimetable((prev) =>
      prev.map((day, dI) =>
        dI !== dayIndex
          ? day
          : {
              ...day,
              periods: day.periods.map((p, pI) =>
                pI !== periodIndex ? p : { ...p, [field]: value },
              ),
            },
      ),
    );
  }

  if (loading)
    return (
      <div style={S.loadWrap}>
        <div style={S.spinner} />
        <p style={S.loadText}>Loading teacher dashboard…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );

  return (
    <div style={S.page}>
      <style>{globalCss}</style>
      <div className="t-desktop-sidebar">
        <Sidebar
          tab={tab}
          setTab={setTab}
          teacher={data.teacher}
          onLogout={logout}
        />
      </div>
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        tab={tab}
        setTab={setTab}
        teacher={data.teacher}
        onLogout={logout}
      />

      <main style={S.main}>
        {/* Topbar */}
        <header style={S.topbar} className="t-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setDrawerOpen(true)} className="t-menu-btn">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div>
              <p style={S.breadcrumb}>Teacher Portal</p>
              <h1 style={S.pageTitle}>{tab}</h1>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {classes.length > 0 && (
              <div style={S.classBadge}>{classes.join(" · ")}</div>
            )}
          </div>
        </header>

        {/* Mobile tab strip */}
        <div style={S.mobileTabStrip} className="t-tab-strip">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`t-tab-pill${tab === t ? " t-tab-pill-active" : ""}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div style={S.body} className="t-body">
          {/* ── OVERVIEW ── */}
          {tab === "Overview" && (
            <section style={{ display: "grid", gap: 20 }}>
              <div style={S.statsGrid} className="t-stats-grid">
                {[
                  {
                    label: "Total Students",
                    value: stats.students,
                    color: "#3b5bdb",
                    bg: "#eff2ff",
                  },
                  {
                    label: "Assignments",
                    value: stats.assignments,
                    color: "#0ca678",
                    bg: "#f0fdf4",
                  },
                  {
                    label: "Pending Grades",
                    value: stats.pending,
                    color: "#f59f00",
                    bg: "#fff9db",
                  },
                  {
                    label: "Graded",
                    value: stats.graded,
                    color: "#7c3aed",
                    bg: "#f3f0ff",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    style={{ ...S.statCard, borderColor: `${s.color}33` }}
                  >
                    <p
                      style={{
                        ...S.statValue,
                        color: s.color,
                        background: s.bg,
                      }}
                    >
                      {s.value}
                    </p>
                    <p style={S.statLabel}>{s.label}</p>
                  </div>
                ))}
              </div>
              <div style={S.card}>
                <SectionTitle icon="📋" title="Recent Assignments" />
                <AssignmentList assignments={data.assignments || []} />
              </div>
            </section>
          )}

          {/* ── ASSIGNMENTS ── */}
          {tab === "Assignments" && (
            <section style={{ display: "grid", gap: 20 }}>
              <div style={S.card}>
                <SectionTitle icon="✏️" title="Post New Assignment" />
                <form
                  onSubmit={createAssignment}
                  style={{ display: "grid", gap: 14, marginTop: 16 }}
                >
                  <div style={S.formGrid2} className="t-form-grid-2">
                    <FormField label="Title">
                      <input
                        style={S.input}
                        value={assignment.title}
                        onChange={(e) =>
                          setAssignment({
                            ...assignment,
                            title: e.target.value,
                          })
                        }
                        required
                      />
                    </FormField>
                    <FormField label="Subject">
                      <select
                        style={S.input}
                        value={assignment.subject}
                        onChange={(e) =>
                          setAssignment({
                            ...assignment,
                            subject: e.target.value,
                          })
                        }
                        required
                      >
                        <option value="">Select subject</option>
                        {subjects.map((subject) => (
                          <option key={subject}>{subject}</option>
                        ))}
                      </select>
                    </FormField>
                  </div>
                  <FormField label="Description">
                    <textarea
                      style={{ ...S.input, resize: "vertical" }}
                      rows={4}
                      value={assignment.description}
                      onChange={(e) =>
                        setAssignment({
                          ...assignment,
                          description: e.target.value,
                        })
                      }
                    />
                  </FormField>
                  <div style={S.formGrid2} className="t-form-grid-2">
                    <FormField label="Deadline">
                      <input
                        style={S.input}
                        type="datetime-local"
                        value={assignment.deadline}
                        onChange={(e) =>
                          setAssignment({
                            ...assignment,
                            deadline: e.target.value,
                          })
                        }
                      />
                    </FormField>
                    <FormField label="Attachment">
                      <div style={S.fileWrap}>
                        <input
                          name="file"
                          type="file"
                          style={{
                            fontSize: 13,
                            color: "#475569",
                            width: "100%",
                          }}
                        />
                      </div>
                    </FormField>
                  </div>
                  <ClassChecks
                    classes={classes}
                    selected={assignment.classes}
                    onToggle={(c) => toggleClass("classes", c, setAssignment)}
                  />
                  <button
                    type="submit"
                    disabled={saving}
                    style={{
                      ...S.btnPrimary,
                      width: "fit-content",
                      opacity: saving ? 0.7 : 1,
                    }}
                  >
                    {saving ? "Posting…" : "Post Assignment"}
                  </button>
                </form>
              </div>
              <div style={S.card}>
                <SectionTitle icon="📚" title="All Assignments" />
                <div style={{ marginTop: 14 }}>
                  <AssignmentList assignments={data.assignments || []} />
                </div>
              </div>
            </section>
          )}

          {/* ── SUBMISSIONS ── */}
          {tab === "Submissions" && (
            <section style={{ display: "grid", gap: 12 }}>
              <div style={S.card}>
                <SectionTitle
                  icon="📬"
                  title={`Submissions (${submissions.length})`}
                />
                {submissions.length === 0 ? (
                  <EmptyState icon="📭" msg="No submissions yet." />
                ) : (
                  <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
                    {submissions.map((item) => (
                      <GradeCard
                        key={item._id}
                        item={item}
                        onSave={gradeSubmission}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ── STUDENTS ── */}
          {tab === "Students" && (
            <section style={S.card}>
              <SectionTitle
                icon="👥"
                title={`Students (${(data.students || []).length})`}
              />
              {(data.students || []).length === 0 ? (
                <EmptyState icon="🎒" msg="No students enrolled yet." />
              ) : (
                <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
                  {(data.students || []).map((student) => (
                    <div
                      key={student._id}
                      style={S.studentRow}
                      className="t-student-row"
                    >
                      <div style={S.studentAvatar}>
                        {student.fullName
                          ?.split(" ")
                          .map((w) => w[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={S.studentName}>{student.fullName}</p>
                        <p style={S.studentMeta}>{student.email}</p>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={S.classPill}>{student.studentClass}</div>
                        {student.admissionNumber && (
                          <p style={S.admNo}>#{student.admissionNumber}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ── ANNOUNCEMENTS ── */}
          {tab === "Announcements" && (
            <section style={{ display: "grid", gap: 20 }}>
              <div style={S.card}>
                <SectionTitle icon="📢" title="Send Announcement" />
                <form
                  onSubmit={sendNotice}
                  style={{ display: "grid", gap: 14, marginTop: 16 }}
                >
                  <FormField label="Title">
                    <input
                      style={S.input}
                      value={notice.title}
                      onChange={(e) =>
                        setNotice({ ...notice, title: e.target.value })
                      }
                      required
                    />
                  </FormField>
                  <FormField label="Message">
                    <textarea
                      style={{ ...S.input, resize: "vertical" }}
                      rows={4}
                      value={notice.message}
                      onChange={(e) =>
                        setNotice({ ...notice, message: e.target.value })
                      }
                    />
                  </FormField>
                  <ClassChecks
                    classes={classes}
                    selected={notice.classes}
                    onToggle={(c) => toggleClass("classes", c, setNotice)}
                  />
                  <button
                    type="submit"
                    disabled={saving}
                    style={{
                      ...S.btnPrimary,
                      width: "fit-content",
                      opacity: saving ? 0.7 : 1,
                    }}
                  >
                    {saving ? "Sending…" : "Send Announcement"}
                  </button>
                </form>
              </div>
              {(data.notices || []).length > 0 && (
                <div style={S.card}>
                  <SectionTitle icon="📋" title="Sent Announcements" />
                  <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
                    {(data.notices || []).map((item) => (
                      <div key={item._id} style={S.noticeCard}>
                        <div style={S.noticeDot} />
                        <div>
                          <p style={S.noticeTitle}>{item.title}</p>
                          <p style={S.noticeMsg}>{item.message}</p>
                          <p style={S.noticeClasses}>
                            {item.classes?.join(", ")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* ── TIMETABLE ── */}
          {tab === "Timetable" && (
            <section style={{ display: "grid", gap: 16 }}>
              <div
                style={{
                  ...S.card,
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <FormField label="Select Class">
                  <select
                    style={S.input}
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    {classes.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </FormField>
                <button
                  onClick={saveTimetable}
                  disabled={saving}
                  style={{ ...S.btnPrimary, opacity: saving ? 0.7 : 1 }}
                >
                  {saving ? "Saving…" : "Save Timetable"}
                </button>
              </div>

              {/* Mobile: Card-per-day layout */}
              <div className="t-timetable-cards">
                {timetable.map((day, dayIndex) => (
                  <div key={day.day} style={S.card}>
                    <p style={S.dayHeader}>{day.day}</p>
                    <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
                      {day.periods.map((period, periodIndex) => {
                        const pc =
                          PERIOD_COLORS[period.type] || PERIOD_COLORS.subject;
                        return (
                          <div
                            key={periodIndex}
                            style={{
                              ...S.periodCard,
                              borderColor: pc.border,
                              background: pc.bg,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: 8,
                              }}
                            >
                              <span
                                style={{ ...S.periodBadge, color: pc.color }}
                              >
                                Period {period.periodNumber}
                              </span>
                              <select
                                style={{ ...S.selectSmall, color: pc.color }}
                                value={period.type}
                                onChange={(e) =>
                                  updatePeriod(
                                    dayIndex,
                                    periodIndex,
                                    "type",
                                    e.target.value,
                                  )
                                }
                              >
                                <option value="subject">Subject</option>
                                <option value="break">Break</option>
                                <option value="assembly">Assembly</option>
                              </select>
                            </div>
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: 8,
                              }}
                            >
                              <div>
                                <p style={S.periodFieldLabel}>Start</p>
                                <input
                                  style={S.inputSm}
                                  type="time"
                                  value={period.startTime || ""}
                                  onChange={(e) =>
                                    updatePeriod(
                                      dayIndex,
                                      periodIndex,
                                      "startTime",
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <p style={S.periodFieldLabel}>End</p>
                                <input
                                  style={S.inputSm}
                                  type="time"
                                  value={period.endTime || ""}
                                  onChange={(e) =>
                                    updatePeriod(
                                      dayIndex,
                                      periodIndex,
                                      "endTime",
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                            </div>
                            {period.type === "subject" && (
                              <div style={{ marginTop: 8 }}>
                                <p style={S.periodFieldLabel}>Subject Name</p>
                                <input
                                  style={S.inputSm}
                                  placeholder="e.g. Mathematics"
                                  value={period.subject || ""}
                                  onChange={(e) =>
                                    updatePeriod(
                                      dayIndex,
                                      periodIndex,
                                      "subject",
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop: Classic table */}
              <div style={S.card} className="t-timetable-table">
                <div style={{ overflowX: "auto" }}>
                  <table style={S.table}>
                    <thead>
                      <tr>
                        <th style={S.th}>Day</th>
                        {Array.from({ length: 8 }, (_, i) => (
                          <th key={i} style={S.th}>
                            P{i + 1}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {timetable.map((day, dayIndex) => (
                        <tr key={day.day}>
                          <td
                            style={{
                              ...S.td,
                              fontWeight: 700,
                              color: "#0f172a",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {day.day}
                          </td>
                          {day.periods.map((period, periodIndex) => {
                            const pc =
                              PERIOD_COLORS[period.type] ||
                              PERIOD_COLORS.subject;
                            return (
                              <td
                                key={periodIndex}
                                style={{ ...S.td, minWidth: 160 }}
                              >
                                <select
                                  style={{
                                    ...S.selectSmall,
                                    marginBottom: 6,
                                    color: pc.color,
                                    background: pc.bg,
                                  }}
                                  value={period.type}
                                  onChange={(e) =>
                                    updatePeriod(
                                      dayIndex,
                                      periodIndex,
                                      "type",
                                      e.target.value,
                                    )
                                  }
                                >
                                  <option value="subject">Subject</option>
                                  <option value="break">Break</option>
                                  <option value="assembly">Assembly</option>
                                </select>
                                <div
                                  style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: 4,
                                  }}
                                >
                                  <input
                                    style={S.inputSm}
                                    type="time"
                                    value={period.startTime || ""}
                                    onChange={(e) =>
                                      updatePeriod(
                                        dayIndex,
                                        periodIndex,
                                        "startTime",
                                        e.target.value,
                                      )
                                    }
                                  />
                                  <input
                                    style={S.inputSm}
                                    type="time"
                                    value={period.endTime || ""}
                                    onChange={(e) =>
                                      updatePeriod(
                                        dayIndex,
                                        periodIndex,
                                        "endTime",
                                        e.target.value,
                                      )
                                    }
                                  />
                                </div>
                                {period.type === "subject" && (
                                  <input
                                    style={{ ...S.inputSm, marginTop: 4 }}
                                    placeholder="Subject"
                                    value={period.subject || ""}
                                    onChange={(e) =>
                                      updatePeriod(
                                        dayIndex,
                                        periodIndex,
                                        "subject",
                                        e.target.value,
                                      )
                                    }
                                  />
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
            </section>
          )}

          {tab === "Results" && (
            <section style={S.card}>
              <SectionTitle icon="📊" title="Result Management" />
              <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>
                  Upload subject broadsheets, compile class results, generate
                  AI-assisted remarks, and prepare report cards.
                </p>
                <a
                  href="/teacher/results"
                  style={{
                    ...S.btnPrimary,
                    width: "fit-content",
                    textDecoration: "none",
                  }}
                >
                  Open Result Management
                </a>
              </div>
            </section>
          )}
        </div>

        {/* Mobile bottom nav */}
        <nav style={S.mobileBottomNav} className="t-bottom-nav">
          {TABS.slice(0, 5).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                ...S.mobileNavItem,
                color: tab === t ? "#3b5bdb" : "#94a3b8",
              }}
            >
              <span style={{ display: "flex" }}>{TAB_ICONS[t]}</span>
              <span style={{ fontSize: 9, fontWeight: tab === t ? 700 : 500 }}>
                {t}
              </span>
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function SectionTitle({ icon, title }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span>{icon}</span>
      <h2
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#0f172a",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h2>
      <div
        style={{ flex: 1, height: 1, background: "#f1f5f9", borderRadius: 2 }}
      />
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <label
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#64748b",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function ClassChecks({ classes, selected, onToggle }) {
  return (
    <div>
      <p
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#64748b",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          marginBottom: 8,
        }}
      >
        Target Classes
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {classes.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onToggle(c)}
            style={{
              padding: "7px 14px",
              borderRadius: 8,
              border: "1.5px solid",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'Sora', sans-serif",
              transition: "all 0.15s",
              background: selected.includes(c) ? "#0f172a" : "white",
              color: selected.includes(c) ? "white" : "#475569",
              borderColor: selected.includes(c) ? "#0f172a" : "#e2e8f0",
            }}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

function AssignmentList({ assignments }) {
  if (!assignments.length)
    return <EmptyState icon="📭" msg="No assignments posted yet." />;
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {assignments.map((item) => (
        <div key={item._id} style={S.assignCard}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: 6,
              marginBottom: 6,
            }}
          >
            <div>
              <p style={S.assignTitle}>{item.title}</p>
              <p style={S.assignMeta}>
                {item.subject} · {item.classes?.join(", ")}
              </p>
            </div>
            <span style={S.deadlineBadge}>
              Due{" "}
              {new Date(item.deadline).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <p style={S.assignDesc}>{item.description}</p>
          {item.fileUrl && (
            <a href={item.fileUrl} target="_blank" style={S.fileLink}>
              📎 Open attachment
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

function GradeCard({ item, onSave }) {
  const [grade, setGrade] = useState(item.grade || "");
  const [feedback, setFeedback] = useState(item.feedback || "");
  return (
    <div style={S.gradeCard}>
      <div style={S.gradeCardHead} className="t-grade-head">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={S.gradeAvatar}>
            {item.studentName
              ?.split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div>
            <p style={S.gradeName}>{item.studentName}</p>
            <p style={S.gradeMeta}>
              {item.studentClass} · {item.assignmentId?.subject}
            </p>
          </div>
        </div>
        <div
          style={{
            ...S.gradeStatusBadge,
            background: item.isGraded ? "#f0fdf4" : "#fff9db",
            color: item.isGraded ? "#0ca678" : "#f59f00",
            borderColor: item.isGraded ? "#bbf7d0" : "#fde68a",
          }}
        >
          {item.isGraded ? "Graded" : "Pending"}
        </div>
      </div>
      {item.content && <p style={S.gradeContent}>{item.content}</p>}
      {item.fileUrl && (
        <a href={item.fileUrl} target="_blank" style={S.fileLink}>
          📎 View submission file
        </a>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: 10,
          marginTop: 12,
        }}
        className="t-grade-inputs"
      >
        <FormField label="Grade">
          <input
            style={S.input}
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            placeholder="e.g. 8/10"
          />
        </FormField>
        <FormField label="Feedback">
          <textarea
            style={{ ...S.input, resize: "vertical" }}
            rows={2}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Optional feedback…"
          />
        </FormField>
      </div>
      <button
        onClick={() => onSave(item._id, grade, feedback)}
        style={{
          ...S.btnPrimary,
          marginTop: 10,
          width: "100%",
          justifyContent: "center",
        }}
      >
        Save Grade
      </button>
    </div>
  );
}

function EmptyState({ icon, msg }) {
  return (
    <div style={{ textAlign: "center", padding: "32px 16px" }}>
      <div style={{ fontSize: 32, marginBottom: 10 }}>{icon}</div>
      <p style={{ fontSize: 14, color: "#94a3b8" }}>{msg}</p>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
  page: {
    display: "flex",
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily: "'Sora', sans-serif",
  },
  sidebar: {
    width: 240,
    minWidth: 240,
    background: "#0f172a",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    position: "sticky",
    top: 0,
    flexShrink: 0,
  },
  sidebarTop: {
    padding: "22px 18px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  logoRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 18 },
  logoIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    background: "#1e293b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  logoName: {
    fontSize: 14,
    fontWeight: 700,
    color: "#f1f5f9",
    letterSpacing: "-0.02em",
  },
  logoSub: { fontSize: 11, color: "#475569", marginTop: 1 },
  teacherInfo: { display: "flex", alignItems: "center", gap: 10 },
  teacherAvatar: {
    width: 38,
    height: 38,
    borderRadius: 10,
    background: "#1e3a5f",
    color: "#93c5fd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 800,
    flexShrink: 0,
  },
  teacherName: { fontSize: 13, fontWeight: 700, color: "#e2e8f0" },
  teacherSubject: { fontSize: 11, color: "#475569", marginTop: 1 },
  sideNav: {
    flex: 1,
    padding: "12px 12px",
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  navSection: {
    fontSize: 10,
    fontWeight: 700,
    color: "#334155",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    padding: "4px 10px 10px",
  },
  sideFooter: {
    padding: "12px 12px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
  },

  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    zIndex: 40,
    backdropFilter: "blur(2px)",
  },
  drawer: {
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    width: 280,
    background: "#0f172a",
    zIndex: 50,
    display: "flex",
    flexDirection: "column",
  },
  drawerHead: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "18px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  drawerClose: {
    background: "none",
    border: "none",
    color: "#64748b",
    cursor: "pointer",
    padding: 4,
    marginLeft: "auto",
  },

  main: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0 },
  topbar: {
    background: "white",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 20,
    padding: "14px 28px",
  },
  breadcrumb: {
    fontSize: 10,
    fontWeight: 700,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 800,
    color: "#0f172a",
    letterSpacing: "-0.02em",
    marginTop: 1,
  },
  classBadge: {
    fontSize: 11,
    fontWeight: 700,
    color: "#3b5bdb",
    background: "#eff2ff",
    padding: "5px 10px",
    borderRadius: 7,
    border: "1px solid #c5d0f0",
  },

  mobileTabStrip: {
    display: "none",
    overflowX: "auto",
    padding: "10px 16px",
    gap: 6,
    background: "white",
    borderBottom: "1px solid #e2e8f0",
  },

  body: { flex: 1, padding: "24px 28px 40px" },

  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 },
  statCard: {
    background: "white",
    border: "1px solid",
    borderRadius: 14,
    padding: "16px 18px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  },
  statValue: {
    fontSize: 28,
    fontWeight: 900,
    fontFamily: "'JetBrains Mono', monospace",
    width: "fit-content",
    padding: "2px 8px",
    borderRadius: 7,
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
  },

  card: {
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: 16,
    padding: "20px 22px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
  },
  formGrid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  input: {
    width: "100%",
    padding: "11px 14px",
    borderRadius: 10,
    border: "1px solid #e2e8f0",
    fontSize: 14,
    color: "#0f172a",
    background: "#f8fafc",
    fontFamily: "'Sora', sans-serif",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s, box-shadow 0.15s",
  },
  fileWrap: {
    border: "1.5px dashed #cbd5e1",
    borderRadius: 10,
    padding: "11px 14px",
    background: "#f8fafc",
  },
  btnPrimary: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    padding: "10px 20px",
    borderRadius: 10,
    border: "none",
    background: "#3b5bdb",
    color: "white",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Sora', sans-serif",
    transition: "all 0.15s",
  },

  assignCard: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: "14px 16px",
  },
  assignTitle: { fontSize: 14, fontWeight: 700, color: "#0f172a" },
  assignMeta: { fontSize: 12, color: "#64748b", marginTop: 2 },
  assignDesc: { fontSize: 13, color: "#475569", lineHeight: 1.55 },
  deadlineBadge: {
    fontSize: 11,
    fontWeight: 700,
    color: "#e03131",
    background: "#fff0f0",
    padding: "4px 9px",
    borderRadius: 6,
    whiteSpace: "nowrap",
    height: "fit-content",
  },
  fileLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    fontSize: 12,
    fontWeight: 600,
    color: "#3b5bdb",
    marginTop: 8,
    textDecoration: "none",
  },

  gradeCard: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 14,
    padding: "16px 18px",
  },
  gradeCardHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 8,
    flexWrap: "wrap",
  },
  gradeAvatar: {
    width: 36,
    height: 36,
    borderRadius: 9,
    background: "#1e293b",
    color: "#94a3b8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 800,
    flexShrink: 0,
  },
  gradeName: { fontSize: 14, fontWeight: 700, color: "#0f172a" },
  gradeMeta: { fontSize: 12, color: "#64748b", marginTop: 1 },
  gradeStatusBadge: {
    fontSize: 11,
    fontWeight: 700,
    padding: "4px 10px",
    borderRadius: 7,
    border: "1px solid",
  },
  gradeContent: {
    fontSize: 13,
    color: "#475569",
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    padding: "10px 12px",
    marginBottom: 8,
    lineHeight: 1.55,
  },

  studentRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 14px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
  },
  studentAvatar: {
    width: 38,
    height: 38,
    borderRadius: 10,
    background: "#1e293b",
    color: "#94a3b8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 800,
    flexShrink: 0,
  },
  studentName: { fontSize: 14, fontWeight: 700, color: "#0f172a" },
  studentMeta: { fontSize: 12, color: "#64748b", marginTop: 1 },
  classPill: {
    display: "inline-block",
    fontSize: 11,
    fontWeight: 700,
    color: "#3b5bdb",
    background: "#eff2ff",
    padding: "3px 8px",
    borderRadius: 6,
  },
  admNo: { fontSize: 11, color: "#94a3b8", marginTop: 3 },

  noticeCard: {
    display: "flex",
    gap: 12,
    padding: "14px 16px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
  },
  noticeDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#3b5bdb",
    marginTop: 5,
    flexShrink: 0,
  },
  noticeTitle: { fontSize: 14, fontWeight: 700, color: "#0f172a" },
  noticeMsg: { fontSize: 13, color: "#475569", marginTop: 3, lineHeight: 1.5 },
  noticeClasses: {
    fontSize: 11,
    fontWeight: 700,
    color: "#3b5bdb",
    marginTop: 5,
  },

  dayHeader: {
    fontSize: 13,
    fontWeight: 800,
    color: "#0f172a",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  periodCard: { border: "1px solid", borderRadius: 10, padding: "12px 14px" },
  periodBadge: {
    fontSize: 11,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  periodFieldLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    marginBottom: 4,
  },
  selectSmall: {
    padding: "5px 8px",
    borderRadius: 7,
    border: "1px solid #e2e8f0",
    fontSize: 12,
    fontFamily: "'Sora', sans-serif",
    cursor: "pointer",
    background: "white",
  },
  inputSm: {
    width: "100%",
    padding: "7px 10px",
    borderRadius: 8,
    border: "1px solid #e2e8f0",
    fontSize: 12,
    fontFamily: "'Sora', sans-serif",
    background: "white",
    outline: "none",
    boxSizing: "border-box",
  },

  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: {
    padding: "10px 12px",
    textAlign: "left",
    fontSize: 11,
    fontWeight: 700,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    borderBottom: "2px solid #e2e8f0",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "10px 12px",
    borderBottom: "1px solid #f1f5f9",
    verticalAlign: "top",
  },

  mobileBottomNav: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "white",
    borderTop: "1px solid #e2e8f0",
    zIndex: 30,
    display: "none",
    padding: "8px 0",
  },
  mobileNavItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
    background: "none",
    border: "none",
    cursor: "pointer",
    fontFamily: "'Sora', sans-serif",
    flex: 1,
    padding: "0 4px",
  },

  loadWrap: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    fontFamily: "'Sora', sans-serif",
    background: "#f8fafc",
  },
  spinner: {
    width: 36,
    height: 36,
    border: "3px solid #e2e8f0",
    borderTopColor: "#3b5bdb",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
  loadText: { fontSize: 14, color: "#64748b", fontWeight: 500 },
};

const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body > header, body > nav, nav.site-nav, header.site-header { display: none !important; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .t-nav-link {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 10px; width: 100%;
    font-size: 13px; font-weight: 500; color: #64748b;
    background: none; border: none; cursor: pointer;
    font-family: 'Sora', sans-serif; text-align: left;
    transition: all 0.15s ease;
  }
  .t-nav-link:hover { background: rgba(255,255,255,0.05); color: #cbd5e1; }
  .t-nav-active { background: rgba(59,91,219,0.2) !important; color: #a5b4fc !important; font-weight: 600; }

  .t-logout {
    display: flex; align-items: center; gap: 10px;
    width: 100%; padding: 10px 12px; border-radius: 10px;
    background: none; border: none; color: #ef4444; font-size: 13px; font-weight: 500;
    cursor: pointer; font-family: 'Sora', sans-serif; transition: background 0.15s;
  }
  .t-logout:hover { background: rgba(239,68,68,0.08); }

  .t-desktop-sidebar { display: flex !important; }
  .t-menu-btn { display: none !important; background: none; border: none; cursor: pointer; color: #0f172a; padding: 2px; }
  .t-bottom-nav { display: none !important; }
  .t-timetable-cards { display: none !important; }
  .t-timetable-table { display: block !important; }

  .t-tab-pill {
    padding: 7px 14px; border-radius: 20px; border: 1.5px solid #e2e8f0;
    background: white; font-size: 12px; font-weight: 600; color: #64748b;
    cursor: pointer; font-family: 'Sora', sans-serif; white-space: nowrap;
    transition: all 0.15s;
  }
  .t-tab-pill:hover { border-color: #3b5bdb; color: #3b5bdb; }
  .t-tab-pill-active { background: #3b5bdb !important; color: white !important; border-color: #3b5bdb !important; }

  input:focus, select:focus, textarea:focus {
    border-color: #3b5bdb !important;
    box-shadow: 0 0 0 3px rgba(59,91,219,0.1);
    background: white !important; outline: none;
  }

  @media (max-width: 900px) {
    .t-desktop-sidebar { display: none !important; }
    .t-menu-btn { display: flex !important; }
    .t-bottom-nav { display: flex !important; }
    .t-tab-strip { display: flex !important; }
    .t-body { padding: 16px 16px 90px !important; }
    .t-topbar { padding: 12px 16px !important; }
    .t-stats-grid { grid-template-columns: 1fr 1fr !important; }
    .t-form-grid-2 { grid-template-columns: 1fr !important; }
    .t-grade-head { flex-direction: column !important; align-items: flex-start !important; }
    .t-grade-inputs { grid-template-columns: 1fr !important; }
    .t-timetable-cards { display: grid !important; gap: 14px; }
    .t-timetable-table { display: none !important; }
  }
`;
