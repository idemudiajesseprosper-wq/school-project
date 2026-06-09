"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function StudentProfilePage() {
  const { id } = useParams();
  const router = useRouter();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStudent = useCallback(async () => {
    try {
      const res = await fetch(`/api/get-single-application?id=${id}`, {
        cache: "no-store",
      });
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
  }, [id]);

  useEffect(() => {
    fetchStudent();
  }, [fetchStudent]);

  const updateStatus = async (status) => {
    const res = await fetch("/api/update-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        status,
      }),
    });

    const data = await res.json();

    if (data.success) {
      toast.success(`Student ${status}`);
      if (data.application) setStudent(data.application);
      router.refresh();
    } else {
      toast.error(data.message || "Failed");
    }
  };

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  if (!student) return null;

  return (
    <div className="p-8 mt-24 max-w-6xl mx-auto">
      <button
        type="button"
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
              type="button"
              onClick={() => updateStatus("Approved")}
              className="w-full bg-green-600 text-white py-3 rounded-xl"
            >
              Approve
            </button>

            <button
              type="button"
              onClick={() => updateStatus("Rejected")}
              className="w-full bg-red-600 text-white py-3 rounded-xl"
            >
              Reject
            </button>
          </div>

          <div className="mt-6 rounded-2xl bg-gray-50 p-4 text-sm">
            <p className="font-semibold text-gray-900">Documents</p>
            <DocLink label="Passport" url={student.passport} />
            <DocLink label="Birth Certificate" url={student.birthCertificate} />
            <DocLink
              label="Previous Result"
              url={student.previousSchoolResult}
            />
            <DocLink
              label="Transfer Certificate"
              url={student.transferCertificate}
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="md:col-span-2 grid grid-cols-2 gap-5 text-sm">
          <Info title="Full Name" value={student.fullName} />
          <Info title="Applicant ID" value={student.applicantId} />
          <Info title="Student ID" value={student.studentIdNumber} />
          <Info title="Email" value={student.email} />
          <Info title="Payment" value={student.paymentStatus} />
          <Info title="Paystack Ref" value={student.paystackReference} />
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

function DocLink({ label, url }) {
  return (
    <p className="mt-2">
      <span className="text-gray-500">{label}: </span>
      {url ? (
        <a href={url} target="_blank" className="font-semibold text-blue-600">
          Open document
        </a>
      ) : (
        <span className="text-gray-400">Not uploaded</span>
      )}
    </p>
  );
}
