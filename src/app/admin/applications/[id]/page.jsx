"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function StudentProfilePage() {
  const { id } = useParams();
  const router = useRouter();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudent();
  }, []);

  const fetchStudent = async () => {
    try {
      const res = await fetch(`/api/get-single-application?id=${id}`);
      const data = await res.json();

      if (data.success) {
        setStudent(data.student);
      } else {
        toast.error("Student not found");
      }
    } catch {
      toast.error("Error loading profile");
    }

    setLoading(false);
  };

  const updateStatus = async (status) => {
    const res = await fetch("/api/update-status", {
      method: "POST",
      body: JSON.stringify({
        id,
        status,
      }),
    });

    const data = await res.json();

    if (data.success) {
      toast.success(`Student ${status}`);
      fetchStudent();
    } else {
      toast.error("Failed");
    }
  };

  if (loading) {
    return (
      <div className="p-10">Loading...</div>
    );
  }

  if (!student) return null;

  return (
    <div className="p-8 mt-24 max-w-6xl mx-auto">

      <button
        onClick={() => router.push("/admin")}
        className="mb-6 text-blue-600"
      >
        ← Back
      </button>

      <div className="bg-white rounded-3xl shadow-xl p-8 grid md:grid-cols-3 gap-8">

        {/* LEFT */}
        <div>
          <img
            src={student.passport}
            alt="passport"
            className="w-full h-72 object-cover rounded-2xl border"
          />

          <div className="mt-6 space-y-3">
            <button
              onClick={() => updateStatus("Approved")}
              className="w-full bg-green-600 text-white py-3 rounded-xl"
            >
              Approve
            </button>

            <button
              onClick={() => updateStatus("Rejected")}
              className="w-full bg-red-600 text-white py-3 rounded-xl"
            >
              Reject
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="md:col-span-2 grid grid-cols-2 gap-5 text-sm">

          <Info title="Full Name" value={student.fullName} />
          <Info title="Gender" value={student.sex} />
          <Info title="DOB" value={student.dateOfBirth} />
          <Info title="Phone" value={student.phone} />
          <Info title="Class Applied" value={student.classApplying} />
          <Info title="Previous School" value={student.previousSchool} />
          <Info title="Parent Name" value={student.parentName} />
          <Info title="Parent Phone" value={student.parentPhone} />
          <Info title="Occupation" value={student.parentOccupation} />
          <Info title="Address" value={student.address} />
          <Info title="Medical" value={student.healthCondition} />
          <Info title="Status" value={student.status} />

        </div>

      </div>
    </div>
  );
}

function Info({ title, value }) {
  return (
    <div className="bg-gray-50 p-4 rounded-xl">
      <p className="text-gray-500 text-xs mb-1">{title}</p>
      <p className="font-semibold">{value || "-"}</p>
    </div>
  );
}