"use client";
import { useEffect, useState } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <style>{`
        .back-to-top {
          position: fixed;
          bottom: 32px;
          right: 32px;
          z-index: 999;
          width: 44px;
          height: 44px;
          background: #2563EB;
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(37,99,235,0.4);
          transition: opacity 0.3s ease, transform 0.3s ease, background 0.2s;
        }
        .back-to-top.hidden {
          opacity: 0;
          transform: translateY(12px);
          pointer-events: none;
        }
        .back-to-top.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .back-to-top:hover {
          background: #1d4ed8;
          transform: translateY(-2px);
        }
      `}</style>

      <button
        className={`back-to-top ${visible ? "visible" : "hidden"}`}
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>
    </>
  );
}
