import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

// ─── BASE URL ──────────────────────────────────────────────────
const BASE_URL = "https://backend-4g4m.onrender.com";

// ─── CATEGORY CONFIG ───────────────────────────────────────────
const CATEGORIES = [
  { label: "All",         value: null,          emoji: "✨" },
  { label: "Shirt",       value: "shirt",       emoji: "👔" },
  { label: "T-Shirt",     value: "t-shirt",     emoji: "👕" },
  { label: "Pant",        value: "pant",        emoji: "👖" },
  { label: "Hoodie",      value: "hoodie",      emoji: "🧥" },
  { label: "Jacket",      value: "jacket",      emoji: "🥼" },
  { label: "Saree",       value: "saree",       emoji: "🥻" },
  { label: "Three-Piece", value: "three-piece", emoji: "👗" },
  { label: "Kurti",       value: "kurti",       emoji: "👘" },
  { label: "Lehenga",     value: "lehenga",     emoji: "💃" },
  { label: "Shoes",       value: "shoes",       emoji: "👟" },
  { label: "Bags",        value: "bags",        emoji: "👜" },
  { label: "Accessories", value: "accessories", emoji: "💍" },
];

// ─── PRODUCT CARD ──────────────────────────────────────────────
function ProductCard({ product, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="bg-white rounded-2xl overflow-hidden border border-black/[0.06] shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-100 aspect-[3/4]">
        {product.image ? (
          <img
            src={`${BASE_URL}${product.image}`}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0f2147]/10 to-[#0f2147]/5">
            <ShoppingBag size={40} className="text-[#0f2147]/20" />
          </div>
        )}

        {/* Category badge */}
        <span className="absolute top-2.5 left-2.5 text-[0.62rem] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-[#0a1628]/80 text-yellow-400 backdrop-blur-sm">
          {product.category}
        </span>

        {/* Stock badges */}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-2.5 right-2.5 text-[0.62rem] font-bold px-2.5 py-1 rounded-full bg-red-500 text-white">
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-bold text-sm bg-black/60 px-4 py-2 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[0.68rem] font-bold tracking-widest uppercase text-yellow-600 mb-1">
          {product.type}
        </p>
        <h3
          className="font-bold text-[#0a1628] text-sm leading-snug mb-2 line-clamp-2"
          style={{ fontFamily: "serif" }}
        >
          {product.name}
        </h3>
        {product.description && (
          <p className="text-xs text-gray-400 leading-relaxed mb-3 line-clamp-2">
            {product.description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="text-lg font-black text-[#0a1628]">
            {Number(product.price).toLocaleString()}
          </span>
          <Link
            to={`/product/${product._id}`}
            className="text-xs font-bold px-4 py-2 rounded-full bg-[#0a1628] text-yellow-400 hover:bg-[#0f2c5a] transition-colors"
          >
            View
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────
export default function CategoryBar() {
  const [active, setActive]     = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const scrollRef                = useRef(null);
  const [canLeft, setCanLeft]   = useState(false);
  const [canRight, setCanRight] = useState(true);

  // Fetch products when category changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (active) params.append("type", active);
        params.append("limit", "8");

        const res = await axios.get(`${BASE_URL}/api/products?${params}`);

        // Your API returns a plain array []
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("CategoryBar fetch error:", err);
        setError("Failed to load products. Is the server running?");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [active]);

  // Arrow visibility
  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => { updateArrows(); }, []);

  const scrollBy = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 200, behavior: "smooth" });
  };

  return (
    <section className="my-10">

      {/* Section header */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <p className="text-[0.7rem] font-bold tracking-widest uppercase text-yellow-600 mb-1">
            Browse by Type
          </p>
          <h2 className="text-2xl md:text-3xl font-black text-[#0a1628]" style={{ fontFamily: "serif" }}>
            Shop by Category
          </h2>
        </div>
        <Link
          to="/product"
          className="text-xs font-bold text-[#0a1628] border border-[#0a1628]/20 px-4 py-2 rounded-full hover:bg-[#0a1628] hover:text-yellow-400 transition-all"
        >
          View All →
        </Link>
      </div>

      {/* Pill bar */}
      <div className="relative flex items-center gap-2 mb-5">
        <AnimatePresence>
          {canLeft && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => scrollBy(-1)}
              className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-black/10 shadow-md flex items-center justify-center text-[#0a1628] hover:bg-[#0a1628] hover:text-yellow-400 transition-all z-10"
            >
              <ChevronLeft size={16} />
            </motion.button>
          )}
        </AnimatePresence>

        <div
          ref={scrollRef}
          onScroll={updateArrows}
          className="flex items-center gap-2 overflow-x-auto flex-1 py-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = active === cat.value;
            return (
              <motion.button
                key={cat.value ?? "all"}
                onClick={() => setActive(cat.value)}
                whileTap={{ scale: 0.94 }}
                className={`relative flex-shrink-0 flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full border transition-colors duration-200 ${
                  isActive
                    ? "bg-[#0a1628] text-yellow-400 border-[#0a1628] shadow-lg"
                    : "bg-white text-[#0a1628] border-black/10 hover:border-[#0a1628]/40 hover:bg-[#0a1628]/5"
                }`}
              >
                <span className="text-base leading-none">{cat.emoji}</span>
                <span className="whitespace-nowrap">{cat.label}</span>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {canRight && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => scrollBy(1)}
              className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-black/10 shadow-md flex items-center justify-center text-[#0a1628] hover:bg-[#0a1628] hover:text-yellow-400 transition-all z-10"
            >
              <ChevronRight size={16} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Active label */}
      <AnimatePresence mode="wait">
        <motion.p
          key={active ?? "all"}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.25 }}
          className="text-xs text-gray-400 font-medium mb-5"
        >
          {active ? `Showing "${active}" products` : "Showing all products"}
        </motion.p>
      </AnimatePresence>

      {/* Product grid */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center py-20"
          >
            <Loader2 size={32} className="animate-spin text-[#0a1628]/30" />
          </motion.div>

        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 text-red-400 text-sm font-medium"
          >
            {error}
          </motion.div>

        ) : products.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <ShoppingBag size={40} className="mx-auto text-[#0a1628]/15 mb-3" />
            <p className="text-gray-400 text-sm font-medium">
              No products found in this category.
            </p>
          </motion.div>

        ) : (
          <motion.div
            key={active ?? "all"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
          >
            {products.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}