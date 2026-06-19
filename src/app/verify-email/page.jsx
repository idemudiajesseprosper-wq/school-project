"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function verifyEmail() {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${token}`);

        const data = await res.json();

        if (data.success) {
          setStatus("success");
          setMessage(data.message);
        } else {
          setStatus("error");
          setMessage(data.message);
        }
      } catch {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    }

    if (token) {
      verifyEmail();
    } else {
      setStatus("error");
      setMessage("Invalid verification link.");
    }
  }, [token]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8f9fb",
        fontFamily: "Lato, sans-serif",
        padding: "20px",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&family=Lato:wght@400;700;900&display=swap');`}</style>

      <div
        style={{
          background: "white",
          borderRadius: "24px",
          padding: "48px 40px",
          maxWidth: "460px",
          width: "100%",
          border: "1px solid #e8edf3",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "14px",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            border: "1px solid #e5e7eb",
            overflow: "hidden",
          }}
        >
          <img
            src="/logo.PNG"
            alt="Winners' Foundation School Logo"
            style={{
              width: "44px",
              height: "44px",
              objectFit: "contain",
            }}
          />
        </div>

        {/* Loading */}
        {status === "loading" && (
          <>
            <div
              style={{
                width: "44px",
                height: "44px",
                border: "3px solid #e5e7eb",
                borderTopColor: "#2563EB",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 20px",
              }}
            />

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "22px",
                fontWeight: "900",
                color: "#0a0a0a",
                marginBottom: "8px",
              }}
            >
              Verifying your email...
            </h2>

            <p style={{ color: "#6b7280", fontSize: "14px" }}>
              Please wait a moment.
            </p>
          </>
        )}

        {/* Success */}
        {status === "success" && (
          <>
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "#f0fdf4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                fontSize: "28px",
              }}
            >
              ✅
            </div>

            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "24px",
                fontWeight: "900",
                color: "#0a0a0a",
                marginBottom: "12px",
              }}
            >
              Email Verified!
            </h2>

            <p
              style={{
                color: "#6b7280",
                fontSize: "15px",
                marginBottom: "32px",
                lineHeight: 1.6,
              }}
            >
              Your account is now active. You can log in to your portal.
            </p>

            <button
              onClick={() => router.push("/login")}
              style={{
                background: "#2563EB",
                color: "white",
                border: "none",
                padding: "13px 32px",
                borderRadius: "10px",
                fontWeight: "700",
                fontSize: "14px",
                cursor: "pointer",
                width: "100%",
                fontFamily: "Lato, sans-serif",
              }}
            >
              Go to Login
            </button>
          </>
        )}

        {/* Error */}
        {status === "error" && (
          <>
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "#fef2f2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                fontSize: "28px",
              }}
            >
              ❌
            </div>

            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "24px",
                fontWeight: "900",
                color: "#0a0a0a",
                marginBottom: "12px",
              }}
            >
              Verification Failed
            </h2>

            <p
              style={{
                color: "#6b7280",
                fontSize: "15px",
                marginBottom: "32px",
                lineHeight: 1.6,
              }}
            >
              {message}
            </p>

            <button
              onClick={() => router.push("/login/student")}
              style={{
                background: "#f3f4f6",
                color: "#374151",
                border: "none",
                padding: "13px 32px",
                borderRadius: "10px",
                fontWeight: "700",
                fontSize: "14px",
                cursor: "pointer",
                width: "100%",
                fontFamily: "Lato, sans-serif",
              }}
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
