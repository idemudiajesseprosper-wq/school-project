export default function WhatWeOffer() {
  const images = [
    { src: "/images/offer1.jpeg", alt: "Students learning in class" },
    { src: "/images/offer2.jpeg", alt: "Students in a group activity" },
    {
      src: "/images/offer3.jpg",
      alt: "Winners' Foundation School students in uniform",
      objectPosition: "center 18%",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Lato:wght@300;400;700&display=swap');

        .offer-section {
          background: #111827;
          padding: 100px clamp(48px, 10vw, 160px);
          color: white;
        }

        .offer-eyebrow {
          font-family: 'Lato', sans-serif;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #60a5fa;
          margin-bottom: 12px;
          text-align: center;
        }

        .offer-heading {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: clamp(1.9rem, 3vw, 2.6rem);
          color: #ffffff;
          text-align: center;
          margin-bottom: 18px;
          line-height: 1.2;
        }

        .offer-rule {
          width: 48px;
          height: 3px;
          background: #2563EB;
          border-radius: 2px;
          margin: 0 auto 40px;
        }

        .offer-text-block {
          max-width: 780px;
          margin: 0 auto 64px;
          text-align: center;
        }

        .offer-lead {
          font-family: 'Lato', sans-serif;
          font-weight: 400;
          font-size: 1.05rem;
          color: rgba(255,255,255,0.85);
          line-height: 1.9;
          margin-bottom: 24px;
        }

        .offer-body {
          font-family: 'Lato', sans-serif;
          font-weight: 300;
          font-size: 0.97rem;
          color: rgba(255,255,255,0.65);
          line-height: 1.9;
        }

        .offer-stats {
          display: flex;
          justify-content: center;
          gap: 48px;
          margin: 40px 0 64px;
          flex-wrap: wrap;
        }

        .offer-stat {
          text-align: center;
        }

        .offer-stat-number {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: 2.2rem;
          color: #ffffff;
          line-height: 1;
          margin-bottom: 6px;
        }

        .offer-stat-label {
          font-family: 'Lato', sans-serif;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
        }

        .offer-stat-divider {
          width: 1px;
          background: rgba(255,255,255,0.12);
          align-self: stretch;
        }

        .offer-images {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        @media (max-width: 640px) {
          .offer-images { grid-template-columns: 1fr; }
          .offer-stat-divider { display: none; }
        }

        .offer-img-slot {
          aspect-ratio: 4/3;
          overflow: hidden;
          border-radius: 4px;
          background: #1f2937;
          position: relative;
        }

        .offer-img-slot img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }

        .offer-img-slot:hover img {
          transform: scale(1.05);
        }

        /* Placeholder shown when image hasn't been added yet */
        .img-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: rgba(255,255,255,0.2);
        }

        .img-placeholder svg {
          opacity: 0.3;
        }

        .img-placeholder span {
          font-family: 'Lato', sans-serif;
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
      `}</style>

      <section className="offer-section">

        {/* Header */}
        <p className="offer-eyebrow">What We Offer</p>
        <h2 className="offer-heading">An Education Worth<br />Investing In</h2>
        <div className="offer-rule" />

        {/* Text */}
        <div className="offer-text-block">
          <p className="offer-lead">
            At Winners' Foundation School, we do not just teach — we invest in the total development of every child. Our school offers a rich and balanced education that prepares students for real-world success, grounded in faith, discipline, and academic rigour.
          </p>
          <p className="offer-body">
            Our classrooms are led by qualified, experienced, and caring teachers who understand that every child learns differently. We combine a strong academic curriculum with co-curricular activities, moral instruction, and a safe, structured environment — giving your child every advantage they need to excel in WAEC, NECO, and beyond. When you choose Winners' Foundation School, you are choosing a community that sees your child's potential and commits to developing it fully.
          </p>
        </div>

        {/* Stats */}
        <div className="offer-stats">
          <div className="offer-stat">
            <div className="offer-stat-number">90%</div>
            <div className="offer-stat-label">WAEC / NECO Pass Rate</div>
          </div>
          <div className="offer-stat-divider" />
          <div className="offer-stat">
            <div className="offer-stat-number">500+</div>
            <div className="offer-stat-label">Students Enrolled</div>
          </div>
          <div className="offer-stat-divider" />
          <div className="offer-stat">
            <div className="offer-stat-number">25+</div>
            <div className="offer-stat-label">Years of Excellence</div>
          </div>
        </div>

        {/* Image grid */}
        <div className="offer-images">
          {images.map((img, i) => (
            <div key={i} className="offer-img-slot">
              <img
                src={img.src}
                alt={img.alt}
                style={{ objectPosition: img.objectPosition || "center" }}
                onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "flex"; }}
              />
              <div className="img-placeholder" style={{ display: "none" }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="M21 15l-5-5L5 21"/>
                </svg>
                <span>Add Image {i + 1}</span>
              </div>
            </div>
          ))}
        </div>

      </section>
    </>
  );
}
