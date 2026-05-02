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
      data = data.filter(
        (app) => (app.status || "Pending") === statusFilter
      );
    }

    if (classFilter) {
      data = data.filter(
        (app) => app.classApplying === classFilter
      );
    }

    setFilteredApps(data);
  };

  const logout = async () => {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    toast.success("Logged out");
    router.push("/admin/login");
  } catch (error) {
    toast.error("Logout failed");
  }
};

  // Stats
  const total = applications.length;

  const approved = applications.filter(
    (a) => a.status === "Approved"
  ).length;

  const rejected = applications.filter(
    (a) => a.status === "Rejected"
  ).length;

  const pending = applications.filter(
    (a) => !a.status || a.status === "Pending"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8 mt-24">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Manage student applications
          </p>
        </div>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl font-medium"
        >
          Logout
        </button>
      </div>

      <button
  onClick={() =>
    window.location.href = "/admin/codes"
  }
  className="bg-blue-600 text-white px-4 py-2 rounded"
>
  Codes
</button>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

        <Card title="Total" value={total} />

        <Card
          title="Approved"
          value={approved}
          color="text-green-600"
          bg="bg-green-50"
        />

        <Card
          title="Pending"
          value={pending}
          color="text-yellow-600"
          bg="bg-yellow-50"
        />

        <Card
          title="Rejected"
          value={rejected}
          color="text-red-600"
          bg="bg-red-50"
        />
      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-8 grid md:grid-cols-3 gap-3">

        <input
          placeholder="Search student name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-xl px-4 py-3 outline-none"
        >
          <option value="">All Status</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>

        <select
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          className="border rounded-xl px-4 py-3 outline-none"
        >
          <option value="">All Classes</option>
          <option>Nursery 1</option>
          <option>Nursery 2</option>
          <option>Primary 1</option>
          <option>Primary 2</option>
          <option>Primary 3</option>
          <option>Primary 4</option>
          <option>Primary 5</option>
          <option>Primary 6</option>
          <option>JSS 1</option>
          <option>JSS 2</option>
          <option>JSS 3</option>
          <option>SSS 1</option>
          <option>SSS 2</option>
          <option>SSS 3</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">

            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-4 text-left">Student</th>
                <th className="p-4 text-left">Class</th>
                <th className="p-4 text-left">Parent</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {!loading &&
                filteredApps.map((app) => (
                  <tr
                    key={app._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-4 font-medium text-gray-800">
                      {app.fullName}
                    </td>

                    <td className="p-4">
                      {app.classApplying || "-"}
                    </td>

                    <td className="p-4">
                      {app.parentName}
                    </td>

                    <td className="p-4">
                      {app.parentPhone}
                    </td>

                    <td className="p-4 text-gray-500">
                      {new Date(
                        app.createdAt
                      ).toLocaleDateString()}
                    </td>

                    <td className="p-4">
                      <StatusBadge
                        status={app.status || "Pending"}
                      />
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() =>
                          router.push(
                            `/admin/applications/${app._id}`
                          )
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-medium"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {!loading && filteredApps.length === 0 && (
          <div className="p-10 text-center text-gray-500">
            No applications found
          </div>
        )}

        {loading && (
          <div className="p-10 text-center text-gray-500">
            Loading applications...
          </div>
        )}
      </div>
    </div>
  );
}

/* COMPONENTS */

function Card({
  title,
  value,
  color = "text-gray-900",
  bg = "bg-white",
}) {
  return (
    <div className={`${bg} rounded-2xl p-5 shadow-sm`}>
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className={`text-2xl font-bold mt-2 ${color}`}>
        {value}
      </h2>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Approved:
      "bg-green-100 text-green-700",
    Rejected:
      "bg-red-100 text-red-700",
    Pending:
      "bg-yellow-100 text-yellow-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        styles[status] || styles.Pending
      }`}
    >
      {status}
    </span>
  );
}