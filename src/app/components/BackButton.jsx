"use client";

import { useRouter } from "next/navigation";

export default function BackButton({ isPortalRoute = false }) {
  const router = useRouter();

  return (
    <>
      <button
        type="button"
        onClick={() => router.back()}
        className={`global-back-button ${isPortalRoute ? "portal-back-button" : "public-back-button"}`}
        aria-label="Go back to previous page"
        title="Go back"
      >
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M15 18l-6-6 6-6"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>Back</span>
      </button>

      <style jsx global>{`
        .global-back-button {
          position: fixed;
          left: 18px;
          z-index: 90;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 1px solid rgba(15, 23, 42, 0.12);
          border-radius: 999px;
          padding: 9px 13px 9px 10px;
          background: rgba(255, 255, 255, 0.94);
          color: #0f172a;
          font-size: 13px;
          font-weight: 800;
          line-height: 1;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
          backdrop-filter: blur(10px);
          cursor: pointer;
          transition:
            transform 0.15s ease,
            box-shadow 0.15s ease,
            background 0.15s ease;
        }

        .global-back-button:hover {
          background: #ffffff;
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.18);
          transform: translateY(-1px);
        }

        .public-back-button {
          top: 92px;
        }

        .portal-back-button {
          bottom: 22px;
        }

        @media (max-width: 900px) {
          .global-back-button {
            left: 14px;
            padding: 9px 11px 9px 9px;
          }

          .public-back-button {
            top: 88px;
          }

          .portal-back-button {
            bottom: 86px;
          }
        }

        @media print {
          .global-back-button {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
