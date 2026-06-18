"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") || searchParams.get("trxref");
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("Verifying your payment...");

  useEffect(() => {
    async function verify() {
      if (!reference) {
        setStatus("error");
        setMessage("Missing payment reference.");
        return;
      }

      const res = await fetch("/api/applicant/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference }),
      });
      const json = await res.json();
      if (!json.success) {
        setStatus("error");
        setMessage(json.message || "Payment verification failed.");
        return;
      }
      setStatus("success");
      setMessage("Enrollment fee paid. Your dashboard has been updated.");
    }

    verify();
  }, [reference]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-red-50 p-4">
      <section className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-7 text-center shadow-xl">
        <div
          className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full text-3xl ${status === "success" ? "bg-green-50" : status === "error" ? "bg-red-50" : "bg-slate-50"}`}
        >
          {status === "success" ? "✓" : status === "error" ? "!" : "..."}
        </div>
        <h1 className="text-2xl font-black text-red-950">
          {status === "success"
            ? "Payment Successful"
            : status === "error"
              ? "Payment Error"
              : "Please Wait"}
        </h1>
        <p className="mt-3 text-slate-600">{message}</p>
        {status === "success" && (
          <button
            type="button"
            onClick={() => router.push("/applicant")}
            className="mt-6 w-full rounded-lg bg-red-700 px-4 py-3 font-black text-white"
          >
            Back to Dashboard
          </button>
        )}
        {status === "error" && (
          <button
            type="button"
            onClick={() => router.push("/applicant")}
            className="mt-6 w-full rounded-lg bg-red-700 px-4 py-3 font-black text-white"
          >
            Back to Dashboard
          </button>
        )}
      </section>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
