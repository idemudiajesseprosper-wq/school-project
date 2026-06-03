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
    doc.text("Subject", 14, y);
    doc.text("CA", 82, y);
    doc.text("Exam", 104, y);
    doc.text("Total", 130, y);
    doc.text("Grade", 158, y);
    doc.setFont(undefined, "normal");
    y += 7;

    student.subjects.forEach((item) => {
      doc.text(item.subject, 14, y);
      doc.text(String(item.caScore), 84, y);
      doc.text(String(item.examScore), 108, y);
      doc.text(String(item.totalScore), 134, y);
      doc.text(item.grade, 162, y);
      y += 7;
    });

    y += 8;
    doc.text(`Total Score: ${student.totalScore}`, 14, y);
    doc.text(`Average: ${student.averageScore}%`, 70, y);
    doc.text(`Overall Grade: ${student.overallGrade}`, 124, y);
    y += 10;
    doc.text(`Attendance: ${student.attendance || "N/A"}`, 14, y);
    y += 10;
    doc.text(`Class Teacher Remark: ${student.classTeacherRemark || ""}`, 14, y, { maxWidth: 180 });
    y += 16;
    doc.text(`Principal Remark: ${student.principalRemark || ""}`, 14, y, { maxWidth: 180 });

    doc.save(`${student.admissionNumber.replaceAll("/", "-")}-report-card.pdf`);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="border-b border-slate-200 bg-white px-4 py-4 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Student Portal</p>
            <h1 className="text-2xl font-black">My Results</h1>
          </div>
          <a className="rounded-md bg-slate-900 px-4 py-2 text-sm font-bold text-white" href="/student">Back to Dashboard</a>
        </div>
      </div>

      <main className="grid gap-5 p-4 md:p-8">
        <section className="grid gap-3 rounded-lg border border-slate-200 bg-white p-5 md:grid-cols-[1fr_1fr_auto]">
          <input className="input" value={filters.academicSession} onChange={(e) => setFilters({ ...filters, academicSession: e.target.value })} />
          <select className="input" value={filters.term} onChange={(e) => setFilters({ ...filters, term: e.target.value })}>{TERMS.map((term) => <option key={term}>{term}</option>)}</select>
          <button disabled={loading} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-black text-white" onClick={loadResult}>{loading ? "Loading..." : "View Results"}</button>
        </section>

        {result && <ReportCard result={result} onPdf={downloadPdf} />}
      </main>

      <style jsx global>{`
        .input { width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px 12px; font-size: 14px; outline: none; background: white; }
        .input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12); }
        @media print {
          body * { visibility: hidden; }
          #report-card, #report-card * { visibility: visible; }
          #report-card { position: absolute; inset: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
}

function ReportCard({ result, onPdf }) {
  const student = result.student;
  return (
    <section id="report-card" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="no-print mb-4 flex flex-wrap justify-end gap-2">
        <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-black text-white" onClick={onPdf}>Download PDF Report Card</button>
        <button className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-black" onClick={() => window.print()}>Print Report Card</button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <img src={result.schoolLogo} alt="School Logo" className="h-14 w-14 rounded-md object-contain" />
          <div>
            <h2 className="text-xl font-black">{result.schoolName}</h2>
            <p className="text-sm font-bold text-slate-500">Professional Student Report Card</p>
          </div>
        </div>
        <div className="h-20 w-20 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
          {student.passport ? <img src={student.passport} alt={student.studentName} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-xs font-bold text-slate-400">Passport</div>}
        </div>
      </div>

      <div className="grid gap-3 py-4 text-sm md:grid-cols-3">
        <Info label="Student Name" value={student.studentName} />
        <Info label="Admission Number" value={student.admissionNumber} />
        <Info label="Class" value={result.className} />
        <Info label="Session" value={result.academicSession} />
        <Info label="Term" value={result.term} />
        <Info label="Position" value={student.position} />
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-[680px] w-full text-sm">
          <thead className="bg-slate-100 text-left text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="p-3">Subject</th>
              <th className="p-3">CA</th>
              <th className="p-3">Exam</th>
              <th className="p-3">Total</th>
              <th className="p-3">Grade</th>
            </tr>
          </thead>
          <tbody>
            {student.subjects.map((item) => (
              <tr key={item.subject} className="border-t border-slate-100">
                <td className="p-3 font-bold">{item.subject}</td>
                <td className="p-3">{item.caScore}</td>
                <td className="p-3">{item.examScore}</td>
                <td className="p-3 font-bold">{item.totalScore}</td>
                <td className="p-3">{item.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <Info label="Total Score" value={student.totalScore} />
        <Info label="Average" value={`${student.averageScore}%`} />
        <Info label="Overall Grade" value={student.overallGrade} />
        <Info label="Attendance" value={student.attendance || "N/A"} />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Remark title="Class Teacher Remark" text={student.classTeacherRemark} />
        <Remark title="Principal Remark" text={student.principalRemark || "N/A"} />
      </div>
    </section>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-md bg-slate-50 p-3">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 font-black">{value}</p>
    </div>
  );
}

function Remark({ title, text }) {
  return (
    <div className="rounded-md border border-slate-200 p-3">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</p>
      <p className="mt-2 text-sm leading-6">{text}</p>
    </div>
  );
}
