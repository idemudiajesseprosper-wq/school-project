export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Our Mission", href: "#mission" },
    { label: "Why Choose Us", href: "#why" },
    { label: "What We Offer", href: "#offer" },
    { label: "Contact", href: "#contact" },
  ];

  const academics = [
    "Nursery School",
    "Primary School",
    "Junior Secondary (JSS)",
    "Senior Secondary (SSS)",
    "WAEC Preparation",
    "NECO Preparation",
    "Extra-Curricular Activities",
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Lato:wght@300;400;700&display=swap');

        .footer {
          background: #0f172a;
          color: white;
        }

        /* ── Top band ── */
        .footer-top {
          background: #2563EB;
          padding: 28px clamp(48px, 10vw, 160px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }

        .footer-cta-text {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: 1.2rem;
          color: white;
        }

        .footer-cta-sub {
          font-family: 'Lato', sans-serif;
          font-size: 0.85rem;
          font-weight: 300;
          color: rgba(255,255,255,0.75);
          margin-top: 4px;
        }

        .footer-cta-btn {
          font-family: 'Lato', sans-serif;
          font-weight: 700;
          font-size: 0.8rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: white;
          color: #2563EB;
          border: none;
          padding: 12px 28px;
          border-radius: 3px;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.2s, transform 0.2s;
          flex-shrink: 0;
        }
        .footer-cta-btn:hover {
          background: #eff6ff;
          transform: translateY(-2px);
        }

        /* ── Main footer body ── */
        .footer-body {
          padding: 72px clamp(48px, 10vw, 160px) 56px;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.2fr;
          gap: 48px;
        }

        @media (max-width: 900px) {
          .footer-body { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 540px) {
          .footer-body { grid-template-columns: 1fr; }
        }

        .footer-col-title {
          font-family: 'Lato', sans-serif;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #60a5fa;
          margin-bottom: 20px;
        }

        /* Brand col */
        .footer-logo-name {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: 1.2rem;
          color: white;
          margin-bottom: 14px;
          line-height: 1.3;
        }
        .footer-logo-name span {
          color: #60a5fa;
          font-style: italic;
        }

        .footer-brand-desc {
          font-family: 'Lato', sans-serif;
          font-weight: 300;
          font-size: 0.88rem;
          color: rgba(255,255,255,0.5);
          line-height: 1.85;
          margin-bottom: 24px;
        }

        .footer-motto {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.35);
          border-left: 2px solid #2563EB;
          padding-left: 12px;
        }

        /* Links */
        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-links li a {
          font-family: 'Lato', sans-serif;
          font-size: 0.88rem;
          font-weight: 400;
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          transition: color 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .footer-links li a::before {
          content: '';
          width: 14px;
          height: 1px;
          background: #2563EB;
          flex-shrink: 0;
          transition: width 0.2s;
        }
        .footer-links li a:hover {
          color: white;
        }
        .footer-links li a:hover::before {
          width: 20px;
        }

        /* Contact col */
        .footer-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 18px;
        }

        .footer-contact-icon {
          width: 32px;
          height: 32px;
          background: rgba(37,99,235,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .footer-contact-label {
          font-family: 'Lato', sans-serif;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-bottom: 3px;
        }

        .footer-contact-value {
          font-family: 'Lato', sans-serif;
          font-size: 0.87rem;
          color: rgba(255,255,255,0.65);
          line-height: 1.5;
        }

        /* Socials */
        .footer-socials {
          display: flex;
          gap: 10px;
          margin-top: 8px;
        }

        .social-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
        }
        .social-btn:hover {
          background: #2563EB;
          border-color: #2563EB;
          color: white;
        }

        /* ── Bottom bar ── */
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.07);
          padding: 20px clamp(48px, 10vw, 160px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .footer-copy {
          font-family: 'Lato', sans-serif;
          font-size: 0.78rem;
          color: rgba(255,255,255,0.3);
        }

        .footer-bottom-links {
          display: flex;
          gap: 24px;
        }

        .footer-bottom-links a {
          font-family: 'Lato', sans-serif;
          font-size: 0.78rem;
          color: rgba(255,255,255,0.3);
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-bottom-links a:hover { color: white; }
      `}</style>

      <footer className="footer">
        {/* ── CTA band ── */}
        <div className="footer-top">
          <div>
            <div className="footer-cta-text">Ready to enroll your child?</div>
            <div className="footer-cta-sub">
              Join hundreds of families who trust Winners' Foundation School.
            </div>
          </div>
          <button
            className="footer-cta-btn"
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Get In Touch →
          </button>
        </div>

        {/* ── Main grid ── */}
        <div className="footer-body">
          {/* Brand */}
          <div>
            <div className="footer-col-title">About</div>
            <div className="footer-logo-name">
              Winners'
              <br />
              <span>Foundation</span> School
            </div>
            <p className="footer-brand-desc">
              A leading secondary school dedicated to raising a generation of
              academically excellent, morally sound, and spiritually grounded
              young Nigerians.
            </p>
            <div className="footer-motto">
              "Excellence through Faith and Industry"
            </div>

            <div className="footer-socials" style={{ marginTop: "28px" }}>
              {/* Instagram */}
              <a
                href="https://www.instagram.com/"
                className="social-btn"
                aria-label="Instagram"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                </svg>
              </a>
              {/* WhatsApp */}
              <a
                href="https://wa.me/2348056265923"
                className="social-btn"
                aria-label="WhatsApp"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.098.543 4.073 1.496 5.789L.057 23.25l5.616-1.473A11.932 11.932 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.003-1.37l-.359-.214-3.722.976.994-3.629-.234-.373A9.787 9.787 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="footer-col-title">Quick Links</div>
            <ul className="footer-links">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Academics */}
          <div>
            <div className="footer-col-title">Academics</div>
            <ul className="footer-links">
              {academics.map((item) => (
                <li key={item}>
                  <a href="/admissions">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="footer-col-title">Contact Us</div>

            <div className="footer-contact-item">
              <div className="footer-contact-icon">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
              </div>
              <div>
                <div className="footer-contact-label">Address</div>
                <div className="footer-contact-value">
                  [2, AIRHUEGHIOMON STREET, OFF ETETE ROAD, ENOGIE, BENIN CITY]
                  <br />
                  [BENIN CITY, EDO STATE]
                </div>
              </div>
            </div>

            <div className="footer-contact-item">
              <div className="footer-contact-icon">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 0115.93 2.18 2 2 0 0118 4.36v3a2 2 0 01-1.56 1.95 16 16 0 00-1.48.56 13 13 0 01-5.61-5.61 16 16 0 00.56-1.48A2 2 0 0122 16.92z" />
                </svg>
              </div>
              <div>
                <div className="footer-contact-label">Phone</div>
                <div className="footer-contact-value">[08056265923]</div>
              </div>
            </div>

            <div className="footer-contact-item">
              <div className="footer-contact-icon">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M2 7l10 7 10-7" />
                </svg>
              </div>
              <div>
                <div className="footer-contact-label">Email</div>
                <div className="footer-contact-value">
                  [wfsonline1999@gmail.com]
                </div>
              </div>
            </div>

            <div className="footer-contact-item">
              <div className="footer-contact-icon">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <div>
                <div className="footer-contact-label">School Hours</div>
                <div className="footer-contact-value">
                  Mon – Fri: 7:30am – 3:30pm
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="footer-bottom">
          <div className="footer-copy">
            © {currentYear} Winners' Foundation School. All rights reserved.
          </div>
          <div className="footer-bottom-links">
            <a href="/contact">Privacy Policy</a>
            <a href="/contact">Terms of Use</a>
            <a href="/admissions">Admissions</a>
          </div>
        </div>
      </footer>
    </>
  );
}
