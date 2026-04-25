"use client";
import { useState } from "react";

const PREVIEW = `Winners' foundation school believes in excellence without compromise in all areas of human endeavor. Hence, our motto is "Excellence through faith and industry" the school was born with the intent of raising a generation of pupils and students with solid academic foundation that will promote excellence in any sphere of life, be it academic, spiritual, social and physical. To realize this we have a team of committed dedicated, loving and inspiring teachers to discharge their duties cheerfully and willingly.

Provision of sound spiritual and moral child upbringing is our major concern this is because of the alarming rate of moral decadence in our society today. Our mission is to produces educated men and women of godly men and women of godly and enviable characters. Winners' foundation school therefore strives to provide a biblically integrated education which seeks to nurture the development of the students spiritually, socially and morally.`;

const REST = `Our staff are spiritually equipped to lead the students to the saving knowledge of Jesus Christ by teaching the undiluted word of God and praying for them whole heartedly in our gospel fellowships and every day morning assemblies. We place the bible at the center of the curriculum to inspire the students to fear God and eschew evil in this corrupt world.

Further more, in our quest for excellence, we inspire our students to acquire knowledge for self actualization. Knowledge they say is power. Hence we challenge our students to realize their maximum potential academically to enable them imbibe self confidence and earn respect in life. Our mission is not to just educate the child but to help him/her to discover who he/she is.

Winners' foundation school aims to discover talents in our pupils and students in other to prepare them for profitable living. We therefore, take cognizance of differences in talents in other to adequately prepare the recipient for profitable career in life. This we do by diversifying our curriculum to meet the needs and challenges of each students as well as their diver's interests and talents. In winners' foundation school, we engaged the students through the well structure teaching targeted at building and developing each student intellectually. Other activities such as sport.

Quiz competition, excursion etc are not left out in our curriculum. Students are provided with the opportunities to develop logical thinking processes and problem solving initiative as well as being encouraged to be creative and develop new ideas and solutions for problems of different types.

WINNERS' FOUNDATION SCHOOL IS TRULY GREAT. UP WINNER'S!!!`;

export default function OurMission() {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Lato:wght@300;400;700&display=swap');

        .mission-section {
          background: #ffffff;
          padding: 100px clamp(48px, 12vw, 220px);
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
          font-size: clamp(2rem, 3.5vw, 2.8rem);
          color: #111827;
          margin-bottom: 18px;
          line-height: 1.2;
        }

        .mission-rule {
          width: 52px;
          height: 3px;
          background: #2563EB;
          border-radius: 2px;
          margin-bottom: 36px;
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
          letter-spacing: 0.02em;
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

        .rest-text {
          overflow: hidden;
          transition: max-height 0.5s ease, opacity 0.4s ease;
        }
        .rest-text.hidden {
          max-height: 0;
          opacity: 0;
        }
        .rest-text.visible {
          max-height: 2000px;
          opacity: 1;
        }
      `}</style>

      <section className="mission-section">
        <p className="mission-eyebrow">Who We Are</p>
        <h2 className="mission-heading">Our Mission</h2>
        <div className="mission-rule" />

        {/* Always-visible preview */}
        <p className="mission-body">{PREVIEW}</p>

        {/* Expandable rest */}
        <div className={`rest-text ${expanded ? "visible" : "hidden"}`}>
          <p className="mission-body">{REST.split("\n\n").slice(0, -1).join("\n\n")}</p>
          <p className="mission-closing">{REST.split("\n\n").slice(-1)[0]}</p>
        </div>

        <div className="mission-pillars">
          {["Academic Excellence", "Spiritual Growth", "Moral Character", "Talent Development", "Creative Thinking"].map((p) => (
            <span key={p} className="pillar-tag">{p}</span>
          ))}
        </div>

        <button className="read-more-btn" onClick={() => setExpanded(!expanded)}>
          {expanded ? "Show Less ↑" : "Read Full Message →"}
        </button>
      </section>
    </>
  );
}
