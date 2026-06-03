"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CLASSES = ["JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"];
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
    const res = await fetch("/api/admin/results/publications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, isPublished }),
    });
    const json = await res.json();
    setSaving(false);
    if (!json.success) return toast.error(json.message || "Could not update publication");
    toast.success(json.message);
    load();
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0c1a2e] px-4 py-4 md:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-200">Admin Portal</p>
          <h1 className="text-xl font-black text-white">Result Publication</h1>
        </div>
        <a href="/admin" className="rounded-md bg-white/10 px-4 py-2 text-sm font-bold text-blue-50">Back to Admin</a>
      </div>

      <main className="grid gap-5 p-4 md:p-8">
        <section className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-black">Publish or Unpublish Results</h2>
          <div className="grid gap-3 md:grid-cols-3">
            <input className="input" value={form.academicSession} onChange={(e) => setForm({ ...form, academicSession: e.target.value })} />
            <select className="input" value={form.term} onChange={(e) => setForm({ ...form, term: e.target.value })}>{TERMS.map((term) => <option key={term}>{term}</option>)}</select>
            <select className="input" value={form.className} onChange={(e) => setForm({ ...form, className: e.target.value })}>{CLASSES.map((item) => <option key={item}>{item}</option>)}</select>
          </div>
          <div className="flex flex-wrap gap-2">
            <button disabled={saving} className="rounded-md bg-green-600 px-4 py-2 text-sm font-black text-white" onClick={() => setPublished(true)}>Publish Results</button>
            <button disabled={saving} className="rounded-md bg-red-600 px-4 py-2 text-sm font-black text-white" onClick={() => setPublished(false)}>Unpublish Results</button>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="mb-3 text-lg font-black">Publication History</h2>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-[760px] w-full text-sm">
              <thead className="bg-slate-100 text-left text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="p-3">Class</th>
                  <th className="p-3">Session</th>
                  <th className="p-3">Term</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Updated</th>
                </tr>
              </thead>
              <tbody>
                {publications.map((item) => (
                  <tr key={item._id} className="border-t border-slate-100">
                    <td className="p-3 font-bold">{item.className}</td>
                    <td className="p-3">{item.academicSession}</td>
                    <td className="p-3">{item.term}</td>
                    <td className="p-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-black ${item.isPublished ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                        {item.isPublished ? "Published" : "Unpublished"}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">{new Date(item.updatedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!publications.length && <div className="p-8 text-center text-sm text-slate-500">No publication records yet.</div>}
          </div>
        </section>
      </main>

      <style jsx global>{`
        .input { width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px 12px; font-size: 14px; outline: none; background: white; }
        .input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12); }
        button:disabled { opacity: 0.65; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
