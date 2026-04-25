export default function ContactSection() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Lato:wght@300;400;700&display=swap');

        .contact-section {
          background: #ffffff;
          padding: 100px clamp(48px, 10vw, 160px);
          display: flex;
          gap: 80px;
          align-items: flex-start;
        }

        @media (max-width: 768px) {
          .contact-section { flex-direction: column; gap: 56px; padding: 60px 24px; }
        }

        /* ── Left info col ── */
        .contact-info {
          flex: 0 0 300px;
        }

        .contact-eyebrow {
          font-family: 'Lato', sans-serif;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #2563EB;
          margin-bottom: 12px;
        }

        .contact-heading {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: clamp(1.8rem, 2.5vw, 2.3rem);
          color: #111827;
          line-height: 1.2;
          margin-bottom: 16px;
        }

        .contact-rule {
          width: 48px;
          height: 3px;
          background: #2563EB;
          border-radius: 2px;
          margin-bottom: 24px;
        }

        .contact-intro {
          font-family: 'Lato', sans-serif;
          font-weight: 300;
          font-size: 0.95rem;
          color: #4B5563;
          line-height: 1.85;
          margin-bottom: 40px;
        }

        .contact-detail {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          margin-bottom: 24px;
        }

        .contact-icon {
          width: 38px;
          height: 38px;
          background: #eff6ff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .contact-detail-label {
          font-family: 'Lato', sans-serif;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #9CA3AF;
          margin-bottom: 3px;
        }

        .contact-detail-value {
          font-family: 'Lato', sans-serif;
          font-size: 0.92rem;
          font-weight: 400;
          color: #111827;
          line-height: 1.6;
        }

        /* ── Right form col ── */
        .contact-form-col {
          flex: 1;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        @media (max-width: 500px) {
          .form-row { grid-template-columns: 1fr; }
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 16px;
        }

        .form-label {
          font-family: 'Lato', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #374151;
        }

        .form-input,
        .form-select,
        .form-textarea {
          font-family: 'Lato', sans-serif;
          font-size: 0.93rem;
          color: #111827;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 3px;
          padding: 12px 14px;
          width: 100%;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          border-color: #2563EB;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
          background: #fff;
        }

        .form-textarea {
          resize: vertical;
          min-height: 130px;
        }

        .form-select {
          appearance: none;
          cursor: pointer;
        }

        .submit-btn {
          font-family: 'Lato', sans-serif;
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: #2563EB;
          color: white;
          border: none;
          padding: 14px 36px;
          cursor: pointer;
          border-radius: 3px;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 14px rgba(37,99,235,0.35);
          margin-top: 8px;
          width: 100%;
        }
        .submit-btn:hover {
          background: #1d4ed8;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(37,99,235,0.4);
        }

        .form-note {
          font-family: 'Lato', sans-serif;
          font-size: 0.75rem;
          color: #9CA3AF;
          margin-top: 12px;
          text-align: center;
        }
      `}</style>

      <section className="contact-section">

        {/* ── LEFT: Info ── */}
        <div className="contact-info">
          <p className="contact-eyebrow">Get In Touch</p>
          <h2 className="contact-heading">We'd Love to<br />Hear From You</h2>
          <div className="contact-rule" />
          <p className="contact-intro">
            Whether you are a parent looking to enrol your child, or simply want to learn more about Winners' Foundation School — we are happy to help. Reach out and our team will get back to you promptly.
          </p>

          <div className="contact-detail">
            <div className="contact-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
            </div>
            <div>
              <div className="contact-detail-label">Address</div>
              <div className="contact-detail-value">[2, AIRHUEGHIOMON STREET, OFF ETETE ROAD, ENOGIE, BENNIN CITY]<br />[BENIN CITY, EDO STATE]</div>
            </div>
          </div>

          <div className="contact-detail">
            <div className="contact-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 0115.93 2.18 2 2 0 0118 4.36v3a2 2 0 01-1.56 1.95 16 16 0 00-1.48.56 13 13 0 01-5.61-5.61 16 16 0 00.56-1.48A2 2 0 0122 16.92z"/>
              </svg>
            </div>
            <div>
              <div className="contact-detail-label">Phone</div>
              <div className="contact-detail-value">[08056265923]</div>
            </div>
          </div>

          <div className="contact-detail">
            <div className="contact-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="M2 7l10 7 10-7"/>
              </svg>
            </div>
            <div>
              <div className="contact-detail-label">Email</div>
              <div className="contact-detail-value">[School Email Address]</div>
            </div>
          </div>

          <div className="contact-detail">
            <div className="contact-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <div>
              <div className="contact-detail-label">School Hours</div>
              <div className="contact-detail-value">Mon – Fri: 7:30am – 3:30pm</div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Form ── */}
        <div className="contact-form-col">
          <form onSubmit={(e) => { e.preventDefault(); alert("Message sent! We will get back to you shortly."); }}>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input className="form-input" type="text" placeholder="e.g. Eseosa" required />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input className="form-input" type="text" placeholder="e.g. Osayi" required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" type="tel" placeholder="e.g. 08012345678" />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" placeholder="e.g. you@email.com" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">I Am A</label>
              <select className="form-select" required>
                <option value="">-- Select --</option>
                <option>Parent / Guardian</option>
                <option>Prospective Student</option>
                <option>Current Student</option>
                <option>Staff / Teacher</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Subject</label>
              <input className="form-input" type="text" placeholder="e.g. Admission Enquiry" required />
            </div>

            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea className="form-textarea" placeholder="Write your message here..." required />
            </div>

            <button type="submit" className="submit-btn">Send Message →</button>
            <p className="form-note">We typically respond within 1 – 2 business days.</p>

          </form>
        </div>

      </section>
    </>
  );
}
