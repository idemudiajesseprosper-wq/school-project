"use client";

import Image from "next/image";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const galleryImages = [
  {
    src: "/images/Hero.jpeg",
    alt: "Winners' Foundation School campus building",
    title: "School Campus",
  },
  {
    src: "/images/offer1.jpeg",
    alt: "Students learning at Winners' Foundation School",
    title: "Learning Spaces",
  },
  {
    src: "/images/offer2.jpeg",
    alt: "Students taking part in school activities",
    title: "Student Activities",
  },
  {
    src: "/images/offer3.jpg",
    alt: "Winners' Foundation School students in uniform",
    title: "Our Students",
    objectPosition: "center 18%",
  },
  {
    src: "/images/gallery-campus-front.jpeg",
    alt: "Front view of Winners' Foundation School campus gate and buildings",
    title: "School Front View",
  },
  {
    src: "/images/gallery-campus-courtyard.jpeg",
    alt: "Winners' Foundation School courtyard surrounded by classroom blocks",
    title: "School Ground",
  },
];

export default function GalleryPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Lato:wght@300;400;700&display=swap');

        .gallery-hero {
          background: #0f172a;
          padding: 160px clamp(24px, 9vw, 140px) 78px;
          position: relative;
          overflow: hidden;
        }

        .gallery-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, rgba(37,99,235,0.22), transparent 58%);
        }

        .gallery-hero-inner {
          position: relative;
          z-index: 1;
          max-width: 760px;
        }

        .gallery-eyebrow {
          font-family: 'Lato', sans-serif;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #60a5fa;
          margin-bottom: 14px;
        }

        .gallery-heading {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: clamp(2.4rem, 5vw, 4rem);
          color: #ffffff;
          line-height: 1.1;
          margin-bottom: 20px;
        }

        .gallery-heading em {
          font-style: italic;
          color: #60a5fa;
        }

        .gallery-rule {
          width: 52px;
          height: 3px;
          background: #2563EB;
          border-radius: 2px;
          margin-bottom: 24px;
        }

        .gallery-sub {
          font-family: 'Lato', sans-serif;
          font-weight: 300;
          font-size: 1rem;
          color: rgba(255,255,255,0.68);
          line-height: 1.85;
          max-width: 560px;
        }

        .gallery-section {
          background: #f8fafc;
          padding: 82px clamp(24px, 9vw, 140px) 96px;
        }

        .gallery-intro {
          max-width: 680px;
          margin-bottom: 38px;
        }

        .gallery-intro-label {
          font-family: 'Lato', sans-serif;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #2563EB;
          margin-bottom: 10px;
        }

        .gallery-intro-title {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: clamp(1.7rem, 3vw, 2.3rem);
          color: #111827;
          line-height: 1.2;
          margin-bottom: 12px;
        }

        .gallery-intro-text {
          font-family: 'Lato', sans-serif;
          font-weight: 300;
          font-size: 0.97rem;
          color: #4B5563;
          line-height: 1.85;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 22px;
        }

        .gallery-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 14px 34px rgba(15,23,42,0.06);
        }

        .gallery-image-wrap {
          aspect-ratio: 4 / 3;
          background: #e5e7eb;
          overflow: hidden;
          position: relative;
        }

        .gallery-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.35s ease;
        }

        .gallery-card:hover .gallery-image {
          transform: scale(1.04);
        }

        .gallery-caption {
          font-family: 'Playfair Display', serif;
          font-size: 1rem;
          font-weight: 700;
          color: #111827;
          padding: 16px 18px 18px;
        }

        @media (max-width: 720px) {
          .gallery-hero {
            padding: 142px 22px 64px;
          }

          .gallery-section {
            padding: 58px 22px 72px;
          }

          .gallery-grid {
            grid-template-columns: 1fr;
            gap: 18px;
          }
        }
      `}</style>

      <Navbar />

      <section className="gallery-hero">
        <div className="gallery-hero-inner">
          <p className="gallery-eyebrow">School Gallery</p>
          <h1 className="gallery-heading">
            A Look Around <em>Our School</em>
          </h1>
          <div className="gallery-rule" />
          <p className="gallery-sub">
            Explore moments from Winners' Foundation School, from our learning
            environment to the students who make the school community vibrant.
          </p>
        </div>
      </section>

      <section className="gallery-section">
        <div className="gallery-intro">
          <p className="gallery-intro-label">Our Environment</p>
          <h2 className="gallery-intro-title">Pictures From the School</h2>
          <p className="gallery-intro-text">
            These photos show the spaces, activities, and school life that
            support learning, discipline, confidence, and character.
          </p>
        </div>

        <div className="gallery-grid">
          {galleryImages.map((image) => (
            <article key={image.src} className="gallery-card">
              <div className="gallery-image-wrap">
                <Image
                  className="gallery-image"
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 720px) 100vw, 50vw"
                  style={{ objectPosition: image.objectPosition || "center" }}
                />
              </div>
              <div className="gallery-caption">{image.title}</div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
