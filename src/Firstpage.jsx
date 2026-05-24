import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

export default function Firstpage() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  // 🎯 Mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const scale = useMotionValue(1);

  const springX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 20 });
  const springScale = useSpring(scale, { stiffness: 100, damping: 20 });

  function handleMouseMove(e) {
    mouseX.set(e.clientX - 200);
    mouseY.set(e.clientY - 200);

    const speed = Math.abs(e.movementX) + Math.abs(e.movementY);
    const newScale = Math.min(1.6, 1 + speed / 60);
    scale.set(newScale);
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-gray-100 relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >

      <Header />

      {/* 🌈 Mouse-follow glow */}
      <motion.div
        style={{
          x: springX,
          y: springY,
          scale: springScale
        }}
        className="fixed top-0 left-0 w-80 h-80 rounded-full blur-3xl pointer-events-none z-50"
      >
        <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-400/40 via-purple-400/30 to-pink-400/40 mix-blend-screen" />
      </motion.div>

      <AnimatePresence mode="wait">

        <motion.main
          key={location.pathname}
          className="flex-grow p-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >

          {/* 🔥 DEFAULT LANDING */}
          {isHome ? (
            <div className="max-w-7xl mx-auto">

              {/* HERO */}
              <div className="text-center py-24">
                <h1 className="text-6xl font-extrabold mb-6">
                  Welcome to{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Junaid Store
                  </span>
                </h1>

                <p className="text-gray-600 max-w-2xl mx-auto mb-10 text-lg">
                  Experience next-level shopping with smooth animations,
                  premium products, and unbeatable deals across Bangladesh.
                </p>

                <div className="flex justify-center gap-6">
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full shadow-lg hover:scale-110 transition">
                    Shop Now
                  </button>

                  <button className="border px-8 py-3 rounded-full hover:bg-gray-200 transition">
                    Explore
                  </button>
                </div>
              </div>

              {/* FEATURES */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16">

                {[
                  {
                    title: "Fast Delivery",
                    desc: "Get your products delivered quickly anywhere in Bangladesh."
                  },
                  {
                    title: "Premium Quality",
                    desc: "We ensure top-notch quality for every product."
                  },
                  {
                    title: "Best Prices",
                    desc: "Affordable pricing with exciting offers and discounts."
                  }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.08, y: -10 }}
                    className="bg-white p-8 rounded-2xl shadow-md cursor-pointer"
                  >
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </motion.div>
                ))}

              </div>

              {/* CTA SECTION */}
              <div className="text-center py-20">
                <h2 className="text-3xl font-bold mb-4">
                  Ready to start shopping?
                </h2>
                <p className="text-gray-600 mb-6">
                  Join thousands of happy customers today.
                </p>

                <button className="bg-orange-500 text-white px-10 py-3 rounded-full hover:scale-110 transition">
                  Get Started
                </button>
              </div>

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