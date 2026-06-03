"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const CLASSES = ["JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"];
const TERMS = ["First Term", "Second Term", "Third Term"];

function currentSession() {
  const year = new Date().getFullYear();
  return `${year}/${year + 1}`;
}

export default function TeacherResultsPage() {
  const router = useRouter();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [batches, setBatches] = useState([]);
  const [compiled, setCompiled] = useState(null);
  const [remarks, setRemarks] = useState([]);
  const [upload, setUpload] = useState({
    academicSession: currentSession(),
    term: "First Term",
    className: "",
    subject: "",
    file: null,
  });
  const [filters, setFilters] = useState({
    academicSession: currentSession(),
    term: "First Term",
    className: "",
  });

  const subjects = useMemo(() => {
    const list = [teacher?.subject, ...(teacher?.assignedSubjects || [])].filter(Boolean);
    return [...new Set(list)];
  }, [teacher]);

  useEffect(() => {
    loadTeacher();
  }, []);

  useEffect(() => {
    if (teacher) {
      const firstClass = teacher.assignedClasses?.[0] || "";
      const firstSubject = subjects[0] || teacher.subject || "";
      setUpload((prev) => ({ ...prev, className: firstClass, subject: firstSubject }));
      setFilters((prev) => ({ ...prev, className: firstClass }));
      loadBatches();
    }
  }, [teacher, subjects]);

  async function loadTeacher() {
    const res = await fetch("/api/teacher/overview");
    const json = await res.json();
    if (!json.success) {
      router.push("/login/student");
      return;
    }
    setTeacher(json.teacher);
    setLoading(false);
  }

  async function loadBatches() {
    const res = await fetch("/api/teacher/results");
    const json = await res.json();
    if (json.success) setBatches(json.batches || []);
  }

  async function submitUpload(method) {
    if (!upload.file) return toast.error("Select an Excel .xlsx file");
    const body = new FormData();
    for (const key of ["academicSession", "term", "className", "subject"]) {
      body.append(key, upload[key]);
    }
    body.append("file", upload.file);

    setSaving(true);
    const res = await fetch("/api/teacher/results", { method, body });
    const json = await res.json();
    setSaving(false);

    if (!json.success) {
      toast.error(json.message || "Upload failed");
      if (json.errors?.length) {
        console.table(json.errors);
        toast.error(`${json.errors.length} validation issue(s). Check the console.`);
      }
      return;
    }

    toast.success(json.message);
    setUpload((prev) => ({ ...prev, file: null }));
    loadBatches();
  }

  async function loadCompiled() {
    const params = new URLSearchParams(filters);
    const res = await fetch(`/api/teacher/class-results?${params}`);
    const json = await res.json();
    if (!json.success) return toast.error(json.message || "Could not load results");
    setCompiled(json.result);
    setRemarks(json.result.students.map((student) => ({
      studentId: student.studentId,
      classTeacherRemark: student.classTeacherRemark,
      principalRemark: student.principalRemark,
      attendance: student.attendance,
    })));
  }

  async function saveRemarks() {
    setSaving(true);
    const res = await fetch("/api/teacher/class-results", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...filters, remarks }),
    });
    const json = await res.json();
    setSaving(false);
    if (!json.success) return toast.error(json.message || "Could not save remarks");
    toast.success("Remarks saved");
    loadCompiled();
  }

  function updateRemark(studentId, key, value) {
    setRemarks((prev) =>
      prev.map((item) => (item.studentId === studentId ? { ...item, [key]: value } : item))
    );
  }

  if (loading) {
    return <div className="min-h-screen bg-slate-50 p-8 text-sm text-slate-500">Loading results workspace...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="border-b border-slate-200 bg-white px-4 py-4 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Teacher Portal</p>
            <h1 className="text-2xl font-black">Result Management</h1>
            <p className="text-sm text-slate-500">{teacher?.fullName} - {teacher?.subject || "Subject Teacher"}</p>
          </div>
          <a className="rounded-md bg-slate-900 px-4 py-2 text-sm font-bold text-white" href="/teacher">Back to Dashboard</a>
        </div>
      </div>

      <main className="grid gap-5 p-4 md:p-8">
        <section className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5">
          <div>
            <h2 className="text-lg font-black">Subject Teacher Upload</h2>
            <p className="text-sm text-slate-500">Template columns: Admission Number, Student Name, CA Score, Exam Score.</p>
          </div>

          <div className="grid gap-3 md:grid-cols-5">
            <Field label="Academic Session">
              <input className="input" value={upload.academicSession} onChange={(e) => setUpload({ ...upload, academicSession: e.target.value })} />
            </Field>
            <Field label="Term">
              <select className="input" value={upload.term} onChange={(e) => setUpload({ ...upload, term: e.target.value })}>
                {TERMS.map((term) => <option key={term}>{term}</option>)}
              </select>
            </Field>
            <Field label="Class">
              <select className="input" value={upload.className} onChange={(e) => setUpload({ ...upload, className: e.target.value })}>
                {(teacher.assignedClasses?.length ? teacher.assignedClasses : CLASSES).map((item) => <option key={item}>{item}</option>)}
              </select>
            </Field>
            <Field label="Subject">
              <select className="input" value={upload.subject} onChange={(e) => setUpload({ ...upload, subject: e.target.value })}>
                {(subjects.length ? subjects : [teacher.subject]).filter(Boolean).map((item) => <option key={item}>{item}</option>)}
              </select>
            </Field>
            <Field label="Excel File">
              <input className="input file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1 file:text-blue-700" type="file" accept=".xlsx" onChange={(e) => setUpload({ ...upload, file: e.target.files?.[0] || null })} />
            </Field>
          </div>

          <div className="flex flex-wrap gap-2">
            <button disabled={saving} className="btn-primary" onClick={() => submitUpload("POST")}>Upload New Result</button>
            <button disabled={saving} className="btn-secondary" onClick={() => submitUpload("PATCH")}>Update Existing Scores</button>
          </div>
        </section>

        <section className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-black">Class Teacher Dashboard</h2>
              <p className="text-sm text-slate-500">Compile all uploaded subject results, positions, and remarks.</p>
            </div>
            <div className="grid gap-2 md:grid-cols-4">
              <input className="input" value={filters.academicSession} onChange={(e) => setFilters({ ...filters, academicSession: e.target.value })} />
              <select className="input" value={filters.term} onChange={(e) => setFilters({ ...filters, term: e.target.value })}>{TERMS.map((term) => <option key={term}>{term}</option>)}</select>
              <select className="input" value={filters.className} onChange={(e) => setFilters({ ...filters, className: e.target.value })}>{(teacher.assignedClasses || []).map((item) => <option key={item}>{item}</option>)}</select>
              <button className="btn-primary" onClick={loadCompiled}>Load Results</button>
            </div>
          </div>

          {compiled && (
            <div className="grid gap-4">
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="min-w-[960px] w-full text-sm">
                  <thead className="bg-slate-100 text-left text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="p-3">Position</th>
                      <th className="p-3">Student</th>
                      <th className="p-3">Admission No.</th>
                      <th className="p-3">Subjects</th>
                      <th className="p-3">Total</th>
                      <th className="p-3">Average</th>
                      <th className="p-3">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compiled.students.map((student) => (
                      <tr key={student.studentId} className="border-t border-slate-100">
                        <td className="p-3 font-black">{student.position}</td>
                        <td className="p-3 font-bold">{student.studentName}</td>
                        <td className="p-3 text-slate-500">{student.admissionNumber}</td>
                        <td className="p-3 text-slate-600">{student.subjects.map((item) => `${item.subject}: ${item.totalScore}${item.grade}`).join(", ") || "No scores"}</td>
                        <td className="p-3 font-bold">{student.totalScore}</td>
                        <td className="p-3">{student.averageScore}%</td>
                        <td className="p-3">{student.overallGrade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-3">
                <h3 className="font-black">Editable Remarks</h3>
                {compiled.students.map((student) => {
                  const remark = remarks.find((item) => item.studentId === student.studentId) || {};
                  return (
                    <div key={student.studentId} className="grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 md:grid-cols-[180px_1fr_1fr_140px]">
                      <div>
                        <p className="font-bold">{student.studentName}</p>
                        <p className="text-xs text-slate-500">Avg {student.averageScore}%</p>
                      </div>
                      <textarea className="input min-h-20" value={remark.classTeacherRemark || ""} onChange={(e) => updateRemark(student.studentId, "classTeacherRemark", e.target.value)} />
                      <textarea className="input min-h-20" placeholder="Principal remark" value={remark.principalRemark || ""} onChange={(e) => updateRemark(student.studentId, "principalRemark", e.target.value)} />
                      <input className="input" placeholder="Attendance" value={remark.attendance || ""} onChange={(e) => updateRemark(student.studentId, "attendance", e.target.value)} />
                    </div>
                  );
                })}
                <button disabled={saving} className="btn-primary w-fit" onClick={saveRemarks}>Save Remarks</button>
              </div>
            </div>
          )}
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="mb-3 text-lg font-black">My Uploaded Broadsheets</h2>
          <div className="grid gap-2 md:grid-cols-2">
            {batches.map((batch) => (
              <div key={batch._id} className="rounded-lg border border-slate-200 p-3 text-sm">
                <p className="font-bold">{batch.subject} - {batch.className}</p>
                <p className="text-slate-500">{batch.academicSession}, {batch.term} - {batch.scores?.length || 0} score(s)</p>
              </div>
            ))}
            {!batches.length && <p className="text-sm text-slate-500">No uploads yet.</p>}
          </div>
        </section>
      </main>

      <style jsx global>{`
        .input { width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px 12px; font-size: 14px; outline: none; background: white; }
        .input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12); }
        .btn-primary { border: 0; border-radius: 8px; background: #2563eb; color: white; padding: 10px 14px; font-size: 13px; font-weight: 800; cursor: pointer; }
        .btn-secondary { border: 1px solid #cbd5e1; border-radius: 8px; background: white; color: #0f172a; padding: 10px 14px; font-size: 13px; font-weight: 800; cursor: pointer; }
        button:disabled { opacity: 0.65; cursor: not-allowed; }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="grid gap-1 text-xs font-bold uppercase tracking-wider text-slate-500">
      {label}
      {children}
    </label>
  );
}
