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
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Students
          </h1>

          <p className="text-gray-500 mt-2">
            Manage all registered students
          </p>
        </div>

        {/* STATS */}
        <div className="flex gap-4">

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
      <div className="bg-white rounded-3xl shadow-sm p-5 mb-8">

        <input
          type="text"
          placeholder="Search student by name or email..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1100px]">

            <thead className="bg-black text-white">

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

              </tr>

            </thead>

            <tbody>

              {!loading &&
                filtered.map(
                  (student) => (

                  <tr
                    key={student._id}
                    className="border-b hover:bg-gray-50 transition"
                  >

                    {/* USER */}
                    <td className="p-5">

                      <div className="flex items-center gap-4">

                        <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold">
                          {
                            student
                            ?.fullName
                            ?.charAt(0)
                          }
                        </div>

                        <div>

                          <p className="font-semibold text-gray-900">
                            {
                              student.fullName
                            }
                          </p>

                          <p className="text-sm text-gray-500">
                            {
                              student.email
                            }
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* ROLE */}
                    <td className="p-5 capitalize">
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
                    <td className="p-5">
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

                  </tr>
                ))}

            </tbody>

          </table>

        </div>

        {/* EMPTY */}
        {!loading &&
          filtered.length === 0 && (

          <div className="p-12 text-center text-gray-500">
            No students found
          </div>
        )}

        {/* LOADING */}
        {loading && (

          <div className="p-12 text-center text-gray-500">
            Loading students...
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
    <div className="bg-white rounded-2xl shadow-sm px-6 py-5 min-w-[130px]">

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <h2 className="text-3xl font-bold text-gray-900 mt-2">
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
      className={`px-4 py-2 rounded-full text-xs font-semibold ${
        styles[type]
      }`}
    >
      {text}
    </span>
  );
}