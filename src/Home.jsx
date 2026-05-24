import { motion, useMotionValue, useSpring } from "framer-motion";
import Header from "./Header";
import Product from "./Product";

// 🔥 Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 15 },
  },
};

export default function Home() {

  // 🎯 Mouse tracking (ONLY POSITION NOW)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 20 });

  function handleMouseMove(e) {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  }

  return (
    
    <div
      className="bg-white text-gray-800 relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
          
      {/* ✨ CROSSHAIR (DEEP GRAPH STYLE) */}
<motion.div
  style={{ x: springX, y: springY }}
  className="fixed top-0 left-0 pointer-events-none z-50"
>
  {/* vertical line (stronger + gradient depth) */}
  <div className="absolute w-px h-screen -left-px -top-[50vh]
                  bg-gradient-to-b from-transparent via-black/40 to-transparent" />

  {/* horizontal line (stronger + gradient depth) */}
  <div className="absolute h-px w-screen -top-px -left-[50vw]
                  bg-gradient-to-r from-transparent via-black/40 to-transparent" />

  {/* center glow point (extra depth feel) */}
  <div className="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2
                  rounded-full bg-black/50 blur-[2px]" />
</motion.div>

      {/* 🔥 Background blobs */}
      <motion.div
        className="absolute w-96 h-96 bg-orange-400 opacity-20 rounded-full blur-3xl"
        animate={{ x: [0, 200, 0], y: [0, 100, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      <motion.div
        className="absolute w-96 h-96 bg-blue-500 opacity-20 rounded-full blur-3xl right-0"
        animate={{ x: [0, -200, 0], y: [0, 150, 0] }}
        transition={{ duration: 14, repeat: Infinity }}
      />

      {/* HERO */}
      <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        className="bg-gradient-to-r from-blue-50 to-orange-50 py-24 px-6 text-center relative z-10"
      >
        <motion.h1 variants={item} className="text-5xl font-extrabold mb-6">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
            Junaid Store
          </span>
        </motion.h1>

        <motion.p variants={item} className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Discover premium quality products at unbeatable prices with fast delivery across Bangladesh.
        </motion.p>

        <motion.button
          variants={item}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-orange-500 to-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold"
        >
          Start Shopping
        </motion.button>
      </motion.section>

      {/* PRODUCTS */}
      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <Product />
      </div>

      {/* CATEGORIES */}
      <motion.section
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="py-20 px-6 max-w-7xl mx-auto relative z-10"
      >
        <motion.h2 variants={item} className="text-3xl font-bold text-center mb-12">
          Shop by Category
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {["Electronics", "Fashion", "Home & Kitchen", "Sports"].map((cat, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ y: -12, scale: 1.07, rotate: 1 }}
              className="bg-white border rounded-2xl p-6 text-center shadow-sm cursor-pointer"
            >
              <div className="text-4xl mb-3">🛍️</div>
              <h3 className="font-semibold text-lg">{cat}</h3>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* FEATURED PRODUCTS */}
      <motion.section
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="py-20 px-6 bg-gray-50 relative z-10"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 variants={item} className="text-3xl font-bold text-center mb-12">
            Featured Products
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((itemNum) => (
              <motion.div
                key={itemNum}
                variants={item}
                whileHover={{ y: -10, scale: 1.05 }}
                className="bg-white p-6 rounded-2xl border shadow-sm"
              >
                <div className="h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  Product {itemNum}
                </div>

                <p className="text-xl font-bold text-blue-600 mb-4">৳ 49.99</p>

                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-orange-500 text-white py-2 rounded-full"
                >
                  Add to Cart
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* NEWSLETTER */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="py-20 px-6 text-center relative z-10"
      >
        <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
        <p className="text-gray-600 mb-8">Get updates on new arrivals and exclusive offers.</p>

        <div className="max-w-md mx-auto flex shadow-md rounded-full overflow-hidden">
          <input type="email" placeholder="Enter your email" className="grow px-5 py-3 focus:outline-none" />
          <motion.button whileHover={{ scale: 1.1 }} className="bg-gradient-to-r from-orange-500 to-blue-600 text-white px-6">
            Subscribe
          </motion.button>
        </div>
      </motion.section>

    </div>
  );
}