"use client";

import Link from "next/link";

const StudentIcon = () => (
  <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="16" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M8 40c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <path d="M24 6L12 12L24 18L36 12L24 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" opacity="0.5"/>
  </svg>
);

const AdminIcon = () => (
  <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="16" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M8 40c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <path d="M32 28l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="34" cy="34" r="7" stroke="currentColor" strokeWidth="1.5" fill="none"/>
  </svg>
);

export default function LoginSelectPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Lato:wght@300;400;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .lp-root {
          min-height: 100vh;
          background: #0a0f1e;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 24px 60px;
          position: relative;
          overflow: hidden;
        }

        .lp-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          opacity: 0.18;
        }
        .lp-blob-1 { width: 500px; height: 500px; background: #2563EB; top: -120px; left: -120px; }
        .lp-blob-2 { width: 400px; height: 400px; background: #1e40af; bottom: -100px; right: -100px; }
        .lp-blob-3 { width: 300px; height: 300px; background: #93c5fd; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.06; }

        .lp-grid {
          position: absolute; inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 32px 32px;
          pointer-events: none;
        }

        .lp-inner {
          position: relative; z-index: 10;
          display: flex; flex-direction: column; align-items: center;
          width: 100%; max-width: 520px;
        }

        .lp-back {
          align-self: flex-start;
          font-family: 'Lato', sans-serif;
          font-size: 0.75rem; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          text-decoration: none;
          display: flex; align-items: center; gap: 6px;
          margin-bottom: 40px;
          transition: color 0.2s;
          animation: fadeIn 0.6s ease both;
        }
        .lp-back:hover { color: rgba(255,255,255,0.7); }

        .lp-brand {
          display: flex; flex-direction: column; align-items: center;
          margin-bottom: 36px;
          animation: fadeUp 0.7s 0.05s ease both;
        }
        .lp-logo-ring {
          width: 68px; height: 68px; border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(12px);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 14px;
          box-shadow: 0 0 0 6px rgba(37,99,235,0.08);
        }
        .lp-school-name {
          font-family: 'Playfair Display', serif;
          font-weight: 900; font-size: 1rem;
          color: rgba(255,255,255,0.9);
          letter-spacing: -0.2px; text-align: center;
        }
        .lp-school-name span { color: #93c5fd; }

        .lp-heading-block {
          text-align: center; margin-bottom: 40px;
          animation: fadeUp 0.7s 0.12s ease both;
        }
        .lp-eyebrow {
          font-family: 'Lato', sans-serif;
          font-size: 0.62rem; font-weight: 700;
          letter-spacing: 0.28em; text-transform: uppercase;
          color: #60a5fa; margin-bottom: 10px;
        }
        .lp-divider {
          width: 36px; height: 2px;
          background: linear-gradient(90deg, #2563EB, #60a5fa);
          border-radius: 2px; margin: 0 auto 12px;
        }
        .lp-title {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: clamp(2rem, 5vw, 2.6rem);
          color: #fff; line-height: 1.1; margin-bottom: 10px;
        }
        .lp-title em {
          font-style: italic;
          background: linear-gradient(90deg, #93c5fd, #60a5fa, #93c5fd);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        .lp-sub {
          font-family: 'Lato', sans-serif;
          font-weight: 300; font-size: 0.88rem;
          color: rgba(255,255,255,0.4); line-height: 1.7;
        }

        .lp-cards {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 16px; width: 100%;
          animation: fadeUp 0.7s 0.22s ease both;
        }
        @media (max-width: 480px) {
          .lp-cards { grid-template-columns: 1fr; }
        }

        .lp-card {
          position: relative;
          display: flex; flex-direction: column;
          padding: 28px 24px 24px;
          border-radius: 12px;
          text-decoration: none; overflow: hidden;
          transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .lp-card::after {
          content: ''; position: absolute;
          bottom: 0; left: 0; right: 0; height: 2px;
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.35s ease;
        }
        .lp-card:hover { transform: translateY(-4px); }
        .lp-card:hover::after { transform: scaleX(1); }

        .lp-card.student { background: rgba(37,99,235,0.10); }
        .lp-card.student::after { background: linear-gradient(90deg, #2563EB, #60a5fa); }
        .lp-card.student:hover { border-color: rgba(37,99,235,0.4); box-shadow: 0 12px 40px rgba(37,99,235,0.2); }

        .lp-card.admin { background: rgba(255,255,255,0.04); }
        .lp-card.admin::after { background: linear-gradient(90deg, rgba(255,255,255,0.4), rgba(255,255,255,0.1)); }
        .lp-card.admin:hover { border-color: rgba(255,255,255,0.18); box-shadow: 0 12px 40px rgba(0,0,0,0.3); }

        .lp-card-icon {
          width: 52px; height: 52px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 18px;
        }
        .student .lp-card-icon { background: rgba(37,99,235,0.2); color: #93c5fd; border: 1px solid rgba(37,99,235,0.3); }
        .admin   .lp-card-icon { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.1); }

        .lp-card-tag {
          font-family: 'Lato', sans-serif;
          font-size: 0.58rem; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          padding: 3px 9px; border-radius: 999px;
          width: fit-content; margin-bottom: 10px;
        }
        .student .lp-card-tag { background: rgba(37,99,235,0.2); color: #93c5fd; border: 1px solid rgba(37,99,235,0.3); }
        .admin   .lp-card-tag { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.5); border: 1px solid rgba(255,255,255,0.1); }

        .lp-card-title {
          font-family: 'Playfair Display', serif;
          font-weight: 900; font-size: 1.2rem; margin-bottom: 8px;
        }
        .student .lp-card-title { color: #fff; }
        .admin   .lp-card-title { color: rgba(255,255,255,0.9); }

        .lp-card-desc {
          font-family: 'Lato', sans-serif;
          font-weight: 300; font-size: 0.8rem;
          line-height: 1.65; flex: 1; margin-bottom: 22px;
        }
        .student .lp-card-desc { color: rgba(147,197,253,0.6); }
        .admin   .lp-card-desc { color: rgba(255,255,255,0.35); }

        .lp-card-cta {
          display: flex; align-items: center; gap: 8px;
          font-family: 'Lato', sans-serif;
          font-weight: 700; font-size: 0.74rem;
          letter-spacing: 0.1em; text-transform: uppercase;
          transition: gap 0.2s;
        }
        .student .lp-card-cta { color: #60a5fa; }
        .admin   .lp-card-cta { color: rgba(255,255,255,0.5); }
        .lp-card:hover .lp-card-cta { gap: 12px; }

        .lp-foot {
          font-family: 'Lato', sans-serif;
          font-size: 0.76rem; color: rgba(255,255,255,0.25);
          margin-top: 28px; text-align: center;
          animation: fadeUp 0.7s 0.32s ease both;
        }
        .lp-foot a { color: #60a5fa; text-decoration: none; font-weight: 700; transition: color 0.2s; }
        .lp-foot a:hover { color: #93c5fd; }
      `}</style>

      <div className="lp-root mt-28 md:mt-25">
        <div className="lp-blob lp-blob-1" />
        <div className="lp-blob lp-blob-2" />
        <div className="lp-blob lp-blob-3" />
        <div className="lp-grid" />

        <div className="lp-inner">

          <Link href="/" className="lp-back">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Home
          </Link>

          <div className="lp-brand">
            <div className="lp-logo-ring">
              <img src="/logo.PNG" alt="Winners' Foundation School" width={40} height={40} style={{ objectFit: "contain" }} />
            </div>
            <p className="lp-school-name">Winners&apos; <span>Foundation</span> School</p>
          </div>

          <div className="lp-heading-block">
            <p className="lp-eyebrow">Portal Access</p>
            <div className="lp-divider" />
            <h1 className="lp-title">Welcome <em>Back</em></h1>
            <p className="lp-sub">Choose your portal to continue</p>
          </div>

          <div className="lp-cards">
            <Link href="/login/student" className="lp-card student">
              <div className="lp-card-icon"><StudentIcon /></div>
              <span className="lp-card-tag">Student</span>
              <div className="lp-card-title">Student Login</div>
              <p className="lp-card-desc">Access your results, timetable, and school resources.</p>
              <div className="lp-card-cta">
                Sign In
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </Link>

            <Link href="/admin/login" className="lp-card admin">
              <div className="lp-card-icon"><AdminIcon /></div>
              <span className="lp-card-tag">Admin</span>
              <div className="lp-card-title">Admin Login</div>
              <p className="lp-card-desc">Manage school records, staff, and administrative tools.</p>
              <div className="lp-card-cta">
                Sign In
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </Link>
          </div>

          <p className="lp-foot">
            Need help? <Link href="/contact">Contact the school office</Link>
          </p>

        </div>
      </div>
    </>
  );
}