export default function PrincipalWelcome() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Lato:wght@300;400;700&display=swap');

        .welcome-section {
          background: #fafaf8;
          padding: 100px clamp(32px, 8vw, 120px);
          display: flex;
          align-items: flex-start;
          gap: 72px;
        }

        /* ── Portrait side ── */
        .portrait-col {
          flex: 0 0 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          position: sticky;
          top: 120px;
        }

        .portrait-frame {
          position: relative;
          width: 260px;
          height: 300px;
        }

        /* Decorative accent square behind */
        .portrait-frame::before {
          content: '';
          position: absolute;
          top: -14px;
          left: -14px;
          width: 100%;
          height: 100%;
          border: 3px solid #2563EB;
          border-radius: 4px;
          z-index: 0;
        }

        /* Gold corner accent */
        .portrait-frame::after {
          content: '';
          position: absolute;
          bottom: -14px;
          right: -14px;
          width: 60px;
          height: 60px;
          background: #FBBF24;
          border-radius: 2px;
          z-index: 0;
        }

        .portrait-img {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 4px;
          filter: grayscale(15%);
          box-shadow: 0 20px 50px rgba(0,0,0,0.18);
        }

        /* Placeholder when no real image */
        .portrait-placeholder {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
          border-radius: 4px;
          background: linear-gradient(145deg, #1e3a5f 0%, #2563EB 60%, #1d4ed8 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          padding-bottom: 24px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.2);
          overflow: hidden;
        }
        .portrait-placeholder svg {
          position: absolute;
          bottom: 0;
          opacity: 0.25;
        }

        .portrait-name {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: 1rem;
          color: #111827;
          text-align: center;
          margin-top: 8px;
        }
        .portrait-role {
          font-family: 'Lato', sans-serif;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #2563EB;
          text-align: center;
        }

        .signature {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 1.6rem;
          color: #374151;
          margin-top: 6px;
          border-top: 1px solid #e5e7eb;
          padding-top: 12px;
          width: 100%;
          text-align: center;
        }

        /* ── Speech side ── */
        .speech-col {
          flex: 1;
          min-width: 0;
        }

        .section-eyebrow {
          font-family: 'Lato', sans-serif;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #2563EB;
          margin-bottom: 12px;
        }

        .section-heading {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: clamp(1.8rem, 3vw, 2.6rem);
          line-height: 1.15;
          color: #111827;
          margin-bottom: 28px;
        }
        .section-heading em {
          font-style: italic;
          color: #2563EB;
        }

        .rule {
          width: 48px;
          height: 3px;
          background: #2563EB;
          border-radius: 2px;
          margin-bottom: 32px;
        }

        .speech-intro {
          font-family: 'Lato', sans-serif;
          font-weight: 400;
          font-size: 1rem;
          color: #374151;
          line-height: 1.85;
          margin-bottom: 20px;
        }

        .speech-body {
          font-family: 'Lato', sans-serif;
          font-weight: 300;
          font-size: 0.95rem;
          color: #4B5563;
          line-height: 1.9;
          margin-bottom: 20px;
        }

        .quote-block {
          border-left: 3px solid #2563EB;
          padding: 16px 24px;
          margin: 32px 0;
          background: #eff6ff;
          border-radius: 0 8px 8px 0;
        }
        .quote-block p {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 1.05rem;
          color: #1e40af;
          line-height: 1.7;
          margin: 0;
        }

        .read-more-btn {
          font-family: 'Lato', sans-serif;
          font-weight: 700;
          font-size: 0.8rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #2563EB;
          background: none;
          border: 2px solid #2563EB;
          padding: 10px 26px;
          cursor: pointer;
          margin-top: 12px;
          transition: background 0.2s, color 0.2s, transform 0.2s;
          border-radius: 2px;
        }
        .read-more-btn:hover {
          background: #2563EB;
          color: white;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .welcome-section { flex-direction: column; align-items: center; padding: 60px 24px; gap: 48px; }
          .portrait-col { position: static; }
        }
      `}</style>

      <section className="welcome-section">
        {/* ── LEFT: Portrait ── */}
        <div className="portrait-col">
          <div className="portrait-frame">
            <img
              src="/images/proprietor.jpeg"
              alt="Mr. Alfred Idemudia - Proprietor & Founder"
              className="portrait-img"
            />
          </div>

          <div style={{ marginTop: "28px", textAlign: "center" }}>
            <div className="portrait-name">Mr. [Alfred Idemudia]</div>
            <div className="portrait-role">Proprietor &amp; Founder</div>
            <div className="signature">Winners' Foundation</div>
          </div>
        </div>

        {/* ── RIGHT: Speech ── */}
        <div className="speech-col">
          <p className="section-eyebrow">A Word From Our Proprietor</p>
          <h2 className="section-heading">
            Welcome to
            <br />
            <em>Winners' Foundation School</em>
          </h2>
          <div className="rule" />

          <p className="speech-intro">Dear Parent and Student,</p>

          <p className="speech-body">
            It is with great joy and a deep sense of purpose that I welcome you
            to Winners' Foundation School — a place where we believe every child
            carries within them the seed of greatness, and our role is simply to
            help it flourish.
          </p>

          <div className="quote-block">
            <p>
              "We do not just educate the mind — we shape character, nurture
              faith, and build leaders who will leave lasting footprints in
              their generation."
            </p>
          </div>

          <p className="speech-body">
            We live in a world that is changing rapidly, and we understand the
            responsibility that comes with preparing your child not only for
            examinations, but for life. Our curriculum is deliberately designed
            to develop the whole child — intellectually, socially, morally, and
            spiritually.
          </p>

          <p className="speech-body">
            At Winners' Foundation School, we are committed to partnering with
            you as parents because we firmly believe that the home and school
            must work together as one. Together, we can raise a generation of
            young people who are grounded in values, driven by purpose, and
            equipped for excellence.
          </p>

          <p className="speech-body">
            Thank you for entrusting us with what matters most to you. We do not
            take that privilege lightly.
          </p>

          <button className="read-more-btn">Read Full Message →</button>
        </div>
      </section>
    </>
  );
}
