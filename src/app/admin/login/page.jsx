"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    password: "",
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
          role: "admin",
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Login successful");
        router.push("/admin");
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-32 pb-10 px-4 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 flex items-start justify-center overflow-y-auto relative">
      
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_30%)] pointer-events-none" />

      <div className="relative w-full max-w-md z-10">
        <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl shadow-2xl p-8">

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-white text-black font-bold text-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              A
            </div>

            <h1 className="text-3xl font-bold text-white">
              Admin Portal
            </h1>

            <p className="text-zinc-300 text-sm mt-2">
              Secure access to admissions dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Username */}
            <div>
              <label className="text-sm text-zinc-200 block mb-2">
                Username
              </label>

              <input
                type="text"
                placeholder="Enter username"
                value={form.username}
                onChange={(e) =>
                  updateField("username", e.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-white/10 text-white px-4 py-3 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-zinc-200 block mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={form.password}
                  onChange={(e) =>
                    updateField("password", e.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/10 text-white px-4 py-3 pr-20 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-white/30"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-300 hover:text-white"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between text-sm">

              <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={(e) =>
                    updateField("remember", e.target.checked)
                  }
                />
                Remember me
              </label>

              <button
                type="button"
                className="text-zinc-200 hover:text-white"
                onClick={() =>
                  toast("Contact developer to reset password")
                }
              >
                Forgot Password?
              </button>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-zinc-200 transition disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Login"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-zinc-400 mt-6">
            Authorized administrators only
          </p>
        </div>
      </div>
    </div>
  );
}