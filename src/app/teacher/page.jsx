"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const TABS = ["Overview", "Assignments", "Submissions", "Students", "Announcements", "Timetable"];

const emptyPeriods = () =>
  Array.from({ length: 8 }, (_, index) => ({
    periodNumber: index + 1,
    type: "subject",
    subject: "",
    teacherName: "",
    startTime: "",
    endTime: "",
  }));

const emptyDays = () => DAYS.map((day) => ({ day, periods: emptyPeriods() }));

export default function TeacherDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState("Overview");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState(null);
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
  const submissions = data?.submissions || [];

  const stats = useMemo(() => ({
    students: data?.students?.length || 0,
    assignments: data?.assignments?.length || 0,
    pending: submissions.filter((item) => !item.isGraded).length,
    graded: submissions.filter((item) => item.isGraded).length,
  }), [data, submissions]);

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!selectedClass && classes.length) setSelectedClass(classes[0]);
  }, [classes, selectedClass]);

  useEffect(() => {
    const existing = data?.timetables?.find((item) => item.class === selectedClass);
    setTimetable(existing?.days?.length ? existing.days : emptyDays());
  }, [data, selectedClass]);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/teacher/overview");
    const json = await res.json();

    if (!json.success) {
      router.push("/login/student");
      return;
    }

    setData(json);
    setLoading(false);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login/student");
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
    setSaving(true);

    try {
      const file = e.currentTarget.file.files[0];
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

      if (!json.success) return toast.error(json.message || "Could not create assignment");

      toast.success("Assignment posted");
      setAssignment({ title: "", subject: "", description: "", classes: [], deadline: "", fileUrl: "", fileName: "" });
      e.currentTarget.reset();
      load();
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

    if (!json.success) return toast.error(json.message || "Could not save grade");

    toast.success("Grade saved");
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

    if (!json.success) return toast.error(json.message || "Could not send announcement");

    toast.success("Announcement sent");
    setNotice({ title: "", message: "", classes: [] });
    load();
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

    if (!json.success) return toast.error(json.message || "Could not save timetable");

    toast.success("Timetable saved");
    load();
  }

  function toggleClass(key, className, setter) {
    setter((prev) => ({
      ...prev,
      [key]: prev[key].includes(className)
        ? prev[key].filter((item) => item !== className)
        : [...prev[key], className],
    }));
  }

  function updatePeriod(dayIndex, periodIndex, field, value) {
    setTimetable((prev) => prev.map((day, dIndex) => {
      if (dIndex !== dayIndex) return day;
      return {
        ...day,
        periods: day.periods.map((period, pIndex) =>
          pIndex === periodIndex ? { ...period, [field]: value } : period
        ),
      };
    }));
  }

  if (loading) {
    return <div className="min-h-screen bg-slate-50 p-8">Loading teacher dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <style>{`
        body > header, body > nav, nav.site-nav, header.site-header { display: none !important; }
        .teacher-shell { display: grid; grid-template-columns: 260px 1fr; min-height: 100vh; }
        .teacher-side { background: #111827; color: white; padding: 24px 18px; }
        .teacher-main { padding: 28px; min-width: 0; }
        .card { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; }
        .grid-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
        .grid-2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
        .field { display: grid; gap: 6px; }
        .field label { font-size: 12px; font-weight: 700; color: #475569; }
        .field input, .field select, .field textarea { width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px 12px; font-size: 14px; background: white; }
        .btn { border: 0; border-radius: 8px; padding: 10px 14px; font-weight: 700; cursor: pointer; }
        .btn-primary { background: #2563eb; color: white; }
        .btn-dark { background: #0f172a; color: white; }
        .btn-soft { background: #eff6ff; color: #1d4ed8; }
        .table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; font-size: 14px; }
        th, td { border-bottom: 1px solid #e2e8f0; padding: 10px; text-align: left; vertical-align: top; }
        th { font-size: 12px; text-transform: uppercase; color: #64748b; }
        @media (max-width: 900px) {
          .teacher-shell { grid-template-columns: 1fr; }
          .teacher-side { position: static; }
          .teacher-main { padding: 18px; }
          .grid-stats, .grid-2 { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="teacher-shell">
        <aside className="teacher-side">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-blue-300">Teacher Portal</p>
            <h1 className="mt-2 text-2xl font-black">{data.teacher.fullName}</h1>
            <p className="mt-1 text-sm text-slate-300">{data.teacher.subject || "Teacher"}</p>
          </div>

          <nav className="grid gap-2">
            {TABS.map((item) => (
              <button
                key={item}
                onClick={() => setTab(item)}
                className="btn"
                style={{
                  textAlign: "left",
                  background: tab === item ? "#2563eb" : "transparent",
                  color: tab === item ? "white" : "#cbd5e1",
                }}
              >
                {item}
              </button>
            ))}
          </nav>

          <button className="btn mt-8 w-full bg-red-500 text-white" onClick={logout}>Sign Out</button>
        </aside>

        <main className="teacher-main">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-blue-600">{classes.join(", ") || "No assigned classes yet"}</p>
              <h2 className="text-3xl font-black">{tab}</h2>
            </div>
          </div>

          {tab === "Overview" && (
            <section className="grid gap-5">
              <div className="grid-stats">
                <Stat label="Students" value={stats.students} />
                <Stat label="Assignments" value={stats.assignments} />
                <Stat label="Pending Grades" value={stats.pending} />
                <Stat label="Graded" value={stats.graded} />
              </div>
              <div className="card">
                <h3 className="mb-3 text-lg font-black">Recent assignments</h3>
                <AssignmentList assignments={data.assignments || []} />
              </div>
            </section>
          )}

          {tab === "Assignments" && (
            <section className="grid gap-5">
              <form className="card grid gap-4" onSubmit={createAssignment}>
                <div className="grid-2">
                  <Field label="Title"><input value={assignment.title} onChange={(e) => setAssignment({ ...assignment, title: e.target.value })} /></Field>
                  <Field label="Subject"><input value={assignment.subject} onChange={(e) => setAssignment({ ...assignment, subject: e.target.value })} /></Field>
                </div>
                <Field label="Description"><textarea rows={4} value={assignment.description} onChange={(e) => setAssignment({ ...assignment, description: e.target.value })} /></Field>
                <div className="grid-2">
                  <Field label="Deadline"><input type="datetime-local" value={assignment.deadline} onChange={(e) => setAssignment({ ...assignment, deadline: e.target.value })} /></Field>
                  <Field label="Attachment"><input name="file" type="file" /></Field>
                </div>
                <ClassChecks classes={classes} selected={assignment.classes} onToggle={(className) => toggleClass("classes", className, setAssignment)} />
                <button className="btn btn-primary w-fit" disabled={saving}>{saving ? "Posting..." : "Post assignment"}</button>
              </form>
              <div className="card">
                <AssignmentList assignments={data.assignments || []} />
              </div>
            </section>
          )}

          {tab === "Submissions" && (
            <section className="card table-wrap">
              <table>
                <thead><tr><th>Student</th><th>Assignment</th><th>Submission</th><th>Grade</th><th>Feedback</th><th /></tr></thead>
                <tbody>
                  {submissions.map((item) => <GradeRow key={item._id} item={item} onSave={gradeSubmission} />)}
                  {!submissions.length && <tr><td colSpan="6">No submissions yet.</td></tr>}
                </tbody>
              </table>
            </section>
          )}

          {tab === "Students" && (
            <section className="card table-wrap">
              <table>
                <thead><tr><th>Name</th><th>Class</th><th>Email</th><th>Admission No.</th><th>Phone</th></tr></thead>
                <tbody>
                  {(data.students || []).map((student) => (
                    <tr key={student._id}>
                      <td>{student.fullName}</td>
                      <td>{student.studentClass}</td>
                      <td>{student.email}</td>
                      <td>{student.admissionNumber || "-"}</td>
                      <td>{student.phoneNumber || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {tab === "Announcements" && (
            <section className="grid gap-5">
              <form className="card grid gap-4" onSubmit={sendNotice}>
                <Field label="Title"><input value={notice.title} onChange={(e) => setNotice({ ...notice, title: e.target.value })} /></Field>
                <Field label="Message"><textarea rows={4} value={notice.message} onChange={(e) => setNotice({ ...notice, message: e.target.value })} /></Field>
                <ClassChecks classes={classes} selected={notice.classes} onToggle={(className) => toggleClass("classes", className, setNotice)} />
                <button className="btn btn-primary w-fit" disabled={saving}>{saving ? "Sending..." : "Send announcement"}</button>
              </form>
              <div className="grid gap-3">
                {(data.notices || []).map((item) => (
                  <article className="card" key={item._id}>
                    <p className="font-black">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{item.message}</p>
                    <p className="mt-2 text-xs font-bold text-blue-600">{item.classes?.join(", ")}</p>
                  </article>
                ))}
              </div>
            </section>
          )}

          {tab === "Timetable" && (
            <section className="grid gap-4">
              <div className="card flex flex-wrap items-center justify-between gap-3">
                <Field label="Class">
                  <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                    {classes.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </Field>
                <button className="btn btn-primary" onClick={saveTimetable} disabled={saving}>{saving ? "Saving..." : "Save timetable"}</button>
              </div>
              <div className="card table-wrap">
                <table>
                  <thead><tr><th>Day</th>{Array.from({ length: 8 }, (_, i) => <th key={i}>Period {i + 1}</th>)}</tr></thead>
                  <tbody>
                    {timetable.map((day, dayIndex) => (
                      <tr key={day.day}>
                        <th>{day.day}</th>
                        {day.periods.map((period, periodIndex) => (
                          <td key={periodIndex} style={{ minWidth: 180 }}>
                            <select value={period.type} onChange={(e) => updatePeriod(dayIndex, periodIndex, "type", e.target.value)}>
                              <option value="subject">Subject</option>
                              <option value="break">Break</option>
                              <option value="assembly">Assembly</option>
                            </select>
                            <input className="mt-2" type="time" value={period.startTime || ""} onChange={(e) => updatePeriod(dayIndex, periodIndex, "startTime", e.target.value)} />
                            <input className="mt-2" type="time" value={period.endTime || ""} onChange={(e) => updatePeriod(dayIndex, periodIndex, "endTime", e.target.value)} />
                            {period.type === "subject" && (
                              <input className="mt-2" placeholder="Subject" value={period.subject || ""} onChange={(e) => updatePeriod(dayIndex, periodIndex, "subject", e.target.value)} />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="card">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}

function Field({ label, children }) {
  return <label className="field"><span>{label}</span>{children}</label>;
}

function ClassChecks({ classes, selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {classes.map((className) => (
        <button
          key={className}
          type="button"
          className={`btn ${selected.includes(className) ? "btn-dark" : "btn-soft"}`}
          onClick={() => onToggle(className)}
        >
          {className}
        </button>
      ))}
    </div>
  );
}

function AssignmentList({ assignments }) {
  if (!assignments.length) return <p className="text-sm text-slate-500">No assignments yet.</p>;

  return (
    <div className="grid gap-3">
      {assignments.map((item) => (
        <article key={item._id} className="rounded-lg border border-slate-200 p-4">
          <div className="flex flex-wrap justify-between gap-2">
            <div>
              <h4 className="font-black">{item.title}</h4>
              <p className="text-sm text-slate-600">{item.subject} • {item.classes?.join(", ")}</p>
            </div>
            <p className="text-sm font-bold text-red-600">Due {new Date(item.deadline).toLocaleString()}</p>
          </div>
          <p className="mt-2 text-sm text-slate-700">{item.description}</p>
          {item.fileUrl && <a className="mt-2 inline-block text-sm font-bold text-blue-600" href={item.fileUrl} target="_blank">Open attachment</a>}
        </article>
      ))}
    </div>
  );
}

function GradeRow({ item, onSave }) {
  const [grade, setGrade] = useState(item.grade || "");
  const [feedback, setFeedback] = useState(item.feedback || "");

  return (
    <tr>
      <td>{item.studentName}<br /><span className="text-xs text-slate-500">{item.studentClass}</span></td>
      <td>{item.assignmentId?.title}<br /><span className="text-xs text-slate-500">{item.assignmentId?.subject}</span></td>
      <td>
        <p>{item.content || "-"}</p>
        {item.fileUrl && <a className="text-blue-600 font-bold" href={item.fileUrl} target="_blank">Open file</a>}
      </td>
      <td><input value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="e.g. 8/10" /></td>
      <td><textarea rows={2} value={feedback} onChange={(e) => setFeedback(e.target.value)} /></td>
      <td><button className="btn btn-primary" onClick={() => onSave(item._id, grade, feedback)}>Save</button></td>
    </tr>
  );
}
