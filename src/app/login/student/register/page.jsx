"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const updateField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Basic validation
    if (!form.fullName || !form.email || !form.password) {
      toast.error("All fields are required");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          role: "student", // ✅ VERY IMPORTANT
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Registered successfully");

        // redirect to login
        router.push("/login/student");
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 space-y-4 border rounded-xl bg-white shadow-sm"
      >
        <h1 className="text-2xl font-bold text-center">
          Student Registration
        </h1>

        <input
          placeholder="Full Name"
          className="w-full border p-3 rounded-lg"
          onChange={(e) =>
            updateField("fullName", e.target.value)
          }
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded-lg"
          onChange={(e) =>
            updateField("email", e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-lg"
          onChange={(e) =>
            updateField("password", e.target.value)
          }
        />

        <button
          className="w-full bg-black text-white p-3 rounded-lg"
          disabled={loading}
        >
          {loading ? "Creating..." : "Register"}
        </button>

        {/* 👇 LINK TO LOGIN */}
        <p className="text-sm text-center">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login/student")}
            className="text-blue-600 cursor-pointer"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}