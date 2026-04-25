"use client";

import Link from "next/link";

const StudentIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="16" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M8 40c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <path d="M24 6L12 12L24 18L36 12L24 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" opacity="0.4"/>
  </svg>
);

const AdminIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="16" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M8 40c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <path d="M32 28l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="34" cy="34" r="7" stroke="currentColor" strokeWidth="1.5" fill="none"/>
  </svg>
);

const ArrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LogoIcon = () => (
  <img
    src="/images/logo.png"
    alt="Winners' Foundation School Logo"
    width={56}
    height={56}
    style={{ objectFit: "contain" }}
  />
);

export default function LoginSelectPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Lato:wght@300;400;700&display=swap');

        .login-page,
        .login-page * {
          box-sizing: border-box;
        }

        .login-page {
          min-height: 100vh;
          background: #f8fafc;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding: 180px 24px 60px;
          position: relative;
          overflow-x: hidden;
        }

        /* subtle background pattern */
        .login-page::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 20% 20%, rgba(37,99,235,0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(37,99,235,0.04) 0%, transparent 50%);
          pointer-events: none;
        }

        /* top back link */
        .back-link {
          position: absolute;
          top: 24px;
          left: 24px;
          font-family: 'Lato', sans-serif;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: #6B7280;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: color 0.2s;
        }
        .back-link:hover { color: #111827; }

        /* header */
        .login-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 48px;
          text-align: center;
          animation: fadeUp 0.7s ease both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .login-school-name {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: 1.1rem;
          color: #111827;
          margin-top: 14px;
          letter-spacing: -0.2px;
        }
        .login-school-name span { color: #2563EB; }
        .login-eyebrow {
          font-family: 'Lato', sans-serif;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #9CA3AF;
          margin-top: 20px;
          margin-bottom: 8px;
        }
        .login-heading {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: clamp(1.8rem, 4vw, 2.4rem);
          color: #111827;
          line-height: 1.15;
        }
        .login-sub {
          font-family: 'Lato', sans-serif;
          font-weight: 300;
          font-size: 0.92rem;
          color: #6B7280;
          margin-top: 10px;
          line-height: 1.7;
        }

        /* divider rule */
        .login-rule {
          width: 40px; height: 3px;
          background: #2563EB; border-radius: 2px;
          margin: 14px auto 0;
        }

        /* cards grid */
        .login-cards {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          width: 100%;
          max-width: 560px;
          animation: fadeUp 0.7s 0.15s ease both;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        @media (max-width: 480px) {
          .login-cards { grid-template-columns: 1fr; max-width: 340px; }
        }

        .login-card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 32px 28px 28px;
          background: white;
          border: 1.5px solid #e5e7eb;
          border-radius: 6px;
          text-decoration: none;
          cursor: pointer;
          transition: border-color 0.25s, box-shadow 0.25s, transform 0.2s;
          overflow: hidden;
        }
        .login-card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          background: var(--card-accent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }
        .login-card:hover {
          border-color: var(--card-accent);
          box-shadow: 0 8px 32px rgba(0,0,0,0.08);
          transform: translateY(-3px);
        }
        .login-card:hover::after { transform: scaleX(1); }

        .login-card.student { --card-accent: #2563EB; }
        .login-card.admin   { --card-accent: #111827; }

        .card-icon-wrap {
          width: 64px; height: 64px;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 20px;
        }
        .student .card-icon-wrap {
          background: #eff6ff;
          color: #2563EB;
        }
        .admin .card-icon-wrap {
          background: #f3f4f6;
          color: #111827;
        }

        .card-tag {
          font-family: 'Lato', sans-serif;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 999px;
          margin-bottom: 10px;
        }
        .student .card-tag {
          color: #2563EB;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
        }
        .admin .card-tag {
          color: #374151;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
        }

        .card-title {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: 1.25rem;
          color: #111827;
          margin-bottom: 8px;
        }
        .card-desc {
          font-family: 'Lato', sans-serif;
          font-weight: 300;
          font-size: 0.82rem;
          color: #6B7280;
          line-height: 1.65;
          flex: 1;
          margin-bottom: 24px;
        }

        .card-cta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Lato', sans-serif;
          font-weight: 700;
          font-size: 0.78rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition: gap 0.2s;
        }
        .student .card-cta { color: #2563EB; }
        .admin   .card-cta { color: #111827; }
        .login-card:hover .card-cta { gap: 12px; }

        /* footer note */
        .login-footer-note {
          font-family: 'Lato', sans-serif;
          font-size: 0.78rem;
          color: #9CA3AF;
          margin-top: 36px;
          text-align: center;
          animation: fadeUp 0.7s 0.3s ease both;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        .login-footer-note a {
          color: #2563EB;
          text-decoration: none;
          font-weight: 700;
        }
        .login-footer-note a:hover { text-decoration: underline; }
      `}</style>

      <div className="login-page">

        {/* Back to home */}
        <Link href="/" className="back-link">
          ← Back to Home
        </Link>

        {/* Header */}
        <div className="login-header">
          <LogoIcon />
          <p className="login-school-name">
            Winners' <span>Foundation</span> School
          </p>
          <p className="login-eyebrow">Portal Access</p>
          <h1 className="login-heading">Welcome Back</h1>
          <div className="login-rule" />
          <p className="login-sub">Choose how you'd like to sign in</p>
        </div>

        {/* Role selection cards */}
        <div className="login-cards">

          {/* Student */}
          <Link href="/login/student" className="login-card student">
            <div className="card-icon-wrap">
              <StudentIcon />
            </div>
            <span className="card-tag">Student</span>
            <div className="card-title">Student Login</div>
            <p className="card-desc">
              Access your results, timetable, and school resources.
            </p>
            <div className="card-cta">
              Sign In <ArrowIcon />
            </div>
          </Link>

          {/* Admin */}
          <Link href="/admin/login" className="login-card admin">
            <div className="card-icon-wrap">
              <AdminIcon />
            </div>
            <span className="card-tag">Admin</span>
            <div className="card-title">Admin Login</div>
            <p className="card-desc">
              Manage school records, staff, and administrative tools.
            </p>
            <div className="card-cta">
              Sign In <ArrowIcon />
            </div>
          </Link>

        </div>

        <p className="login-footer-note">
          Need help? <Link href="/contact">Contact the school office</Link>
        </p>

      </div>
    </>
  );
}
