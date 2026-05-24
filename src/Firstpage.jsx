import React, { useState, useEffect, useCallback } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet, useLocation, Link } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  Shield,
  Tag,
  Truck,
  Star,
  ArrowRight,
} from "lucide-react";
import CategoryBar from "./CategoryBar";

// ─── DATA ──────────────────────────────────────────────────────

const BANNERS = [
  {
    id: 0,
    badge: "New Season",
    headline: "Elevate Your",
    highlight: "Style Game",
    sub: "Discover handpicked premium fashion & lifestyle products curated just for you.",
    cta: "Shop Collection",
    ctaLink: "/product",
    tag: "Up to 40% OFF",
    bg: "from-[#0a1628] via-[#0f2c5a] to-[#0d1f42]",
    accent: "#d4af37",
    accentBg: "bg-yellow-400/10",
    accentBorder: "border-yellow-400/30",
    accentText: "text-yellow-400",
    ctaColor: "bg-yellow-400 text-[#0a1628]",
    blob: "bg-yellow-400",
  },
  {
    id: 1,
    badge: "Flash Sale",
    headline: "Deals That",
    highlight: "Break the Bank",
    sub: "Lightning deals on top brands every day. Don't miss out on exclusive limited-time offers.",
    cta: "Grab Deals",
    ctaLink: "/product",
    tag: "Today Only",
    bg: "from-[#1a0a2e] via-[#2d1060] to-[#150821]",
    accent: "#e879f9",
    accentBg: "bg-fuchsia-400/10",
    accentBorder: "border-fuchsia-400/30",
    accentText: "text-fuchsia-400",
    ctaColor: "bg-fuchsia-400 text-[#1a0a2e]",
    blob: "bg-fuchsia-400",
  },
  {
    id: 2,
    badge: "Free Shipping",
    headline: "Shop More,",
    highlight: "Pay Less",
    sub: "Free delivery on all orders above 999. Shop your favourites without worrying about costs.",
    cta: "Start Shopping",
    ctaLink: "/product",
    tag: "Free Delivery",
    bg: "from-[#0a2010] via-[#0f3d1a] to-[#071510]",
    accent: "#4ade80",
    accentBg: "bg-green-400/10",
    accentBorder: "border-green-400/30",
    accentText: "text-green-400",
    ctaColor: "bg-green-400 text-[#071510]",
    blob: "bg-green-400",
  },
  {
    id: 3,
    badge: "Members Only",
    headline: "Exclusive",
    highlight: "VIP Access",
    sub: "Register today and unlock member-only prices, early access to sales, and loyalty rewards.",
    cta: "Join Now",
    ctaLink: "/register",
    tag: "Register Free",
    bg: "from-[#1a0a0a] via-[#3d0f0f] to-[#150707]",
    accent: "#f87171",
    accentBg: "bg-red-400/10",
    accentBorder: "border-red-400/30",
    accentText: "text-red-400",
    ctaColor: "bg-red-400 text-[#150707]",
    blob: "bg-red-400",
  },
];

const FEATURES = [
  { icon: Truck,  title: "Fast Delivery",  desc: "Delivered anywhere in Bangladesh within 3-5 days." },
  { icon: Shield, title: "Secure Payment", desc: "100% safe and encrypted payment every time." },
  { icon: Tag,    title: "Best Prices",    desc: "Guaranteed lowest prices with daily deals." },
  { icon: Zap,    title: "24/7 Support",   desc: "Always here to help - day or night." },
];

const TESTIMONIALS = [
  { name: "Rahim Ahmed",   rating: 5, text: "Amazing quality! Got my order in 3 days. Will definitely order again." },
  { name: "Fatima Noor",   rating: 5, text: "Best online store in Bangladesh. Prices are unbeatable and delivery is fast." },
  { name: "Karim Hossain", rating: 4, text: "Great products and smooth checkout experience. Highly recommended!" },
];

// ─── SLIDE VARIANTS ────────────────────────────────────────────

const slideVariants = {
  enter:  (d) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
  center:          { x: 0,                          opacity: 1 },
  exit:   (d) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
};

const contentVariants = {
  hidden: { opacity: 0, y: 24 },
  show: (delay) => ({
    opacity: 1,
    y: 0,
    transition: { delay: delay * 0.1 + 0.15, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ─── HERO BANNER ───────────────────────────────────────────────

function HeroBanner() {
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

  const b = BANNERS[current];

  return (
    <div
      className="relative w-full h-[440px] md:h-[520px] rounded-2xl overflow-hidden shadow-2xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={b.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className={`absolute inset-0 bg-gradient-to-br ${b.bg} flex items-center px-8 md:px-16`}
        >
          {/* Decorative blobs */}
          <div className={`absolute -right-16 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full ${b.blob} opacity-[0.07] blur-sm pointer-events-none`} />
          <div className={`absolute right-16 top-8 w-48 h-48 rounded-full ${b.blob} opacity-[0.06] pointer-events-none`} />
          <div className={`absolute right-14 bottom-10 w-32 h-32 rounded-full border-2 ${b.accentBorder} opacity-20 pointer-events-none`} />
          <div className="absolute right-44 top-10 grid grid-cols-5 gap-2.5 opacity-10 pointer-events-none">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full ${b.blob}`} />
            ))}
          </div>

          {/* Slide content */}
          <div className="relative z-10 max-w-xl">
            <motion.span
              custom={0}
              variants={contentVariants}
              initial="hidden"
              animate="show"
              className={`inline-block text-[0.7rem] font-bold tracking-widest uppercase px-3 py-1 rounded-full border mb-4 ${b.accentBg} ${b.accentBorder} ${b.accentText}`}
            >
              {b.badge}
            </motion.span>

            <motion.h1
              custom={1}
              variants={contentVariants}
              initial="hidden"
              animate="show"
              className="text-4xl md:text-6xl font-black text-white leading-tight"
              style={{ fontFamily: "serif" }}
            >
              {b.headline}
              <br />
              <span style={{ color: b.accent }}>{b.highlight}</span>
            </motion.h1>

            <motion.p
              custom={2}
              variants={contentVariants}
              initial="hidden"
              animate="show"
              className="mt-4 text-sm md:text-base text-white/55 leading-relaxed max-w-md"
            >
              {b.sub}
            </motion.p>

            <motion.div
              custom={3}
              variants={contentVariants}
              initial="hidden"
              animate="show"
              className="mt-7 flex items-center gap-5 flex-wrap"
            >
              <Link
                to={b.ctaLink}
                className={`inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-full transition-all hover:brightness-110 hover:-translate-y-0.5 ${b.ctaColor}`}
              >
                {b.cta} <ArrowRight size={15} />
              </Link>
              <span className={`text-sm font-semibold flex items-center gap-1.5 ${b.accentText}`}>
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.4 }}
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ background: b.accent }}
                />
                {b.tag}
              </span>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Arrow buttons */}
      <button
        onClick={() => go(-1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/8 border border-white/15 backdrop-blur-md text-white/70 hover:bg-white/20 hover:text-white flex items-center justify-center transition-all"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => go(1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/8 border border-white/15 backdrop-blur-md text-white/70 hover:bg-white/20 hover:text-white flex items-center justify-center transition-all"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {BANNERS.map((ban, i) => (
          <motion.button
            key={ban.id}
            onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
            className="h-1 rounded-full cursor-pointer"
            animate={{ width: i === current ? 28 : 8, opacity: i === current ? 1 : 0.35 }}
            transition={{ duration: 0.3 }}
            style={{ background: i === current ? b.accent : "rgba(255,255,255,0.4)" }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────

export default function Firstpage() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const scale  = useMotionValue(1);

  const springX     = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const springY     = useSpring(mouseY, { stiffness: 80, damping: 20 });
  const springScale = useSpring(scale,  { stiffness: 100, damping: 20 });

  function handleMouseMove(e) {
    mouseX.set(e.clientX - 200);
    mouseY.set(e.clientY - 200);
    scale.set(Math.min(1.6, 1 + (Math.abs(e.movementX) + Math.abs(e.movementY)) / 60));
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-[#f4f1eb] relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <Header />

      {/* Mouse glow — original */}
      <motion.div
        style={{ x: springX, y: springY, scale: springScale }}
        className="fixed top-0 left-0 w-80 h-80 rounded-full blur-3xl pointer-events-none z-50"
      >
        <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-400/40 via-purple-400/30 to-pink-400/40 mix-blend-screen" />
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          className="flex-grow px-4 md:px-6 py-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {isHome ? (
            <div className="max-w-7xl mx-auto">

              {/* ── HERO BANNER ── */}
              <HeroBanner />

              {/* ── FEATURE STRIP ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
                {FEATURES.map(({ icon: Icon, title, desc }, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.1)" }}
                    className="bg-white border border-black/[0.07] rounded-2xl p-5 flex items-start gap-4 cursor-default"
                  >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0f2147] to-[#1a3a6e] flex items-center justify-center flex-shrink-0 shadow-md">
                      <Icon size={20} color="#d4af37" />
                    </div>
                    <div>
                      <p className="font-bold text-[#0a1628] text-sm mb-0.5" style={{ fontFamily: "serif" }}>{title}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* ── PROMO CARDS ── */}
              <div className="mb-8">
                <p className="text-[0.7rem] font-bold tracking-widest uppercase text-yellow-600 mb-1">Hot Right Now</p>
                <h2 className="text-2xl md:text-3xl font-black text-[#0a1628] mb-1" style={{ fontFamily: "serif" }}>
                  Trending Offers
                </h2>
                <p className="text-sm text-gray-500 mb-5 max-w-md leading-relaxed">
                  Hand-picked deals updated daily — grab them before they're gone.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-[#0a1628] to-[#0f2c5a]"
                  >
                    <p className="text-[0.68rem] font-bold tracking-widest uppercase text-yellow-400/75 mb-2">Limited Time</p>
                    <h3 className="text-2xl font-black text-white leading-tight mb-4" style={{ fontFamily: "serif" }}>
                      Men's Premium<br />Collection
                    </h3>
                    <Link
                      to="/product"
                      className="inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-full bg-yellow-400 text-[#0a1628] hover:brightness-110 transition-all"
                    >
                      Shop Now <ArrowRight size={13} />
                    </Link>
                    <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-yellow-400 opacity-10 pointer-events-none" />
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -4 }}
                    className="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-[#1a0a2e] to-[#2d1060]"
                  >
                    <p className="text-[0.68rem] font-bold tracking-widest uppercase text-fuchsia-400/75 mb-2">New Arrivals</p>
                    <h3 className="text-2xl font-black text-white leading-tight mb-4" style={{ fontFamily: "serif" }}>
                      Women's Fashion<br />& Lifestyle
                    </h3>
                    <Link
                      to="/product"
                      className="inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-full bg-fuchsia-400 text-[#1a0a2e] hover:brightness-110 transition-all"
                    >
                      Explore <ArrowRight size={13} />
                    </Link>
                    <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-fuchsia-400 opacity-10 pointer-events-none" />
                  </motion.div>
                </div>
              </div>

              {/* ── TESTIMONIALS ── */}
              <div className="mb-8">
                <p className="text-[0.7rem] font-bold tracking-widest uppercase text-yellow-600 mb-1">Happy Customers</p>
                <h2 className="text-2xl md:text-3xl font-black text-[#0a1628] mb-5" style={{ fontFamily: "serif" }}>
                  What People Say
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {TESTIMONIALS.map((t, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.12, duration: 0.5 }}
                      whileHover={{ y: -4 }}
                      className="bg-white border border-black/[0.07] rounded-2xl p-6"
                    >
                      <div className="flex gap-1 mb-3">
                        {Array.from({ length: t.rating }).map((_, s) => (
                          <Star key={s} size={14} fill="#d4af37" color="#d4af37" />
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed italic mb-4">"{t.text}"</p>
                      <p className="text-xs font-bold text-[#0a1628]">— {t.name}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* ── CTA BANNER ── */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative overflow-hidden rounded-2xl p-12 text-center bg-gradient-to-br from-[#0a1628] via-[#0f2147] to-[#0d1b3e] border border-yellow-400/20 mb-10"
              >
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute -top-16 left-1/2 -translate-x-1/2 w-[500px] h-36 bg-yellow-400/10 rounded-full blur-2xl pointer-events-none"
                />
                <h2 className="text-3xl md:text-4xl font-black text-white mb-3 relative z-10" style={{ fontFamily: "serif" }}>
                  Ready to Start Shopping?
                </h2>
                <p className="text-sm text-white/50 mb-7 relative z-10">
                  Join thousands of happy customers. New deals added every single day.
                </p>
                <Link
                  to="/product"
                  className="inline-flex items-center gap-2 text-sm font-extrabold px-8 py-3.5 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#0a1628] hover:brightness-110 hover:-translate-y-0.5 transition-all relative z-10 tracking-wide"
                >
                  Browse All Products <ArrowRight size={16} />
                </Link>
              </motion.div>
              <CategoryBar/>

            </div>
          ) : (
            <Outlet />
          )}
        </motion.main>
      </AnimatePresence>

      <Footer />
    </div>
  );
}