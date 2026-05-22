"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function StudentProfilePage() {

  const params = useParams();
  const router = useRouter();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");

  // FIX: depend on params.id so fetch runs once it's available
  useEffect(() => {
    if (params.id) fetchStudent();
  }, [params.id]);

  // FETCH STUDENT
  const fetchStudent = async () => {
    try {
      const res = await fetch(`/api/admin/students/${params.id}/delete`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setStudent(data.student);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to load profile");
    }
    setLoading(false);
  };

  // SUSPEND / UNSUSPEND
  const toggleSuspend = async () => {
    try {
      setActionLoading("suspend");
      const res = await fetch(`/api/admin/students/${params.id}/suspend`, { method: "PATCH" });
      const data = await res.json();
      if (data.success) {
        toast.success(student.isSuspended ? "Student unsuspended" : "Student suspended");
        setStudent(prev => ({ ...prev, isSuspended: !prev.isSuspended }));
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Action failed");
    } finally {
      setActionLoading("");
    }
  };

  // DELETE
  const deleteStudent = async () => {
    if (!confirm("Delete this student permanently? This cannot be undone.")) return;
    try {
      setActionLoading("delete");
      const res = await fetch(`/api/admin/students/${params.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Student deleted");
        router.push("/admin/students");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Delete failed");
    } finally {
      setActionLoading("");
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-5" />
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  // NO USER
  if (!student) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Student Not Found</h1>
          <button
            onClick={() => router.push("/admin/students")}
            className="bg-black text-white px-6 py-3 rounded-2xl"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 p-6 md:p-10 pt-32 md:pt-36">

      {/* TOP */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-10">

        <div className="flex items-center gap-5">

          {/* AVATAR */}
          <div className="w-24 h-24 rounded-[28px] bg-black text-white flex items-center justify-center text-4xl font-black shadow-2xl">
            {student?.fullName?.charAt(0)}
          </div>

          {/* INFO */}
          <div>
            <p className="uppercase tracking-[0.25em] text-xs text-gray-500 font-semibold mb-3">
              Student Profile
            </p>
            <h1 className="text-4xl font-black text-gray-900">
              {student.fullName}
            </h1>
            <p className="text-gray-500 mt-2 text-lg">
              {student.email}
            </p>
          </div>

        </div>

        {/* ACTIONS */}
        <div className="flex gap-4 flex-wrap">

          <button
            onClick={() => router.push("/admin/students")}
            className="bg-white border border-gray-200 hover:bg-gray-100 transition px-6 py-4 rounded-2xl font-semibold"
          >
            Back
          </button>

          <button
            disabled={actionLoading === "suspend"}
            onClick={toggleSuspend}
            className={`transition text-white px-6 py-4 rounded-2xl font-semibold shadow-lg ${
              student.isSuspended
                ? "bg-green-600 hover:bg-green-700"
                : "bg-yellow-500 hover:bg-yellow-600"
            }`}
          >
            {actionLoading === "suspend"
              ? "Please wait..."
              : student.isSuspended
              ? "Unsuspend Student"
              : "Suspend Student"}
          </button>

          <button
            disabled={actionLoading === "delete"}
            onClick={deleteStudent}
            className="bg-red-500 hover:bg-red-600 transition text-white px-6 py-4 rounded-2xl font-semibold shadow-lg"
          >
            {actionLoading === "delete" ? "Deleting..." : "Delete Student"}
          </button>

        </div>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard title="Login Count" value={student.loginCount || 0} />
        <StatCard title="Status" value={student.isOnline ? "Online" : "Offline"} />
        <StatCard title="Verified" value={student.isVerified ? "Yes" : "No"} />
        <StatCard title="Suspended" value={student.isSuspended ? "Yes" : "No"} />
      </div>

      {/* MAIN GRID */}
      <div className="grid xl:grid-cols-3 gap-6">

        {/* PROFILE INFO */}
        <div className="xl:col-span-2 bg-white rounded-[30px] shadow-xl border border-gray-100 p-8">

          <h2 className="text-2xl font-black text-gray-900 mb-8">
            Account Information
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            <InfoCard label="Full Name" value={student.fullName} />
            <InfoCard label="Email Address" value={student.email} />
            <InfoCard label="Role" value={student.role} />
            <InfoCard label="Username" value={student.username || "N/A"} />
            <InfoCard
              label="Last Login"
              value={student.lastLogin ? new Date(student.lastLogin).toLocaleString() : "Never"}
            />
            <InfoCard
              label="Joined"
              value={new Date(student.createdAt).toLocaleDateString()}
            />
          </div>

        </div>

        {/* ACTIVITY */}
        <div className="bg-white rounded-[30px] shadow-xl border border-gray-100 p-8">

          <h2 className="text-2xl font-black text-gray-900 mb-8">
            Login Activity
          </h2>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {student.loginHistory?.length > 0 ? (
              student.loginHistory
                .slice()
                .reverse()
                .map((item, index) => (
                  <div
                    key={index}
                    className="border border-gray-100 rounded-2xl p-5 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wide text-green-600">
                        Login
                      </span>
                      <span className="text-xs text-gray-400">#{index + 1}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(item.time).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-3 break-all">{item.device}</p>
                    <p className="text-xs text-gray-400 mt-2">IP: {item.ip || "Unknown"}</p>
                  </div>
                ))
            ) : (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">📭</div>
                <p className="text-gray-500">No login activity</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

/* STATS */
function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-[28px] shadow-lg border border-gray-100 p-7">
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <h2 className="text-4xl font-black text-gray-900 mt-4 capitalize">{value}</h2>
    </div>
  );
}

/* INFO */
function InfoCard({ label, value }) {
  return (
    <div className="border border-gray-100 rounded-[24px] p-6 hover:bg-gray-50 transition">
      <p className="text-sm text-gray-500 mb-3">{label}</p>
      <h3 className="font-bold text-gray-900 break-words text-lg">{value}</h3>
    </div>
  );
}