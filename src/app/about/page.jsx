"use client";

import { useState } from "react";
import Footer from "../components/Footer";
import OurMission from "../components/OurMission";

const _PREVIEW = `Winners' foundation school believes in excellence without compromise in all areas of human endeavor. Hence, our motto is "Excellence through faith and industry" the school was born with the intent of raising a generation of pupils and students with solid academic foundation that will promote excellence in any sphere of life, be it academic, spiritual, social and physical. To realize this we have a team of committed dedicated, loving and inspiring teachers to discharge their duties cheerfully and willingly.

Provision of sound spiritual and moral child upbringing is our major concern this is because of the alarming rate of moral decadence in our society today. Our mission is to produces educated men and women of godly men and women of godly and enviable characters. Winners' foundation school therefore strives to provide a biblically integrated education which seeks to nurture the development of the students spiritually, socially and morally.`;

const _REST = `Our staff are spiritually equipped to lead the students to the saving knowledge of Jesus Christ by teaching the undiluted word of God and praying for them whole heartedly in our gospel fellowships and every day morning assemblies. We place the bible at the center of the curriculum to inspire the students to fear God and eschew evil in this corrupt world.

Further more, in our quest for excellence, we inspire our students to acquire knowledge for self actualization. Knowledge they say is power. Hence we challenge our students to realize their maximum potential academically to enable them imbibe self confidence and earn respect in life. Our mission is not to just educate the child but to help him/her to discover who he/she is.

Winners' foundation school aims to discover talents in our pupils and students in other to prepare them for profitable living. We therefore, take cognizance of differences in talents in other to adequately prepare the recipient for profitable career in life. This we do by diversifying our curriculum to meet the needs and challenges of each students as well as their diver's interests and talents. In winners' foundation school, we engaged the students through the well structure teaching targeted at building and developing each student intellectually. Other activities such as sport.

Quiz competition, excursion etc are not left out in our curriculum. Students are provided with the opportunities to develop logical thinking processes and problem solving initiative as well as being encouraged to be creative and develop new ideas and solutions for problems of different types.

WINNERS' FOUNDATION SCHOOL IS TRULY GREAT. UP WINNER'S!!!`;

const values = [
  {
    title: "Faith",
    desc: "Rooted in biblical principles, we nurture spiritual growth in every student.",
  },
  {
    title: "Excellence",
    desc: "We pursue the highest academic and moral standards without compromise.",
  },
  {
    title: "Discipline",
    desc: "We build character through structure, respect, and responsibility.",
  },
  {
    title: "Innovation",
    desc: "We encourage creative thinking and problem-solving for tomorrow's world.",
  },
];

export default function AboutPage() {
  const [_expanded, _setExpanded] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Lato:wght@300;400;700&display=swap');

        /* ── Hero ── */
        .about-hero {
          background: #0f172a;
          padding: 160px clamp(48px, 10vw, 160px) 80px;
          position: relative;
          overflow: hidden;
        }
        .about-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 20% 50%, rgba(37,99,235,0.2) 0%, transparent 60%);
        }
        .about-hero-eyebrow {
          font-family: 'Lato', sans-serif;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #60a5fa;
          margin-bottom: 14px;
        }
        .about-hero-heading {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: clamp(2.4rem, 5vw, 4rem);
          color: white;
          line-height: 1.1;
          margin-bottom: 20px;
        }
        .about-hero-heading em {
          font-style: italic;
          color: #60a5fa;
        }
        .about-hero-sub {
          font-family: 'Lato', sans-serif;
          font-weight: 300;
          font-size: 1rem;
          color: rgba(255,255,255,0.6);
          max-width: 500px;
          line-height: 1.8;
        }
        .about-hero-rule {
          width: 52px;
          height: 3px;
          background: #2563EB;
          border-radius: 2px;
          margin-bottom: 24px;
        }

        /* ── History ── */
        .history-section {
          background: #ffffff;
          padding: 90px clamp(48px, 10vw, 160px);
          display: flex;
          gap: 72px;
          align-items: flex-start;
        }
        @media (max-width: 768px) {
          .history-section { flex-direction: column; gap: 40px; }
        }
        .history-eyebrow {
          font-family: 'Lato', sans-serif;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #2563EB;
          margin-bottom: 12px;
        }
        .history-heading {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: clamp(1.6rem, 2.5vw, 2.2rem);
          color: #111827;
          line-height: 1.2;
          margin-bottom: 16px;
        }
        .history-rule {
          width: 48px;
          height: 3px;
          background: #2563EB;
          border-radius: 2px;
          margin-bottom: 24px;
        }
        .history-body {
          font-family: 'Lato', sans-serif;
          font-weight: 300;
          font-size: 0.97rem;
          color: #4B5563;
          line-height: 1.9;
          margin-bottom: 20px;
        }

        /* ── Values ── */
        .values-section {
          background: #f9fafb;
          padding: 80px clamp(48px, 10vw, 160px);
          border-top: 1px solid #f0f0f0;
        }
        .values-eyebrow {
          font-family: 'Lato', sans-serif;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #2563EB;
          margin-bottom: 12px;
          text-align: center;
        }
        .values-heading {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: clamp(1.7rem, 2.5vw, 2.3rem);
          color: #111827;
          text-align: center;
          margin-bottom: 16px;
        }
        .values-rule {
          width: 48px;
          height: 3px;
          background: #2563EB;
          border-radius: 2px;
          margin: 0 auto 48px;
        }
        .values-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        @media (max-width: 900px) { .values-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 500px) { .values-grid { grid-template-columns: 1fr; } }
        .value-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          padding: 28px 24px;
          text-align: center;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .value-card:hover {
          border-color: #2563EB;
          box-shadow: 0 4px 20px rgba(37,99,235,0.08);
        }
        .value-number {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: 2rem;
          color: #dbeafe;
          margin-bottom: 10px;
        }
        .value-title {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: 1rem;
          color: #111827;
          margin-bottom: 8px;
        }
        .value-desc {
          font-family: 'Lato', sans-serif;
          font-weight: 300;
          font-size: 0.85rem;
          color: #6B7280;
          line-height: 1.7;
        }

        /* ── Mission ── */
        .mission-section {
          background: #ffffff;
          padding: 90px clamp(48px, 10vw, 160px);
        }
        .mission-eyebrow {
          font-family: 'Lato', sans-serif;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #2563EB;
          margin-bottom: 14px;
        }
        .mission-heading {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: clamp(1.8rem, 3vw, 2.4rem);
          color: #111827;
          margin-bottom: 16px;
          line-height: 1.2;
        }
        .mission-rule {
          width: 48px;
          height: 3px;
          background: #2563EB;
          border-radius: 2px;
          margin-bottom: 28px;
        }
        .mission-motto {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 1rem;
          color: #2563EB;
          margin-bottom: 24px;
        }
        .mission-body {
          font-family: 'Lato', sans-serif;
          font-weight: 400;
          font-size: 1.05rem;
          color: #374151;
          line-height: 2;
          margin-bottom: 28px;
          white-space: pre-line;
        }
        .mission-closing {
          font-family: 'Lato', sans-serif;
          font-weight: 700;
          font-size: 1rem;
          color: #111827;
          line-height: 2;
          margin-bottom: 28px;
        }
        .mission-pillars {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin: 32px 0 36px;
        }
        .pillar-tag {
          font-family: 'Lato', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #2563EB;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          padding: 7px 16px;
          border-radius: 999px;
        }
        .rest-text {
          overflow: hidden;
          transition: max-height 0.5s ease, opacity 0.4s ease;
        }
        .rest-text.hidden { max-height: 0; opacity: 0; }
        .rest-text.visible { max-height: 2000px; opacity: 1; }

        .read-more-btn {
          font-family: 'Lato', sans-serif;
          font-weight: 700;
          font-size: 0.82rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #2563EB;
          background: none;
          border: 2px solid #2563EB;
          padding: 11px 30px;
          cursor: pointer;
          transition: background 0.2s, color 0.2s, transform 0.2s;
          border-radius: 2px;
        }
        .read-more-btn:hover {
          background: #2563EB;
          color: white;
          transform: translateY(-2px);
        }
      `}</style>
      {/* Hero */}
      <section className="about-hero">
        <div style={{ position: "relative", zIndex: 1 }}>
          <p className="about-hero-eyebrow">Who We Are</p>
          <h1 className="about-hero-heading">
            About <em>Winners'</em>
            <br />
            Foundation School
          </h1>
          <div className="about-hero-rule" />
          <p className="about-hero-sub">
            Founded in Benin City, we are a school built on faith, academic
            excellence, and the total development of every child.
          </p>
        </div>
      </section>

      {/* History */}
      <section className="history-section">
        <div style={{ flex: 1 }}>
          <p className="history-eyebrow">Our Story</p>
          <h2 className="history-heading">A School Born with Purpose</h2>
          <div className="history-rule" />
          <p className="history-body">
            Winners' Foundation School was established in Benin City with a
            clear and unwavering vision — to raise a generation of young
            Nigerians who are not only academically excellent but are also
            grounded in faith, strong values, and moral integrity.
          </p>
          <p className="history-body">
            From our very first class, we set out to be different. We understood
            that true education goes beyond textbooks and examinations. It
            shapes who a person becomes — how they think, how they treat others,
            and how they contribute to society. That conviction has guided every
            decision we have made as a school.
          </p>
          <p className="history-body">
            Today, Winners' Foundation School stands as a thriving community of
            learners, educators, and families united by a shared belief: that
            every child is a winner waiting to be discovered.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="values-section">
        <p className="values-eyebrow">What We Stand For</p>
        <h2 className="values-heading">Our Core Values</h2>
        <div className="values-rule" />
        <div className="values-grid">
          {values.map((v, i) => (
            <div key={i} className="value-card">
              <div className="value-number">0{i + 1}</div>
              <div className="value-title">{v.title}</div>
              <p className="value-desc">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <OurMission />
      <Footer />
    </>
  );
}
