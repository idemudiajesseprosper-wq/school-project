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

  const submissionsByAssignment = useMemo(() => {
    return Object.fromEntries((data.submissions || []).map((item) => [item.assignmentId, item]));
  }, [data.submissions]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await fetch("/api/student/assignments");
    const json = await res.json();

    if (!json.success) {
      router.push("/login/student");
      return;
    }

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

      toast.success("Assignment submitted");
      e.currentTarget.reset();
      load();
    } catch (error) {
      toast.error(error.message || "Could not submit");
    } finally {
      setSavingId("");
    }
  }

  if (loading) return <div className="min-h-screen bg-slate-50 p-8">Loading assignments...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 text-slate-950 md:p-8">
      <style>{`
        body > header, body > nav, nav.site-nav, header.site-header { display: none !important; }
        .portal-wrap { max-width: 1050px; margin: 0 auto; }
        .card { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; }
        .field { display: grid; gap: 6px; }
        .field textarea, .field input { width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px 12px; font-size: 14px; }
        .btn { border: 0; border-radius: 8px; padding: 10px 14px; font-weight: 700; cursor: pointer; background: #2563eb; color: white; }
      `}</style>

      <main className="portal-wrap grid gap-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-blue-600">Student Portal</p>
            <h1 className="text-3xl font-black">Assignments</h1>
          </div>
          <a className="font-bold text-blue-600" href="/student">Back to dashboard</a>
        </div>

        {(data.notices || []).length > 0 && (
          <section className="grid gap-3">
            <h2 className="text-lg font-black">Class announcements</h2>
            {data.notices.map((item) => (
              <article className="card" key={item._id}>
                <p className="font-black">{item.title}</p>
                <p className="mt-1 text-sm text-slate-600">{item.message}</p>
                <p className="mt-2 text-xs font-bold text-slate-500">{item.teacherName}</p>
              </article>
            ))}
          </section>
        )}

        <section className="grid gap-4">
          {(data.assignments || []).map((assignment) => {
            const submission = submissionsByAssignment[assignment._id];
            const overdue = new Date(assignment.deadline) < new Date();

            return (
              <article className="card" key={assignment._id}>
                <div className="flex flex-wrap justify-between gap-2">
                  <div>
                    <h2 className="text-xl font-black">{assignment.title}</h2>
                    <p className="text-sm text-slate-600">{assignment.subject} by {assignment.teacherName}</p>
                  </div>
                  <p className={`text-sm font-bold ${overdue ? "text-red-600" : "text-blue-600"}`}>
                    Due {new Date(assignment.deadline).toLocaleString()}
                  </p>
                </div>
                <p className="mt-3 text-sm text-slate-700">{assignment.description}</p>
                {assignment.fileUrl && <a className="mt-2 inline-block text-sm font-bold text-blue-600" href={assignment.fileUrl} target="_blank">Open teacher file</a>}

                {submission && (
                  <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm">
                    <p className="font-bold">Submitted</p>
                    {submission.fileUrl && <a className="text-blue-600 font-bold" href={submission.fileUrl} target="_blank">Open your file</a>}
                    <p className="mt-2"><strong>Grade:</strong> {submission.isGraded ? submission.grade : "Not graded yet"}</p>
                    {submission.feedback && <p><strong>Feedback:</strong> {submission.feedback}</p>}
                  </div>
                )}

                {!overdue && (
                  <form className="mt-4 grid gap-3" onSubmit={(e) => submitAssignment(e, assignment._id)}>
                    <label className="field">
                      <span className="text-xs font-bold uppercase text-slate-500">Answer / notes</span>
                      <textarea rows={4} value={drafts[assignment._id] || ""} onChange={(e) => setDrafts({ ...drafts, [assignment._id]: e.target.value })} />
                    </label>
                    <label className="field">
                      <span className="text-xs font-bold uppercase text-slate-500">Upload file</span>
                      <input name="file" type="file" />
                    </label>
                    <button className="btn w-fit" disabled={savingId === assignment._id}>
                      {savingId === assignment._id ? "Submitting..." : submission ? "Update submission" : "Submit assignment"}
                    </button>
                  </form>
                )}
              </article>
            );
          })}
          {!data.assignments?.length && <div className="card">No assignments for your class yet.</div>}
        </section>
      </main>
    </div>
  );
}
