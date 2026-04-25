export default function WhyChooseUs() {
  const reasons = [
    {
      title: "Experienced Teachers",
      desc: "Our educators are qualified, dedicated, and passionate about bringing out the best in every student.",
    },
    {
      title: "Safe Environment",
      desc: "We provide a secure, nurturing, and structured environment where every child can learn and thrive.",
    },
    {
      title: "Proven Results",
      desc: "Our students consistently achieve outstanding results in WAEC and NECO examinations year after year.",
    },
    {
      title: "Strong Discipline",
      desc: "We instil discipline as a core value — shaping students into responsible, respectful, and purposeful individuals.",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Lato:wght@300;400;700&display=swap');

        .wcu-section {
          background: #f9fafb;
          padding: 90px clamp(48px, 10vw, 180px);
          border-top: 1px solid #f0f0f0;
        }

        .wcu-header {
          margin-bottom: 56px;
        }

        .wcu-eyebrow {
          font-family: 'Lato', sans-serif;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #2563EB;
          margin-bottom: 12px;
        }

        .wcu-heading {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: clamp(1.9rem, 3vw, 2.6rem);
          color: #111827;
          margin-bottom: 14px;
          line-height: 1.2;
        }

        .wcu-rule {
          width: 48px;
          height: 3px;
          background: #2563EB;
          border-radius: 2px;
          margin-bottom: 18px;
        }

        .wcu-subtext {
          font-family: 'Lato', sans-serif;
          font-weight: 300;
          font-size: 1rem;
          color: #6B7280;
          line-height: 1.8;
          max-width: 520px;
        }

        .wcu-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        @media (max-width: 640px) {
          .wcu-grid { grid-template-columns: 1fr; }
        }

        .wcu-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          padding: 32px 30px;
          display: flex;
          gap: 20px;
          align-items: flex-start;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .wcu-card:hover {
          border-color: #2563EB;
          box-shadow: 0 4px 20px rgba(37,99,235,0.08);
        }

        .wcu-number {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: 2rem;
          color: #dbeafe;
          line-height: 1;
          flex-shrink: 0;
          width: 40px;
        }

        .wcu-card-title {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: 1.05rem;
          color: #111827;
          margin-bottom: 8px;
        }

        .wcu-card-desc {
          font-family: 'Lato', sans-serif;
          font-weight: 300;
          font-size: 0.92rem;
          color: #4B5563;
          line-height: 1.8;
        }

        .wcu-note {
          margin-top: 48px;
          padding: 20px 28px;
          background: #eff6ff;
          border-left: 3px solid #2563EB;
          border-radius: 0 4px 4px 0;
          font-family: 'Lato', sans-serif;
          font-size: 0.92rem;
          font-weight: 400;
          color: #1e40af;
          line-height: 1.7;
        }
        .wcu-note strong {
          font-weight: 700;
        }
      `}</style>

      <section className="wcu-section">
        <div className="wcu-header">
          <p className="wcu-eyebrow">Why Choose Us</p>
          <h2 className="wcu-heading">The Right Choice<br />for Your Child</h2>
          <div className="wcu-rule" />
          <p className="wcu-subtext">
            Choosing the right school is one of the most important decisions a parent can make. Here is why families trust Winners' Foundation School.
          </p>
        </div>

        <div className="wcu-grid">
          {reasons.map((item, i) => (
            <div key={i} className="wcu-card">
              <div className="wcu-number">0{i + 1}</div>
              <div>
                <div className="wcu-card-title">{item.title}</div>
                <p className="wcu-card-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="wcu-note">
          <strong>Important for parents:</strong> We understand that entrusting your child to a school is a deeply personal decision. At Winners' Foundation School, we welcome you to visit, ask questions, and see our environment for yourself.
        </div>
      </section>
    </>
  );
}
