"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const CLASSES = [
  "Nursery 1", "Nursery 2",
  "Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6",
  "JSS 1", "JSS 2", "JSS 3",
  "SSS 1", "SSS 2", "SSS 3",
];

export default function Apply() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [applicant, setApplicant] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    loadApplicant();
  }, []);

  async function loadApplicant() {
    const res = await fetch("/api/applicant/me");
    const json = await res.json();
    if (!json.success) {
      router.push("/applicant/login");
      return;
    }
    setApplicant(json.applicant);
    setLoading(false);
  }

  async function uploadFile(formData, name, folder) {
    const file = formData.get(name);
    if (!file || file.size === 0) return "";
    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("folder", folder);
    const res = await fetch("/api/upload", { method: "POST", body: uploadData });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || "Upload failed");
    return json.url;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setSubmitting(true);

    try {
      const payload = Object.fromEntries(formData);
      payload.passport = await uploadFile(formData, "passport", "school-portal/applications/passports");
      payload.birthCertificate = await uploadFile(formData, "birthCertificate", "school-portal/applications/documents");
      payload.previousSchoolResult = await uploadFile(formData, "previousSchoolResult", "school-portal/applications/documents");
      payload.transferCertificate = await uploadFile(formData, "transferCertificate", "school-portal/applications/documents");

      const res = await fetch("/api/submit-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success) return toast.error(json.message || "Could not submit application");
      toast.success("Application submitted successfully");
      router.push("/applicant");
    } catch (error) {
      toast.error(error.message || "Could not submit application");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-red-50 p-8 text-red-950">Loading application...</div>;
  }

  if (applicant?.paymentStatus !== "paid") {
    return (
      <main className="min-h-screen bg-red-50 px-4 py-24">
        <section className="mx-auto max-w-lg rounded-2xl border border-red-100 bg-white p-7 text-center shadow-xl">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-700">
            Locked
          </div>
          <h1 className="text-2xl font-black text-red-950">Enrollment Form Locked</h1>
          <p className="mt-3 text-slate-600">
            Pay the enrollment fee of <strong>₦6,000</strong> from your applicant dashboard to unlock this form automatically.
          </p>
          <button onClick={() => router.push("/applicant")} className="mt-6 w-full rounded-lg bg-red-700 px-4 py-3 font-black text-white">
            Go to Applicant Dashboard
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-red-50 px-4 py-20 text-slate-950">
      <section className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-red-100 bg-white shadow-xl">
        <div className="bg-red-900 px-6 py-7 text-white">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-red-100">Paid Applicant</p>
          <h1 className="mt-2 text-3xl font-black">Student Admission Form</h1>
          <p className="mt-2 text-sm text-red-100">
            Applicant ID: {applicant.applicantId}. Complete all required details carefully.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-7 p-5 md:p-7">
          <Section title="Personal Information">
            <div className="grid gap-4 md:grid-cols-[150px_1fr]">
              <label className="grid h-44 cursor-pointer place-items-center overflow-hidden rounded-xl border-2 border-dashed border-red-200 bg-red-50 text-center text-sm font-bold text-red-700">
                <input
                  type="file"
                  name="passport"
                  accept="image/*"
                  required
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setPreview(URL.createObjectURL(file));
                  }}
                />
                {preview ? <img src={preview} alt="Passport preview" className="h-full w-full object-cover" /> : "Upload Passport"}
              </label>

              <div className="grid gap-3 md:grid-cols-2">
                <Input name="fullName" label="Full Name" required defaultValue={applicant.fullName || ""} />
                <Select name="sex" label="Sex" required options={["Male", "Female"]} />
                <Input name="dateOfBirth" label="Date of Birth" type="date" required />
                <Input name="phone" label="Phone Number" />
                <Input name="religion" label="Religion" />
                <Input name="nationality" label="Nationality" />
                <Input name="address" label="Residential Address" required full />
                <Input name="nativeTown" label="Native Town" />
                <Input name="state" label="State of Origin" />
              </div>
            </div>
          </Section>

          <Section title="School Information">
            <div className="grid gap-3 md:grid-cols-2">
              <Input name="previousSchool" label="Previous School Attended" full />
              <Input name="lastClassPassed" label="Last Class Passed" />
              <Select name="classApplying" label="Class Applying For" required options={CLASSES} />
              <FileInput name="birthCertificate" label="Birth Certificate" />
              <FileInput name="previousSchoolResult" label="Previous School Result" />
              <FileInput name="transferCertificate" label="Transfer Certificate" />
            </div>
          </Section>

          <Section title="Medical Information">
            <div className="grid gap-3 md:grid-cols-2">
              <Input name="disability" label="Any Disability?" />
              <Input name="healthCondition" label="Health Condition" />
              <Input name="specialAttention" label="Special Attention Needed" full />
            </div>
          </Section>

          <Section title="Parent / Guardian Information">
            <div className="grid gap-3 md:grid-cols-2">
              <Input name="parentName" label="Parent / Guardian Full Name" required full />
              <Input name="parentAddress" label="Parent Address" full />
              <Input name="parentOccupation" label="Occupation" />
              <Input name="parentPhone" label="Phone Number" required />
            </div>
          </Section>

          <Section title="Undertaking">
            <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm leading-7 text-slate-700">
              <p>
                I confirm that all information provided is accurate. I undertake to comply with the rules and regulations of Winners' Foundation School.
              </p>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <Input name="parentSignature" label="Parent Signature" required />
              <Input name="parentSignatureDate" label="Date" type="date" required />
              <Input name="pupilSignature" label="Pupil / Student Signature" />
              <Input name="pupilSignatureDate" label="Date" type="date" />
            </div>
          </Section>

          <button disabled={submitting} className="rounded-xl bg-red-700 px-5 py-4 text-sm font-black uppercase tracking-wider text-white hover:bg-red-800 disabled:opacity-60">
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </section>
    </main>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="mb-4 border-b border-red-100 pb-2 text-lg font-black text-red-950">{title}</h2>
      {children}
    </section>
  );
}

function Input({ label, name, type = "text", required, full, defaultValue }) {
  return (
    <label className={`grid gap-1 text-xs font-black uppercase tracking-wider text-slate-500 ${full ? "md:col-span-2" : ""}`}>
      {label}
      <input name={name} type={type} required={required} defaultValue={defaultValue} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium normal-case tracking-normal text-slate-950 outline-none focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-100" />
    </label>
  );
}

function Select({ label, name, required, options }) {
  return (
    <label className="grid gap-1 text-xs font-black uppercase tracking-wider text-slate-500">
      {label}
      <select name={name} required={required} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium normal-case tracking-normal text-slate-950 outline-none focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-100">
        <option value="">Select</option>
        {options.map((item) => <option key={item}>{item}</option>)}
      </select>
    </label>
  );
}

function FileInput({ label, name }) {
  return (
    <label className="grid gap-1 text-xs font-black uppercase tracking-wider text-slate-500">
      {label}
      <input name={name} type="file" accept=".pdf,image/*" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium normal-case tracking-normal text-slate-950 outline-none focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-100" />
    </label>
  );
}
