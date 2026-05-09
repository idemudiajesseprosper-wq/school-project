"use client";

import {
  useEffect,
  useState,
} from "react";

import { useRouter }
from "next/navigation";

export default function StudentDashboard() {

  const router = useRouter();

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch(
        "/api/auth/me"
      );

      const data =
        await res.json();

      if (data.success) {
        setUser(data.user);
      }

    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const logout = async () => {
    await fetch(
      "/api/auth/logout",
      {
        method: "POST",
      }
    );

    router.push("/login/student");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* SIDEBAR */}
      <aside className="hidden md:flex w-72 bg-black text-white flex-col p-6">

        {/* LOGO */}
        <div className="flex items-center gap-4 mb-10">

          <img
            src="/images/logo.png"
            alt="School Logo"
            className="w-14 h-14 object-contain"
          />

          <div>
            <h1 className="font-bold text-lg leading-tight">
              Winners'
              Foundation
            </h1>

            <p className="text-gray-400 text-sm">
              Student Portal
            </p>
          </div>
        </div>

        {/* NAV */}
        <div className="space-y-3">

          <button className="w-full text-left bg-white/10 hover:bg-white/20 transition px-4 py-3 rounded-xl">
            Dashboard
          </button>

          <button className="w-full text-left hover:bg-white/10 transition px-4 py-3 rounded-xl">
            Results
          </button>

          <button className="w-full text-left hover:bg-white/10 transition px-4 py-3 rounded-xl">
            Timetable
          </button>

          <button className="w-full text-left hover:bg-white/10 transition px-4 py-3 rounded-xl">
            Notifications
          </button>

        </div>

        {/* LOGOUT */}
        <div className="mt-auto">
          <button
            onClick={logout}
            className="w-full bg-red-500 hover:bg-red-600 transition py-3 rounded-xl font-medium"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6 md:p-10">

        {/* TOP HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome Back
            </h1>

            <p className="text-gray-500 mt-1">
              Student dashboard overview
            </p>
          </div>

          {/* PROFILE */}
          <div className="bg-white rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4">

            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg">
              {user?.fullName?.charAt(0)}
            </div>

            <div>
              <p className="font-semibold text-gray-900">
                {user?.fullName}
              </p>

              <p className="text-sm text-gray-500">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          <Card
            title="Login Count"
            value={user?.loginCount || 0}
          />

          <Card
            title="Role"
            value={user?.role}
          />

          <Card
            title="Status"
            value={
              user?.isOnline
                ? "Online"
                : "Offline"
            }
          />

          <Card
            title="Verified"
            value={
              user?.isVerified
                ? "Yes"
                : "No"
            }
          />
        </div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* PROFILE CARD */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm p-7">

            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Student Information
            </h2>

            <div className="grid md:grid-cols-2 gap-5">

              <Info
                label="Full Name"
                value={user?.fullName}
              />

              <Info
                label="Email Address"
                value={user?.email}
              />

              <Info
                label="Account Role"
                value={user?.role}
              />

              <Info
                label="Last Login"
                value={
                  user?.lastLogin
                    ? new Date(
                        user.lastLogin
                      ).toLocaleString()
                    : "N/A"
                }
              />
            </div>
          </div>

          {/* ACTIVITY */}
          <div className="bg-white rounded-3xl shadow-sm p-7">

            <h2 className="text-xl font-bold text-gray-900 mb-5">
              Recent Activity
            </h2>

            <div className="space-y-4">

              {user?.loginHistory
                ?.slice()
                .reverse()
                .slice(0, 5)
                .map((item, index) => (
                  <div
                    key={index}
                    className="border rounded-2xl p-4"
                  >
                    <p className="font-medium text-sm">
                      Login Activity
                    </p>

                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(
                        item.time
                      ).toLocaleString()}
                    </p>

                    <p className="text-xs text-gray-400 mt-2 truncate">
                      {item.device}
                    </p>
                  </div>
                ))}

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* CARD */
function Card({
  title,
  value,
}) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">

      <p className="text-gray-500 text-sm">
        {title}
      </p>

      <h2 className="text-3xl font-bold text-gray-900 mt-3 capitalize">
        {value}
      </h2>
    </div>
  );
}

/* INFO */
function Info({
  label,
  value,
}) {
  return (
    <div className="border rounded-2xl p-5">

      <p className="text-sm text-gray-500 mb-2">
        {label}
      </p>

      <h3 className="font-semibold text-gray-900 break-words">
        {value}
      </h3>
    </div>
  );
}