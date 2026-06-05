"use client";

import Link from "next/link";
import PrincipalWelcome from "./components/PrincipalWelcome";
import OurMission from "./components/OurMission";
import WhyChooseUs from "./components/WhyChooseUs";
import WhatWeOffer from "./components/WhatWeOffer";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

const GraduationIcon = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 8L4 16L20 24L36 16L20 8Z"
      stroke="#374151"
      strokeWidth="1.8"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M12 20V28C12 28 15 32 20 32C25 32 28 28 28 28V20"
      stroke="#374151"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="36"
      y1="16"
      x2="36"
      y2="24"
      stroke="#374151"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const UniversityIcon = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 6L4 14L20 22L36 14L20 6Z"
      stroke="#374151"
      strokeWidth="1.8"
      strokeLinejoin="round"
      fill="none"
    />
    <rect
      x="10"
      y="22"
      width="4"
      height="10"
      stroke="#374151"
      strokeWidth="1.8"
      rx="0.5"
    />
    <rect
      x="18"
      y="22"
      width="4"
      height="10"
      stroke="#374151"
      strokeWidth="1.8"
      rx="0.5"
    />
    <rect
      x="26"
      y="22"
      width="4"
      height="10"
      stroke="#374151"
      strokeWidth="1.8"
      rx="0.5"
    />
    <line
      x1="6"
      y1="32"
      x2="34"
      y2="32"
      stroke="#374151"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const BookIcon = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="6"
      y="6"
      width="28"
      height="28"
      rx="2"
      stroke="#374151"
      strokeWidth="1.8"
    />
    <line x1="14" y1="6" x2="14" y2="34" stroke="#374151" strokeWidth="1.8" />
    <line x1="14" y1="14" x2="28" y2="14" stroke="#374151" strokeWidth="1.5" />
    <line x1="14" y1="20" x2="28" y2="20" stroke="#374151" strokeWidth="1.5" />
    <line x1="14" y1="26" x2="24" y2="26" stroke="#374151" strokeWidth="1.5" />
  </svg>
);

const cards = [
  {
    icon: <GraduationIcon />,
    title: "Graduation",
    desc: "Winners' Foundation School is recognized for outstanding graduation outcomes and student achievement.",
  },
  {
    icon: <UniversityIcon />,
    title: "School Life",
    desc: "Winners' Foundation School was established to nurture well-rounded, confident, and innovative individuals.",
  },
  {
    icon: <BookIcon />,
    title: "Education Services",
    desc: "Winners' Foundation School was established to provide quality and holistic educational services.",
  },
];

export default function Home() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,800;0,900;1,800&family=Lato:wght@300;400;700&display=swap');

        @keyframes heroZoom {
          from { transform: scale(1.04); }
          to   { transform: scale(1.0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .hero-wrap {
          position: relative;
          width: 100%;
          height: 100vh;
          min-height: 620px;
          background: #000;
          overflow: hidden;
        }

        /* KEY CHANGE: use <img> instead of background-image.
           object-position gives reliable, cross-browser control. */
        .hero-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 20%;
          animation: heroZoom 12s ease-out forwards;
          transform-origin: center center;
        }

        .hero-overlay-r {
          position: absolute; inset: 0;
          background: linear-gradient(to right, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.40) 55%, rgba(0,0,0,0.15) 100%);
        }
        .hero-overlay-b {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%);
        }

        .hero-desktop-content {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          padding: 90px clamp(24px, 8vw, 120px) 100px;
          animation: fadeUp 0.9s ease both;
        }
        .hero-eyebrow {
          font-family: 'Lato', sans-serif;
          font-size: 0.68rem; font-weight: 700;
          letter-spacing: 0.26em; text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          margin-bottom: 14px;
          animation: fadeUp 0.9s 0.1s ease both;
        }
        .hero-title {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: clamp(2.6rem, 5.5vw, 4.2rem);
          line-height: 1.08; color: white; letter-spacing: -0.5px;
          margin-bottom: 20px;
          animation: fadeUp 0.9s 0.2s ease both;
        }
        .hero-title em { font-style: italic; color: #93c5fd; }
        .hero-sub {
          font-family: 'Lato', sans-serif;
          font-weight: 300; font-size: 1rem;
          line-height: 1.8; color: rgba(255,255,255,0.75);
          max-width: 420px; margin-bottom: 36px;
          animation: fadeUp 0.9s 0.3s ease both;
        }
        .hero-cta-row {
          display: flex; align-items: center; gap: 20px;
          animation: fadeUp 0.9s 0.4s ease both;
        }
        .enroll-btn {
          font-family: 'Lato', sans-serif;
          font-weight: 700; font-size: 0.82rem;
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 14px 36px;
          background: #2563EB; color: white;
          border: none; cursor: pointer; border-radius: 2px;
          display: inline-block; text-decoration: none;
          box-shadow: 0 4px 20px rgba(37,99,235,0.5);
          transition: background 0.25s, transform 0.2s, box-shadow 0.25s;
        }
        .enroll-btn:hover {
          background: #1d4ed8;
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(37,99,235,0.55);
        }
        .hero-learn-link {
          font-family: 'Lato', sans-serif;
          font-size: 0.82rem; font-weight: 700;
          letter-spacing: 0.06em;
          color: rgba(255,255,255,0.65);
          text-decoration: none;
          display: inline-flex; align-items: center; gap: 6px;
          transition: color 0.2s;
        }
        .hero-learn-link:hover { color: white; }

        .trusted-badge {
          display: flex; flex-direction: column;
          align-items: center; gap: 10px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.18);
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          border-radius: 20px; padding: 28px 32px;
          min-width: 170px; text-align: center; flex-shrink: 0;
          animation: fadeUp 0.9s 0.5s ease both;
        }
        .trusted-avatars { display: flex; align-items: center; justify-content: center; }
        .avatar-dot {
          width: 32px; height: 32px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.8);
        }
        .trusted-number {
          font-family: 'Playfair Display', serif;
          font-weight: 900; font-size: 1.7rem; color: white; line-height: 1;
        }
        .trusted-label {
          font-family: 'Lato', sans-serif; font-size: 0.7rem; font-weight: 400;
          color: rgba(255,255,255,0.6); letter-spacing: 0.06em;
        }
        .trusted-stars { font-size: 0.72rem; color: #FBBF24; letter-spacing: 3px; }

        /* ── MOBILE ── */
        .hero-mobile-card { display: none; }

        @media (max-width: 768px) {
          /* object-position on an <img> is reliable — this will work */
          .hero-img {
            object-position: center -5%;
            animation: none;
            transform: none;
          }

          /* lighten the side overlay on mobile so the school shows through */
          .hero-overlay-r {
            background: linear-gradient(
              to right,
              rgba(0,0,0,0.10) 0%,
              rgba(0,0,0,0.05) 100%
            );
          }
          /* heavy bottom gradient so text is always readable */
          .hero-overlay-b {
            background: linear-gradient(
              to top,
              rgba(0,0,0,0.88) 0%,
              rgba(0,0,0,0.65) 32%,
              rgba(0,0,0,0.20) 58%,
              transparent 100%
            );
          }

          .hero-desktop-content { display: none; }

          .hero-mobile-card {
            display: flex;
            flex-direction: column;
            position: absolute;
            bottom: 0; left: 0; right: 0;
            z-index: 10;
            padding: 0 22px 44px;
            animation: fadeUp 0.9s 0.15s ease both;
          }

          .mob-eyebrow {
            display: inline-flex; align-items: center; gap: 7px;
            font-family: 'Lato', sans-serif;
            font-size: 0.6rem; font-weight: 700;
            letter-spacing: 0.2em; text-transform: uppercase;
            color: #93c5fd;
            border: 1px solid rgba(147,197,253,0.28);
            background: rgba(37,99,235,0.18);
            padding: 5px 13px;
            border-radius: 999px;
            margin-bottom: 18px;
            width: fit-content;
          }
          .mob-eyebrow-dot {
            width: 5px; height: 5px;
            background: #60a5fa; border-radius: 50%;
            flex-shrink: 0;
          }
          .mob-title {
            font-family: 'Playfair Display', serif;
            font-weight: 900;
            font-size: clamp(2.1rem, 8.5vw, 3rem);
            line-height: 1.1; color: white; letter-spacing: -0.3px;
            margin-bottom: 12px;
          }
          .mob-title em { font-style: italic; color: #93c5fd; }
          .mob-sub {
            font-family: 'Lato', sans-serif;
            font-weight: 300; font-size: 0.875rem;
            line-height: 1.75; color: rgba(255,255,255,0.62);
            margin-bottom: 22px;
          }
          .mob-stats {
            display: flex;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 14px;
            overflow: hidden;
            background: rgba(255,255,255,0.06);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            margin-bottom: 26px;
          }
          .mob-stat {
            flex: 1; padding: 13px 8px; text-align: center;
            border-right: 1px solid rgba(255,255,255,0.08);
          }
          .mob-stat:last-child { border-right: none; }
          .mob-stat-num {
            font-family: 'Playfair Display', serif;
            font-weight: 900; font-size: 1.25rem;
            color: white; line-height: 1; margin-bottom: 3px;
          }
          .mob-stat-label {
            font-family: 'Lato', sans-serif;
            font-size: 0.58rem; font-weight: 700;
            letter-spacing: 0.1em; text-transform: uppercase;
            color: rgba(255,255,255,0.4);
          }
          .mob-cta-row {
            display: flex; gap: 10px; align-items: stretch;
          }
          .mob-enroll-btn {
            font-family: 'Lato', sans-serif;
            font-weight: 700; font-size: 0.78rem;
            letter-spacing: 0.1em; text-transform: uppercase;
            padding: 15px 20px;
            background: #2563EB; color: white;
            border: none; cursor: pointer; border-radius: 3px;
            display: inline-block; text-decoration: none;
            box-shadow: 0 4px 20px rgba(37,99,235,0.45);
            flex: 1; text-align: center;
            transition: background 0.2s, transform 0.15s;
          }
          .mob-enroll-btn:hover { background: #1d4ed8; transform: translateY(-1px); }
          .mob-ghost-btn {
            font-family: 'Lato', sans-serif;
            font-weight: 700; font-size: 0.78rem;
            letter-spacing: 0.1em; text-transform: uppercase;
            padding: 15px 18px;
            background: transparent; color: rgba(255,255,255,0.75);
            border: 1px solid rgba(255,255,255,0.22);
            cursor: pointer; border-radius: 3px;
            display: inline-block; text-decoration: none;
            text-align: center; white-space: nowrap;
            transition: border-color 0.2s, color 0.2s;
          }
          .mob-ghost-btn:hover { border-color: rgba(255,255,255,0.55); color: white; }
        }

        /* ── INFO CARDS ── */
        .info-cards-wrap {
          display: flex; background: white;
          box-shadow: 0 8px 40px rgba(0,0,0,0.13);
          max-width: 900px;
          margin: -80px auto 0;
          position: relative; z-index: 20;
        }
        .info-card {
          flex: 1; padding: 28px 26px 24px;
          border-right: 1px solid #f0f0f0;
          transition: box-shadow 0.2s;
        }
        .info-card:last-child { border-right: none; }
        .info-card:hover { box-shadow: inset 0 -4px 0 0 #2563EB; }
        .card-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.05rem; font-weight: 800; color: #111827;
          margin: 12px 0 7px;
        }
        .card-desc {
          font-family: 'Lato', sans-serif;
          font-size: 0.8rem; color: #6B7280; line-height: 1.65;
        }
        .learn-more {
          font-family: 'Lato', sans-serif;
          font-size: 0.78rem; font-weight: 700; color: #1F2937;
          margin-top: 14px; display: inline-flex;
          align-items: center; gap: 5px;
          cursor: pointer; background: none; border: none; padding: 0;
          transition: color 0.2s;
        }
        .learn-more:hover { color: #2563EB; }

        .teacher-careers-section {
          background: #f8fafc;
          padding: 80px clamp(24px, 8vw, 120px);
          border-top: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
        }
        .teacher-careers-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 42px;
          align-items: center;
        }
        .teacher-careers-eyebrow {
          font-family: 'Lato', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #2563EB;
          margin-bottom: 14px;
        }
        .teacher-careers-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 4vw, 3.2rem);
          font-weight: 900;
          line-height: 1.1;
          color: #0f172a;
          margin-bottom: 18px;
        }
        .teacher-careers-text {
          font-family: 'Lato', sans-serif;
          color: #475569;
          line-height: 1.85;
          max-width: 580px;
          margin-bottom: 28px;
        }
        .teacher-careers-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 3px;
          background: #2563EB;
          color: white;
          padding: 14px 28px;
          font-family: 'Lato', sans-serif;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          transition: background 0.2s, transform 0.2s;
        }
        .teacher-careers-btn:hover {
          background: #1d4ed8;
          transform: translateY(-2px);
        }
        .teacher-careers-list {
          display: grid;
          gap: 12px;
        }
        .teacher-careers-item {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px 18px;
          font-family: 'Lato', sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          color: #334155;
          box-shadow: 0 12px 30px rgba(15,23,42,0.05);
        }

        @media (max-width: 768px) {
          .teacher-careers-section { padding: 56px 22px; }
          .teacher-careers-inner { grid-template-columns: 1fr; gap: 28px; }
          .teacher-careers-btn { width: 100%; }
        }

        @media (max-width: 768px) {
          .info-cards-wrap {
            flex-direction: column; margin: 0 auto;
            box-shadow: none; border-top: 1px solid #f0f0f0;
          }
          .info-card { border-right: none; border-bottom: 1px solid #f0f0f0; }
          .info-card:last-child { border-bottom: none; }
        }
      `}</style>

      <div>
        {/* ── HERO ── */}
        <div className="hero-wrap">
          {/* <img> with object-position — far more reliable than background-position */}
          <img
            src="/images/Hero.jpeg"
            alt="Winners' Foundation School campus"
            className="hero-img"
          />
          <div className="hero-overlay-r" />
          <div className="hero-overlay-b" />

          {/* DESKTOP */}
          <div className="hero-desktop-content">
            <div style={{ maxWidth: "560px" }}>
              <p className="hero-eyebrow">Winners' Foundation School</p>
              <h1 className="hero-title">
                Together We'll
                <br />
                <em>Explore</em> New Things
              </h1>
              <p className="hero-sub">
                A leading school dedicated to academic excellence, character
                development, and innovation.
              </p>
              <div className="hero-cta-row">
                <Link href="/admissions" className="enroll-btn">
                  Enroll Now
                </Link>
                <Link href="/about" className="hero-learn-link">
                  Learn More →
                </Link>
              </div>
            </div>
            <div className="trusted-badge">
              <div className="trusted-avatars">
                {["#60a5fa", "#34d399", "#f472b6", "#fbbf24"].map((c, i) => (
                  <div
                    key={i}
                    className="avatar-dot"
                    style={{
                      background: c,
                      marginLeft: i === 0 ? 0 : "-10px",
                      zIndex: 4 - i,
                    }}
                  />
                ))}
              </div>
              <div>
                <div className="trusted-number">500+</div>
                <div className="trusted-label">Students trust us</div>
              </div>
              <div className="trusted-stars">★★★★★</div>
            </div>
          </div>

          {/* MOBILE */}
          <div className="hero-mobile-card">
            <span className="mob-eyebrow">
              <span className="mob-eyebrow-dot" />
              Winners' Foundation School
            </span>
            <h1 className="mob-title">
              Together We'll
              <br />
              <em>Explore</em> New Things
            </h1>
            <p className="mob-sub">
              A leading school in Benin City dedicated to excellence, character,
              and innovation.
            </p>
            <div className="mob-stats">
              <div className="mob-stat">
                <div className="mob-stat-num">500+</div>
                <div className="mob-stat-label">Students</div>
              </div>
              <div className="mob-stat">
                <div className="mob-stat-num">★ 5.0</div>
                <div className="mob-stat-label">Rated</div>
              </div>
              <div className="mob-stat">
                <div className="mob-stat-num">100%</div>
                <div className="mob-stat-label">Faith-based</div>
              </div>
            </div>
            <div className="mob-cta-row">
              <Link href="/admissions" className="mob-enroll-btn">
                Enroll Now
              </Link>
              <Link href="/about" className="mob-ghost-btn">
                About Us
              </Link>
            </div>
          </div>
        </div>

        {/* ── INFO CARDS ── */}
        <div className="info-cards-wrap">
          {cards.map((card, i) => (
            <div key={i} className="info-card">
              {card.icon}
              <div className="card-title">{card.title}</div>
              <p className="card-desc">{card.desc}</p>
              <button className="learn-more">
                Learn More <span>→</span>
              </button>
            </div>
          ))}
        </div>

        <PrincipalWelcome />
        <OurMission />
        <WhyChooseUs />
        <WhatWeOffer />
        <section className="teacher-careers-section">
          <div className="teacher-careers-inner">
            <div>
              <p className="teacher-careers-eyebrow">Teach with us</p>
              <h2 className="teacher-careers-title">
                Join a school that values excellent teachers.
              </h2>
              <p className="teacher-careers-text">
                We are always glad to hear from passionate teachers who can help
                students grow in knowledge, discipline, confidence, and
                character. Submit your details and CV for review by the school.
              </p>
              <Link href="/careers" className="teacher-careers-btn">
                Apply as a Teacher
              </Link>
            </div>
            <div className="teacher-careers-list">
              {[
                "Upload your CV online",
                "Apply for nursery, primary, or secondary roles",
                "Share your subject strength and experience",
              ].map((item) => (
                <div key={item} className="teacher-careers-item">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
        <ContactSection />
        <Footer />
      </div>
    </>
  );
}
