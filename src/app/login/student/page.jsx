"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function StudentLogin() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
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
          email: form.email,
          password: form.password,
          role: "student",
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Welcome back");
        router.push("/student");
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#f8fafc] relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,0,0,0.05),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(0,0,0,0.04),transparent_40%)]" />

      {/* Card */}
      <div className="relative w-full max-w-md">

        <div className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8">

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center">
  <img
    src="/logo.PNG"
    alt="School Logo"
    className="w-10 h-10 object-contain"
  />
</div>

            <h1 className="mt-4 text-2xl font-semibold text-gray-900">
              Student Portal
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Secure access to your dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email Field */}
            <div className="relative">
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="peer w-full px-4 pt-5 pb-2 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-black/10 transition"
              />
              <label className="absolute left-4 top-2 text-xs text-gray-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500">
                Email Address
              </label>
            </div>

            {/* Password Field */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                className="peer w-full px-4 pt-5 pb-2 pr-20 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-black/10 transition"
              />
              <label className="absolute left-4 top-2 text-xs text-gray-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500">
                Password
              </label>

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-black"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Button */}
            <button
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-xl font-medium tracking-wide hover:bg-gray-900 active:scale-[0.98] transition-all disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Login"}
            </button>

          </form>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Don’t have an account?
              <span
                onClick={() =>
                  router.push("/login/student/register")
                }
                className="ml-1 text-black font-semibold cursor-pointer hover:underline"
              >
                Register
              </span>
            </p>

            <p className="text-xs text-gray-400 mt-2">
              Protected by secure authentication
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}