import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Heart, Eye, Loader2, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./Cartcontext";

const BASE_URL = "http://localhost:5000";

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

// ── PRODUCT CARD (same style as CategoryBar's ProductCard) ──────
function ProductCard({ product, index, onAddToCart }) {
  const [wished, setWished] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      onClick={() => navigate(`/product/${product._id}`)}
      className="group bg-white rounded-2xl overflow-hidden border border-black/[0.06] shadow-sm hover:shadow-xl hover:border-yellow-400/30 transition-all duration-300 flex flex-col cursor-pointer relative"
    >
      {/* Badge */}
      {product.badge && (
        <span className={`absolute top-2.5 left-2.5 z-10 text-[0.58rem] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full
          ${product.badge === "new"  ? "bg-[#0a1628] text-yellow-400" :
            product.badge === "hot"  ? "bg-gradient-to-r from-red-500 to-rose-400 text-white" :
                                       "bg-gradient-to-r from-emerald-600 to-teal-400 text-white"}`}>
          {product.badge}
        </span>
      )}

      {/* Wishlist */}
      <button
        onClick={(e) => { e.stopPropagation(); setWished(!wished); }}
        className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 border border-black/[0.06] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
      >
        <Heart size={13} className={wished ? "fill-red-500 stroke-red-500" : "stroke-gray-400"} />
      </button>

      {/* Image */}
      <div className="relative overflow-hidden bg-[#f2ede4] aspect-[3/4]">
        {product.image ? (
          <img
            src={`${BASE_URL}${product.image}`}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag size={36} className="text-[#0a1628]/20" />
          </div>
        )}

        {/* Stock states */}
        {product.stock === 0 ? (
          <div className="absolute inset-0 bg-[#0a1628]/40 backdrop-blur-[2px] flex items-center justify-center z-[4]">
            <span className="bg-white text-[#0a1628] text-[0.7rem] font-bold tracking-widest uppercase px-5 py-2 rounded-full">
              Out of Stock
            </span>
          </div>
        ) : product.stock <= 5 ? (
          <div className="absolute bottom-0 left-0 right-0 bg-red-500/90 text-white text-[0.6rem] font-bold tracking-[0.1em] uppercase text-center py-1.5 z-[3]">
            Only {product.stock} left
          </div>
        ) : null}

        {/* Quick-add overlay (hover) */}
        {product.stock > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-[#0a1628]/88 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] flex gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
              className="flex-1 py-2.5 rounded-xl bg-yellow-500 text-[#0a1628] text-[0.74rem] font-bold tracking-wide hover:bg-yellow-400 transition-colors"
            >
              Add to Cart
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); navigate(`/product/${product._id}`); }}
              className="px-3 py-2.5 rounded-xl bg-white/15 border border-white/20 text-white hover:bg-white/25 transition-colors backdrop-blur-sm"
            >
              <Eye size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[0.62rem] font-bold tracking-widest uppercase text-yellow-600 mb-1">
          {product.category}
        </p>
        <h3 className="font-bold text-[#0a1628] text-sm leading-snug mb-1.5 line-clamp-2" style={{ fontFamily: "serif" }}>
          {product.name}
        </h3>
        {product.description && (
          <p className="text-xs text-gray-400 leading-relaxed mb-3 line-clamp-2">
            {product.description}
          </p>
        )}
        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            <p className="text-[0.58rem] text-gray-400 tracking-wider uppercase mb-0.5">BDT</p>
            <p className="font-black text-[#0a1628] text-lg" style={{ fontFamily: "serif" }}>
              {Number(product.price).toLocaleString()}
            </p>
          </div>
          {product.rating && (
            <div className="text-right">
              <p className="text-yellow-500 text-[0.65rem] tracking-wide">
                {"★".repeat(Math.round(product.rating))}{"☆".repeat(5 - Math.round(product.rating))}
              </p>
              <p className="text-[0.6rem] text-gray-400">({product.reviews})</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── MAIN PRODUCT PAGE ───────────────────────────────────────────
export default function Product() {
  const [products, setProducts]   = useState([]);
  const [active, setActive]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [message, setMessage]     = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (active) params.append("type", active);
        const res = await fetch(`${BASE_URL}/api/products?${params}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch {
        setMessage("Could not load products from server.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [active]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setMessage(`${product.name} added to cart!`);
    setTimeout(() => setMessage(""), 2500);
  };

  return (
    <div className="max-w-[1320px] mx-auto px-8 py-11 pb-24" style={{ fontFamily: "'Jost', sans-serif" }}>

      {/* ── Page Header ── */}
      <div className="flex items-end justify-between pb-7 border-b border-black/[0.07] mb-11">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-px bg-yellow-600" />
            <span className="text-[0.62rem] font-bold tracking-[0.24em] uppercase text-yellow-600">Our Collection</span>
          </div>
          <h1 className="font-black text-[#0a1628] leading-[1.05]"
              style={{ fontFamily: "serif", fontSize: "clamp(2rem,4vw,2.9rem)" }}>
            All <em className="italic text-yellow-700">Products</em>
          </h1>
          <p className="text-[0.78rem] text-gray-400 mt-1.5 tracking-wide">
            Handpicked pieces, crafted for every occasion
          </p>
        </div>
      </div>

      {/* ── Category Pills (same as CategoryBar) ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-4 [scrollbar-width:none]">
        {CATEGORIES.map((cat) => {
          const isActive = active === cat.value;
          return (
            <motion.button
              key={cat.value ?? "all"}
              onClick={() => setActive(cat.value)}
              whileTap={{ scale: 0.93 }}
              className={`flex-shrink-0 flex items-center gap-1.5 text-sm font-medium px-4 py-2.5 rounded-full border transition-all duration-200
                ${isActive
                  ? "bg-[#0a1628] text-yellow-400 border-[#0a1628] shadow-lg"
                  : "bg-white text-[#0a1628] border-black/[0.08] hover:border-[#0a1628]/30 hover:bg-[#0a1628]/[0.03]"}`}
            >
              <span className="text-[0.95rem] leading-none">{cat.emoji}</span>
              <span className="whitespace-nowrap tracking-wide">{cat.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* ── Meta row ── */}
      <div className="flex items-center justify-between mb-7">
        <div className="flex items-center gap-2.5">
          <span className="text-[0.78rem] text-gray-400">
            <strong className="text-[#0a1628] font-semibold">{products.length}</strong> products
          </span>
          <span className="text-[0.66rem] font-bold tracking-[0.14em] uppercase text-yellow-600 bg-yellow-50 px-2.5 py-1 rounded-full">
            {CATEGORIES.find(c => c.value === active)?.label ?? "All"}
          </span>
        </div>
        <button className="flex items-center gap-2 text-[0.74rem] font-medium tracking-wider text-[#0a1628] border border-black/[0.08] px-4 py-2 rounded-xl bg-white hover:border-yellow-600 hover:text-yellow-700 transition-all">
          <SlidersHorizontal size={13} /> Sort & Filter
        </button>
      </div>

      {/* ── Grid ── */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex items-center justify-center py-24">
            <Loader2 size={30} className="animate-spin text-[#0a1628]/25" />
          </motion.div>

        ) : products.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-center py-20">
            <ShoppingBag size={42} className="mx-auto text-[#0a1628]/10 mb-4" />
            <h3 className="font-bold text-[#0a1628] text-xl mb-1.5" style={{ fontFamily: "serif" }}>
              No products found
            </h3>
            <p className="text-sm text-gray-400">Try a different category</p>
          </motion.div>

        ) : (
          <motion.div key={active ?? "all"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {products.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} onAddToCart={handleAddToCart} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toast ── */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#0a1628] text-white px-6 py-3 rounded-full text-[0.78rem] font-medium tracking-wide z-50 flex items-center gap-2 whitespace-nowrap shadow-xl"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 flex-shrink-0" />
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}