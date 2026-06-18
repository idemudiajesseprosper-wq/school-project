"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function ApplicantDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [data, setData] = useState(null);
  const lastStatusRef = useRef("");
  const applicantId = data?.applicant?._id;

  const load = useCallback(
    async ({ silent = false } = {}) => {
      const res = await fetch("/api/applicant/me", { cache: "no-store" });
      const json = await res.json();
      if (!json.success) {
        router.push("/applicant/login");
        return;
      }
      setData(json);
      lastStatusRef.current =
        json.application?.status || json.applicant?.applicationStatus || "";
      if (!silent) setLoading(false);
    },
    [router],
  );

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!applicantId) return;

    let closed = false;
    let fallbackInterval;
    const events = new EventSource("/api/applicant/status/stream");

    events.onmessage = (event) => {
      if (closed) return;

      try {
        const update = JSON.parse(event.data);
        const nextStatus =
          update.application?.status ||
          update.applicant?.applicationStatus ||
          "";

        setData((current) => {
          if (!current) return current;
          return {
            ...current,
            applicant: {
              ...current.applicant,
              ...update.applicant,
            },
            application: update.application || current.application,
          };
        });

        if (
          nextStatus &&
          nextStatus !== lastStatusRef.current &&
          (nextStatus === "Approved" || nextStatus === "accepted")
        ) {
          toast.success(
            "Your application has been approved. You can now log in.",
          );
        }

        if (nextStatus) lastStatusRef.current = nextStatus;
      } catch {
        load({ silent: true });
      }
    };

    events.onerror = () => {
      events.close();
      if (!closed && !fallbackInterval) {
        load({ silent: true });
        fallbackInterval = setInterval(() => {
          load({ silent: true });
        }, 5000);
      }
    };

    return () => {
      closed = true;
      clearInterval(fallbackInterval);
      events.close();
    };
  }, [applicantId, load]);

  async function pay() {
    setPaying(true);
    const res = await fetch("/api/applicant/payment/initialize", {
      method: "POST",
    });
    const json = await res.json();
    setPaying(false);
    if (!json.success)
      return toast.error(json.message || "Could not start payment");
    window.location.href = json.authorizationUrl;
  }

  if (loading)
    return (
      <div className="min-h-screen bg-red-50 p-8 text-red-900">
        Loading applicant dashboard...
      </div>
    );

  const applicant = data.applicant;
  const applicationStatus =
    data.application?.status || applicant.applicationStatus;
  const paid = applicant.paymentStatus === "paid";

  return (
    <main className="min-h-screen bg-red-50 text-slate-950">
      <header className="bg-red-900 px-4 py-6 text-white md:px-8">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-red-100">
          Applicant Dashboard
        </p>
        <h1 className="mt-2 text-3xl font-black">
          Hello, {applicant.fullName}
        </h1>
        <p className="mt-1 text-sm text-red-100">
          Applicant ID: {applicant.applicantId}
        </p>
      </header>

      <section className="grid gap-4 p-4 md:grid-cols-3 md:p-8">
        <Card label="Enrollment Fee" value="NGN 6,000" />
        <Card
          label="Payment Status"
          value={paid ? "Paid" : "Unpaid"}
          tone={paid ? "green" : "red"}
        />
        <Card
          label="Application Status"
          value={applicationStatus || "Not Started"}
        />
      </section>

      <section className="mx-4 mb-8 rounded-xl border border-red-100 bg-white p-5 shadow-sm md:mx-8">
        {!applicationStatus || applicationStatus === "not_started" ? (
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-xl font-black text-red-950">
                Start Your Enrollment Form
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Complete the admission form first. After submitting it, you can
                pay the NGN 6,000 enrollment fee from this dashboard.
              </p>
            </div>
            <a
              href="/apply"
              className="rounded-lg bg-red-700 px-6 py-4 text-center text-base font-black text-white shadow-lg hover:bg-red-800"
            >
              Start Application
            </a>
          </div>
        ) : !paid ? (
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-xl font-black text-red-950">
                Enrollment Fee Pending
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Your form is available without payment. Pay exactly NGN 6,000
                through Paystack when you are ready to complete the enrollment
                fee step.
              </p>
            </div>
            <button
              type="button"
              onClick={pay}
              disabled={paying}
              className="rounded-lg bg-red-700 px-6 py-4 text-base font-black text-white shadow-lg hover:bg-red-800 disabled:opacity-60"
            >
              {paying ? "Starting Payment..." : "Pay Enrollment Fee"}
            </button>
          </div>
        ) : applicationStatus === "Pending" ||
          applicationStatus === "submitted" ? (
          <div>
            <h2 className="text-xl font-black text-red-950">
              Application Submitted Successfully
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Your application is under review.
            </p>
          </div>
        ) : applicationStatus === "Rejected" ||
          applicationStatus === "rejected" ? (
          <div>
            <h2 className="text-xl font-black text-red-700">
              Application Rejected
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Thank you for your interest. Your dashboard will update if the
              school changes this decision.
            </p>
          </div>
        ) : applicationStatus === "Approved" ||
          applicationStatus === "accepted" ? (
          <div>
            <h2 className="text-xl font-black text-green-700">
              Application Accepted
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Your student account is active. Student ID:{" "}
              {applicant.studentIdNumber || data.application?.studentIdNumber}
            </p>
            <a
              href="/login/student"
              className="mt-4 inline-flex rounded-lg bg-slate-950 px-4 py-2 text-sm font-black text-white"
            >
              Go to Student Login
            </a>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-xl font-black text-red-950">
                Enrollment Fee Paid
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Payment confirmed. You may now complete your admission form.
              </p>
            </div>
            <a
              href="/apply"
              className="rounded-lg bg-red-700 px-6 py-4 text-center text-base font-black text-white shadow-lg hover:bg-red-800"
            >
              Start Application
            </a>
          </div>
        )}

        {data.receipt && (
          <div className="mt-5 rounded-lg bg-red-50 p-4 text-sm text-red-950">
            <p className="font-black">Receipt</p>
            <p>Reference: {data.receipt.paystackReference}</p>
            <p>Paid: {new Date(data.receipt.paidAt).toLocaleString()}</p>
          </div>
        )}
      </section>
    </main>
  );
}

function Card({ label, value, tone }) {
  const color =
    tone === "green"
      ? "text-green-700"
      : tone === "red"
        ? "text-red-700"
        : "text-slate-950";
  return (
    <div className="rounded-xl border border-red-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className={`mt-2 text-2xl font-black ${color}`}>{value}</p>
    </div>
  );
}
