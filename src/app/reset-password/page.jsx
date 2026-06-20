"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get("token") || "");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Reset link is missing or invalid");
      return;
    }

    if (!form.password || !form.confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: form.password }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message || "Password reset successful");
        router.push("/login/student");
      } else {
        toast.error(data.message || "Unable to reset password");
      }
    } catch {
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#f8fafc] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,0,0,0.05),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(0,0,0,0.04),transparent_40%)]" />

      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center">
              <img
                src="/logo.PNG"
                alt="School Logo"
                className="w-10 h-10 object-contain"
              />
            </div>
            <h1 className="mt-4 text-2xl font-semibold text-gray-900">
              Reset Password
            </h1>
            <p className="text-sm text-gray-500 mt-1 text-center">
              Choose a new password for your school portal account
            </p>
          </div>

          {!token ? (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-5">
                This reset link is missing a token. Please request a new link.
              </p>
              <Link
                href="/login/student"
                className="inline-flex justify-center w-full bg-black text-white py-3 rounded-xl font-medium tracking-wide hover:bg-gray-900 transition-all"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="peer w-full px-4 pt-5 pb-2 pr-20 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-black/10 transition"
                />
                <label className="absolute left-4 top-2 text-xs text-gray-400 transition-all">
                  New Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-black"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  className="peer w-full px-4 pt-5 pb-2 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-black/10 transition"
                />
                <label className="absolute left-4 top-2 text-xs text-gray-400 transition-all">
                  Confirm Password
                </label>
              </div>

              <button
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-xl font-medium tracking-wide hover:bg-gray-900 active:scale-[0.98] transition-all disabled:opacity-60"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          <div className="text-center mt-6">
            <Link
              href="/login/student"
              className="text-sm text-black font-semibold hover:underline"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
