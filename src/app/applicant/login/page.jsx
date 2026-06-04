"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ApplicantLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, role: "applicant" }),
    });
    const json = await res.json();
    setLoading(false);
    if (!json.success) return toast.error(json.message || "Login failed");
    router.push("/applicant");
  }

  return (
    <main className="min-h-screen bg-red-950 px-4 py-20 text-white">
      <style jsx global>{`
        .auth-input { width: 100%; border: 1px solid rgba(255,255,255,.18); border-radius: 10px; background: rgba(255,255,255,.08); color: white; padding: 13px 14px; outline: none; }
        .auth-input::placeholder { color: rgba(255,255,255,.5); }
        .auth-input:focus { border-color: white; box-shadow: 0 0 0 3px rgba(255,255,255,.12); }
        .auth-btn { border: 0; border-radius: 10px; background: white; color: #7f1d1d; padding: 13px 16px; font-weight: 900; cursor: pointer; }
        .auth-btn:disabled { opacity: .7; cursor: not-allowed; }
      `}</style>
      <section className="mx-auto max-w-md rounded-2xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur">
        <div className="mb-6 text-center">
          <img src="/logo.PNG" alt="School Logo" className="mx-auto mb-3 h-14 w-14 object-contain" />
          <p className="text-xs font-black uppercase tracking-[0.2em] text-red-100">Applicant Portal</p>
          <h1 className="mt-2 text-3xl font-black">Welcome Back</h1>
          <p className="mt-2 text-sm text-red-100/70">Login after verifying your email.</p>
        </div>
        <form onSubmit={submit} className="grid gap-3">
          <input className="auth-input" type="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="auth-input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button disabled={loading} className="auth-btn">{loading ? "Signing in..." : "Login"}</button>
        </form>
        <p className="mt-4 text-center text-sm text-red-100/70">
          New applicant? <a className="font-bold text-white" href="/applicant/register">Create account</a>
        </p>
      </section>
    </main>
  );
}
