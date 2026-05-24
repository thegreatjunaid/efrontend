import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const BANNERS = [
  {
    id: 1,
    badge: "Digital Agency",
    headline: "Building Modern",
    highlight: "Digital Experiences",
    sub: "We craft stunning websites, scalable applications, and premium user experiences for modern brands.",
    cta: "Get Started",
    ctaLink: "/contact",
    tag: "Trusted by growing startups",
    bg: "linear-gradient(135deg, #071120 0%, #0f172a 100%)",
    accent: "#38BDF8",
    accentLight: "rgba(56,189,248,0.12)",
  },

  {
    id: 2,
    badge: "Creative Studio",
    headline: "Designing Future",
    highlight: "Brand Identity",
    sub: "From UI/UX design to complete digital branding, we help businesses stand out in the digital world.",
    cta: "Explore Services",
    ctaLink: "/services",
    tag: "UI/UX • Branding • Motion",
    bg: "linear-gradient(135deg, #111827 0%, #0b1120 100%)",
    accent: "#8B5CF6",
    accentLight: "rgba(139,92,246,0.12)",
  },

  {
    id: 3,
    badge: "Development Team",
    headline: "Transforming Ideas",
    highlight: "Into Products",
    sub: "Launch fast and scale confidently with high-performance digital solutions tailored for growth.",
    cta: "View Portfolio",
    ctaLink: "/portfolio",
    tag: "Fast • Secure • Scalable",
    bg: "linear-gradient(135deg, #020617 0%, #111827 100%)",
    accent: "#06B6D4",
    accentLight: "rgba(6,182,212,0.12)",
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const go = useCallback((dir) => {
    setDirection(dir);
    setCurrent((c) => (c + dir + BANNERS.length) % BANNERS.length);
  }, []);

  useEffect(() => {
    if (paused) return;

    const id = setInterval(() => go(1), 4500);

    return () => clearInterval(id);
  }, [paused, go]);

  const banner = BANNERS[current];

  const variants = {
    enter: (d) => ({
      x: d > 0 ? "100%" : "-100%",
      opacity: 0,
    }),

    center: {
      x: 0,
      opacity: 1,
    },

    exit: (d) => ({
      x: d > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  return (
    <div
      className="banner-wrapper"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');

        .banner-wrapper {
          position: relative;
          width: 100%;
          height: 520px;
          overflow: hidden;
          border-radius: 20px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.45);
          font-family: 'DM Sans', sans-serif;
        }

        @media (max-width: 640px) {
          .banner-wrapper {
            height: 420px;
            border-radius: 12px;
          }
        }

        .banner-slide {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          padding: 3rem 4rem;
        }

        @media (max-width: 640px) {
          .banner-slide {
            padding: 2rem 1.5rem;
          }
        }

        .banner-shape {
          position: absolute;
          right: -60px;
          top: 50%;
          transform: translateY(-50%);
          width: 420px;
          height: 420px;
          border-radius: 50%;
          opacity: 0.08;
          filter: blur(2px);
          pointer-events: none;
        }

        .banner-shape-inner {
          position: absolute;
          right: 80px;
          top: 30px;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          opacity: 0.06;
          pointer-events: none;
        }

        .banner-ring {
          position: absolute;
          right: 60px;
          bottom: 40px;
          width: 140px;
          height: 140px;
          border-radius: 50%;
          border: 2px solid;
          opacity: 0.12;
          pointer-events: none;
        }

        .banner-dots-grid {
          position: absolute;
          right: 200px;
          top: 40px;
          display: grid;
          grid-template-columns: repeat(5, 6px);
          gap: 10px;
          opacity: 0.1;
          pointer-events: none;
        }

        .banner-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .banner-content {
          position: relative;
          z-index: 2;
          max-width: 580px;
        }

        .banner-badge {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 0.3rem 0.85rem;
          border-radius: 50px;
          margin-bottom: 1.1rem;
          border: 1px solid;
        }

        .banner-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.2rem, 5vw, 3.6rem);
          font-weight: 900;
          color: #fff;
          line-height: 1.08;
          margin-bottom: 0.3rem;
        }

        .banner-highlight {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.2rem, 5vw, 3.6rem);
          font-weight: 900;
          line-height: 1.08;
          margin-bottom: 1rem;
          display: block;
        }

        .banner-sub {
          font-size: 0.95rem;
          color: rgba(255,255,255,0.6);
          line-height: 1.7;
          margin-bottom: 2rem;
          max-width: 440px;
        }

        .banner-actions {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          flex-wrap: wrap;
        }

        .banner-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.88rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          padding: 0.75rem 1.75rem;
          border-radius: 50px;
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: filter 0.2s, transform 0.2s;
          font-family: 'DM Sans', sans-serif;
        }

        .banner-cta:hover {
          filter: brightness(1.1);
          transform: translateY(-2px);
        }

        .banner-tag {
          font-size: 0.8rem;
          font-weight: 600;
          color: rgba(255,255,255,0.5);
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .banner-tag::before {
          content: '';
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
          animation: blink 1.4s infinite;
        }

        @keyframes blink {
          0%,100% { opacity:1 }
          50% { opacity:0.3 }
        }

        .banner-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          backdrop-filter: blur(8px);
        }

        .banner-arrow:hover {
          background: rgba(255,255,255,0.18);
          color: #fff;
        }

        .banner-arrow-left {
          left: 16px;
        }

        .banner-arrow-right {
          right: 16px;
        }

        .banner-indicators {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          z-index: 10;
        }

        .banner-indicator {
          height: 4px;
          border-radius: 2px;
          cursor: pointer;
          transition: width 0.4s, opacity 0.3s;
          opacity: 0.4;
        }
      `}</style>

      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={banner.id}
          className="banner-slide"
          style={{ background: banner.bg }}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div
            className="banner-shape"
            style={{ background: banner.accent }}
          />

          <div
            className="banner-shape-inner"
            style={{ background: banner.accent }}
          />

          <div
            className="banner-ring"
            style={{ borderColor: banner.accent }}
          />

          <div className="banner-dots-grid">
            {Array.from({ length: 25 }).map((_, i) => (
              <div
                key={i}
                className="banner-dot"
                style={{ background: banner.accent }}
              />
            ))}
          </div>

          <div className="banner-content">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              <span
                className="banner-badge"
                style={{
                  background: banner.accentLight,
                  color: banner.accent,
                  borderColor: banner.accent + "44",
                }}
              >
                {banner.badge}
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.5 }}
            >
              <h1 className="banner-headline">
                {banner.headline}
              </h1>

              <span
                className="banner-highlight"
                style={{ color: banner.accent }}
              >
                {banner.highlight}
              </span>
            </motion.div>

            <motion.p
              className="banner-sub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {banner.sub}
            </motion.p>

            <motion.div
              className="banner-actions"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.5 }}
            >
              <Link
                to={banner.ctaLink}
                className="banner-cta"
                style={{
                  background: banner.accent,
                  color: "#0a1628",
                }}
              >
                {banner.cta}
                <ArrowRight size={15} />
              </Link>

              <span
                className="banner-tag"
                style={{ color: banner.accent }}
              >
                {banner.tag}
              </span>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        className="banner-arrow banner-arrow-left"
        onClick={() => go(-1)}
      >
        <ChevronLeft size={20} />
      </button>

      <button
        className="banner-arrow banner-arrow-right"
        onClick={() => go(1)}
      >
        <ChevronRight size={20} />
      </button>

      <div className="banner-indicators">
        {BANNERS.map((b, i) => (
          <div
            key={b.id}
            className="banner-indicator"
            onClick={() => {
              setDirection(i > current ? 1 : -1);
              setCurrent(i);
            }}
            style={{
              width: i === current ? 28 : 8,
              background: BANNERS[current].accent,
              opacity: i === current ? 1 : 0.35,
            }}
          />
        ))}
      </div>
    </div>
  );
}