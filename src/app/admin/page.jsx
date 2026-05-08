"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminPage() {
  const router = useRouter();

  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterData();
  }, [search, statusFilter, classFilter, applications]);

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/get-applications");
      const data = await res.json();
      setApplications(data.applications || []);
    } catch (error) {
      toast.error("Failed to load applications");
    }
    setLoading(false);
  };

  const filterData = () => {
    let data = [...applications];
    if (search) {
      data = data.filter((app) =>
        app.fullName?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (statusFilter) {
      data = data.filter((app) => (app.status || "Pending") === statusFilter);
    }
    if (classFilter) {
      data = data.filter((app) => app.classApplying === classFilter);
    }
    setFilteredApps(data);
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Logged out");
      router.push("/admin/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const total = applications.length;
  const approved = applications.filter((a) => a.status === "Approved").length;
  const rejected = applications.filter((a) => a.status === "Rejected").length;
  const pending = applications.filter(
    (a) => !a.status || a.status === "Pending"
  ).length;

  return (
    <div className="min-h-screen bg-gray-100">

      {/* TOP BAR */}
      <div className="bg-[#0c1a2e] px-6 py-3 flex items-center justify-between mt-16 md:mt-28">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-[#1e6fa8] rounded-md flex items-center justify-center text-white text-xs font-medium">
            W
          </div>
          <div>
            <p className="text-[#e8edf3] text-sm font-medium leading-tight">
              Winners&apos; Foundation School
            </p>
            <p className="text-[#6b82a0] text-xs">
              Admissions Portal — Admin
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/admin/codes")}
            className="bg-white/[0.06] hover:bg-white/10 border border-white/[0.12] text-[#b0c4d8] text-xs px-3 py-1.5 rounded-md transition-colors"
          >
            Codes
          </button>
          <button
            onClick={logout}
            className="bg-red-900/30 hover:bg-red-900/50 border border-red-500/30 text-red-400 text-xs px-3 py-1.5 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="p-5 md:p-6">

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <StatCard label="Total applications" value={total} />
          <StatCard
            label="Approved"
            value={approved}
            valueClass="text-green-700"
            dot="bg-green-600"
          />
          <StatCard
            label="Pending"
            value={pending}
            valueClass="text-amber-700"
            dot="bg-amber-500"
          />
          <StatCard
            label="Rejected"
            value={rejected}
            valueClass="text-red-600"
            dot="bg-red-500"
          />
        </div>

        {/* FILTERS */}
        <div className="grid md:grid-cols-3 gap-2.5 mb-4">
          <FilterField icon="🔍">
            <input
              placeholder="Search student name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
            />
          </FilterField>

          <FilterField icon="▾">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-transparent outline-none text-sm text-gray-800 cursor-pointer"
            >
              <option value="">All statuses</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
          </FilterField>

          <FilterField icon="▾">
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="w-full bg-transparent outline-none text-sm text-gray-800 cursor-pointer"
            >
              <option value="">All classes</option>
              {[
                "Nursery 1","Nursery 2",
                "Primary 1","Primary 2","Primary 3","Primary 4","Primary 5","Primary 6",
                "JSS 1","JSS 2","JSS 3",
                "SSS 1","SSS 2","SSS 3",
              ].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </FilterField>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[820px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {["Student","Class","Parent / Guardian","Phone","Date","Status",""].map(
                    (h, i) => (
                      <th
                        key={i}
                        className="px-4 py-3 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {!loading &&
                  filteredApps.map((app) => (
                    <tr
                      key={app._id}
                      className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800 text-sm">
                          {app.fullName}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          APP-{String(app._id).slice(-4).toUpperCase()}
                        </p>
                      </td>

                      <td className="px-4 py-3 text-gray-600 text-sm">
                        {app.classApplying || "—"}
                      </td>

                      <td className="px-4 py-3 text-gray-600 text-sm">
                        {app.parentName}
                      </td>

                      <td className="px-4 py-3 text-gray-400 text-sm">
                        {app.parentPhone}
                      </td>

                      <td className="px-4 py-3 text-gray-400 text-sm">
                        {new Date(app.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="px-4 py-3">
                        <StatusBadge status={app.status || "Pending"} />
                      </td>

                      <td className="px-4 py-3">
                        <button
                          onClick={() =>
                            router.push(`/admin/applications/${app._id}`)
                          }
                          className="text-[#1e6fa8] border border-[#1e6fa8]/40 hover:bg-[#1e6fa8]/5 text-xs font-medium px-3 py-1.5 rounded-md transition-colors whitespace-nowrap"
                        >
                          View →
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {!loading && filteredApps.length === 0 && (
            <div className="py-16 text-center text-gray-400 text-sm">
              No applications found
            </div>
          )}

          {loading && (
            <div className="py-16 text-center text-gray-400 text-sm">
              Loading applications...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function StatCard({ label, value, valueClass = "text-gray-900", dot }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
        {dot && (
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${dot}`} />
        )}
        {label}
      </p>
      <p className={`text-2xl font-semibold ${valueClass}`}>{value}</p>
    </div>
  );
}

function FilterField({ icon, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 flex items-center gap-2 focus-within:border-[#1e6fa8] focus-within:ring-1 focus-within:ring-[#1e6fa8]/20 transition-all">
      <span className="text-gray-300 text-sm select-none">{icon}</span>
      {children}
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Approved: "bg-green-50 text-green-700",
    Rejected:  "bg-red-50 text-red-600",
    Pending:   "bg-amber-50 text-amber-700",
  };

  const dots = {
    Approved: "bg-green-500",
    Rejected:  "bg-red-500",
    Pending:   "bg-amber-500",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium ${
        styles[status] || styles.Pending
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${dots[status] || dots.Pending}`}
      />
      {status}
    </span>
  );
}
