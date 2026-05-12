"use client";

import {
  useEffect,
  useState,
} from "react";

import toast
from "react-hot-toast";

export default function StudentsPage() {

  const [students, setStudents] =
    useState([]);

  const [filtered, setFiltered] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [search, students]);

  // FETCH STUDENTS
  const fetchStudents = async () => {

    try {

      const res = await fetch(
        "/api/admin/students"
      );

      const data =
        await res.json();

      if (data.success) {

        setStudents(
          data.students
        );

      } else {

        toast.error(
          data.message
        );
      }

    } catch (error) {

      toast.error(
        "Failed to load students"
      );
    }

    setLoading(false);
  };

  // FILTER
  const filterStudents = () => {

    let data = [...students];

    if (search) {

      data = data.filter(
        (student) =>
          student.fullName
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||

          student.email
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }

    setFiltered(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white p-6 md:p-10">

      {/* HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-10">

        <div>

          <p className="uppercase tracking-[0.25em] text-xs text-gray-500 font-semibold mb-3">
            Administration
          </p>

          <h1 className="text-4xl md:text-5xl font-black text-gray-900">
            Student Management
          </h1>

          <p className="text-gray-500 mt-3 text-lg">
            Monitor registered students and activity
          </p>

        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <StatCard
            title="Students"
            value={students.length}
          />

          <StatCard
            title="Online"
            value={
              students.filter(
                (s) => s.isOnline
              ).length
            }
          />

          <StatCard
            title="Verified"
            value={
              students.filter(
                (s) => s.isVerified
              ).length
            }
          />

        </div>
      </div>

      {/* SEARCH */}
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-sm p-5 mb-8">

        <input
          type="text"
          placeholder="Search by student name or email..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="w-full border border-gray-200 bg-gray-50 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black transition"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[30px] shadow-xl border border-gray-100 overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1250px]">

            <thead className="bg-black text-white sticky top-0 z-10">

              <tr>

                <th className="p-5 text-left">
                  Student
                </th>

                <th className="p-5 text-left">
                  Role
                </th>

                <th className="p-5 text-left">
                  Verified
                </th>

                <th className="p-5 text-left">
                  Status
                </th>

                <th className="p-5 text-left">
                  Login Count
                </th>

                <th className="p-5 text-left">
                  Last Login
                </th>

                <th className="p-5 text-left">
                  Joined
                </th>

                <th className="p-5 text-left">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {!loading &&
                filtered.map(
                  (student) => (

                  <tr
                    key={student._id}
                    className="border-b border-gray-100 hover:bg-gray-50/80 transition-all duration-200"
                  >

                    {/* USER */}
                    <td className="p-5">

                      <div className="flex items-center gap-4">

                        <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-lg shadow-lg">
                          {
                            student
                            ?.fullName
                            ?.charAt(0)
                          }
                        </div>

                        <div>

                          <p className="font-bold text-gray-900 text-[15px]">
                            {
                              student.fullName
                            }
                          </p>

                          <p className="text-sm text-gray-500 mt-1">
                            {
                              student.email
                            }
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* ROLE */}
                    <td className="p-5 capitalize font-medium text-gray-700">
                      {
                        student.role
                      }
                    </td>

                    {/* VERIFIED */}
                    <td className="p-5">

                      <Badge
                        text={
                          student.isVerified
                          ? "Verified"
                          : "Not Verified"
                        }
                        type={
                          student.isVerified
                          ? "green"
                          : "yellow"
                        }
                      />

                    </td>

                    {/* ONLINE */}
                    <td className="p-5">

                      <Badge
                        text={
                          student.isOnline
                          ? "Online"
                          : "Offline"
                        }
                        type={
                          student.isOnline
                          ? "green"
                          : "gray"
                        }
                      />

                    </td>

                    {/* LOGIN COUNT */}
                    <td className="p-5 font-semibold text-gray-900">
                      {
                        student.loginCount || 0
                      }
                    </td>

                    {/* LAST LOGIN */}
                    <td className="p-5 text-sm text-gray-500">

                      {
                        student.lastLogin
                        ? new Date(
                            student.lastLogin
                          ).toLocaleString()
                        : "Never"
                      }

                    </td>

                    {/* CREATED */}
                    <td className="p-5 text-sm text-gray-500">

                      {
                        new Date(
                          student.createdAt
                        ).toLocaleDateString()
                      }

                    </td>

                    {/* ACTION */}
                    <td className="p-5">

                      <button
                        onClick={() =>
                          window.location.href =
                          `/admin/students/${student._id}`
                        }
                        className="bg-black hover:bg-gray-800 transition text-white px-5 py-3 rounded-2xl text-sm font-semibold shadow-lg"
                      >
                        View Profile
                      </button>

                    </td>

                  </tr>
                ))}

            </tbody>

          </table>

        </div>

        {/* EMPTY */}
        {!loading &&
          filtered.length === 0 && (

          <div className="p-20 text-center">

            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl">
              🎓
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              No Students Found
            </h2>

            <p className="text-gray-500">
              Try adjusting your search
            </p>

          </div>
        )}

        {/* LOADING */}
        {loading && (

          <div className="p-20 text-center">

            <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-6" />

            <p className="text-gray-500 text-lg">
              Loading students...
            </p>

          </div>
        )}

      </div>
    </div>
  );
}

/* STATS */
function StatCard({
  title,
  value,
}) {

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 px-7 py-6 min-w-[150px]">

      <p className="text-sm text-gray-500 font-medium">
        {title}
      </p>

      <h2 className="text-4xl font-black text-gray-900 mt-3">
        {value}
      </h2>

    </div>
  );
}

/* BADGE */
function Badge({
  text,
  type,
}) {

  const styles = {

    green:
      "bg-green-100 text-green-700",

    yellow:
      "bg-yellow-100 text-yellow-700",

    gray:
      "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide ${
        styles[type]
      }`}
    >
      {text}
    </span>
  );
}