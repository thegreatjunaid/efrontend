import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Heart, Eye, Loader2, SlidersHorizontal, X, ChevronDown, ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./Cartcontext";

const BASE_URL = "https://backend-4g4m.onrender.com";

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

const SORT_OPTIONS = [
  { label: "Default",        value: "default" },
  { label: "Price: Low → High", value: "price_asc" },
  { label: "Price: High → Low", value: "price_desc" },
  { label: "Name: A → Z",    value: "name_asc" },
  { label: "Name: Z → A",    value: "name_desc" },
];

// ── DUAL RANGE SLIDER ──────────────────────────────────────────
function PriceRangeSlider({ min, max, values, onChange }) {
  const trackRef = useRef(null);
  const dragging = useRef(null);

  const getPercent = (val) => ((val - min) / (max - min)) * 100;

  const clamp = (v) => Math.min(max, Math.max(min, v));

  const handleMouseMove = useCallback((e) => {
    if (!dragging.current || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const raw = Math.round(min + ratio * (max - min));
    if (dragging.current === "low") {
      onChange([clamp(Math.min(raw, values[1] - 1)), values[1]]);
    } else {
      onChange([values[0], clamp(Math.max(raw, values[0] + 1))]);
    }
  }, [min, max, values, onChange]);

  const stopDrag = useCallback(() => { dragging.current = null; }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("touchmove", handleMouseMove);
    window.addEventListener("touchend", stopDrag);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("touchend", stopDrag);
    };
  }, [handleMouseMove, stopDrag]);

  const lowPct  = getPercent(values[0]);
  const highPct = getPercent(values[1]);

  return (
    <div className="mt-4 px-1">
      {/* Track */}
      <div ref={trackRef} className="relative h-1.5 rounded-full bg-black/[0.07] select-none">
        {/* Fill */}
        <div
          className="absolute h-full rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400"
          style={{ left: `${lowPct}%`, width: `${highPct - lowPct}%` }}
        />
        {/* Low thumb */}
        <button
          onMouseDown={() => { dragging.current = "low"; }}
          onTouchStart={() => { dragging.current = "low"; }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-yellow-500 shadow-md hover:scale-110 transition-transform cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
          style={{ left: `${lowPct}%` }}
        />
        {/* High thumb */}
        <button
          onMouseDown={() => { dragging.current = "high"; }}
          onTouchStart={() => { dragging.current = "high"; }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-yellow-500 shadow-md hover:scale-110 transition-transform cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
          style={{ left: `${highPct}%` }}
        />
      </div>
      {/* Labels */}
      <div className="flex justify-between mt-3">
        <span className="text-[0.72rem] font-semibold text-[#0a1628]">৳ {values[0].toLocaleString()}</span>
        <span className="text-[0.72rem] font-semibold text-[#0a1628]">৳ {values[1].toLocaleString()}</span>
      </div>
    </div>
  );
}

// ── FILTER PANEL (slide-in drawer) ────────────────────────────
function FilterPanel({ open, onClose, priceRange, setPriceRange, sortBy, setSortBy, allProducts }) {
  const GLOBAL_MIN = 0;
  const GLOBAL_MAX = allProducts.length
    ? Math.ceil(Math.max(...allProducts.map(p => Number(p.price) || 0)) / 500) * 500
    : 10000;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-80 bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/[0.06]">
              <div>
                <h2 className="font-black text-[#0a1628] text-lg" style={{ fontFamily: "serif" }}>
                  Sort & Filter
                </h2>
                <p className="text-[0.65rem] text-gray-400 tracking-wider uppercase mt-0.5">Refine your results</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/[0.04] flex items-center justify-center hover:bg-black/[0.08] transition-colors"
              >
                <X size={14} className="text-[#0a1628]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">

              {/* ── Sort ── */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <ArrowUpDown size={13} className="text-yellow-600" />
                  <span className="text-[0.65rem] font-bold tracking-[0.18em] uppercase text-yellow-600">Sort By</span>
                </div>
                <div className="space-y-1.5">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSortBy(opt.value)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                        ${sortBy === opt.value
                          ? "bg-[#0a1628] text-yellow-400 shadow-sm"
                          : "text-[#0a1628] hover:bg-black/[0.04]"}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Price Range ── */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[0.65rem] font-bold tracking-[0.18em] uppercase text-yellow-600">Price Range</span>
                  </div>
                  {(priceRange[0] !== GLOBAL_MIN || priceRange[1] !== GLOBAL_MAX) && (
                    <button
                      onClick={() => setPriceRange([GLOBAL_MIN, GLOBAL_MAX])}
                      className="text-[0.62rem] text-gray-400 hover:text-red-400 transition-colors underline underline-offset-2"
                    >
                      Reset
                    </button>
                  )}
                </div>

                <PriceRangeSlider
                  min={GLOBAL_MIN}
                  max={GLOBAL_MAX}
                  values={priceRange}
                  onChange={setPriceRange}
                />

                {/* Quick-pick chips */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {[
                    { label: "Under ৳500",  range: [0, 500] },
                    { label: "৳500–2k",     range: [500, 2000] },
                    { label: "৳2k–5k",      range: [2000, 5000] },
                    { label: "৳5k+",        range: [5000, GLOBAL_MAX] },
                  ].map((chip) => {
                    const active = priceRange[0] === chip.range[0] && priceRange[1] === chip.range[1];
                    return (
                      <button
                        key={chip.label}
                        onClick={() => setPriceRange(chip.range)}
                        className={`text-[0.65rem] font-semibold px-2.5 py-1 rounded-full border transition-all
                          ${active
                            ? "bg-yellow-500 text-[#0a1628] border-yellow-500"
                            : "border-black/[0.08] text-gray-500 hover:border-yellow-500/50 hover:text-yellow-700"}`}
                      >
                        {chip.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-black/[0.06]">
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-[#0a1628] text-yellow-400 text-sm font-bold tracking-wide hover:bg-[#0a1628]/90 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── PRODUCT CARD ───────────────────────────────────────────────
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
      {product.badge && (
        <span className={`absolute top-2.5 left-2.5 z-10 text-[0.58rem] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full
          ${product.badge === "new"  ? "bg-[#0a1628] text-yellow-400" :
            product.badge === "hot"  ? "bg-gradient-to-r from-red-500 to-rose-400 text-white" :
                                       "bg-gradient-to-r from-emerald-600 to-teal-400 text-white"}`}>
          {product.badge}
        </span>
      )}

      <button
        onClick={(e) => { e.stopPropagation(); setWished(!wished); }}
        className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 border border-black/[0.06] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
      >
        <Heart size={13} className={wished ? "fill-red-500 stroke-red-500" : "stroke-gray-400"} />
      </button>

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

// ── MAIN PRODUCT PAGE ──────────────────────────────────────────
export default function Product() {
  const [allProducts, setAllProducts] = useState([]);
  const [active, setActive]           = useState(null);
  const [loading, setLoading]         = useState(true);
  const [message, setMessage]         = useState("");
  const [filterOpen, setFilterOpen]   = useState(false);
  const [sortBy, setSortBy]           = useState("default");
  const [priceRange, setPriceRange]   = useState([0, 10000]);
  const { addToCart } = useCart();

  // Compute global max from fetched products
  const globalMax = allProducts.length
    ? Math.ceil(Math.max(...allProducts.map(p => Number(p.price) || 0)) / 500) * 500
    : 10000;

  // Fetch when category changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (active) params.append("type", active);
        const res = await fetch(`${BASE_URL}/api/products?${params}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        const arr = Array.isArray(data) ? data : [];
        setAllProducts(arr);
        // Reset price range to cover new set
        const newMax = arr.length
          ? Math.ceil(Math.max(...arr.map(p => Number(p.price) || 0)) / 500) * 500
          : 10000;
        setPriceRange([0, newMax]);
      } catch {
        setMessage("Could not load products from server.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [active]);

  // Derive display list: filter → sort
  const displayProducts = (() => {
    let list = allProducts.filter((p) => {
      const price = Number(p.price) || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    switch (sortBy) {
      case "price_asc":  list = [...list].sort((a, b) => Number(a.price) - Number(b.price)); break;
      case "price_desc": list = [...list].sort((a, b) => Number(b.price) - Number(a.price)); break;
      case "name_asc":   list = [...list].sort((a, b) => a.name.localeCompare(b.name)); break;
      case "name_desc":  list = [...list].sort((a, b) => b.name.localeCompare(a.name)); break;
      default: break;
    }
    return list;
  })();

  const activeFiltersCount = [
    sortBy !== "default",
    priceRange[0] > 0 || priceRange[1] < globalMax,
  ].filter(Boolean).length;

  const handleAddToCart = (product) => {
    addToCart(product);
    setMessage(`${product.name} added to cart!`);
    setTimeout(() => setMessage(""), 2500);
  };

  const clearAllFilters = () => {
    setSortBy("default");
    setPriceRange([0, globalMax]);
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

      {/* ── Category Pills ── */}
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
      <div className="flex items-center justify-between mb-7 gap-3 flex-wrap">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-[0.78rem] text-gray-400">
            <strong className="text-[#0a1628] font-semibold">{displayProducts.length}</strong>
            {displayProducts.length !== allProducts.length && (
              <span className="text-gray-400"> of {allProducts.length}</span>
            )}{" "}products
          </span>
          <span className="text-[0.66rem] font-bold tracking-[0.14em] uppercase text-yellow-600 bg-yellow-50 px-2.5 py-1 rounded-full">
            {CATEGORIES.find(c => c.value === active)?.label ?? "All"}
          </span>

          {/* Active filter pills */}
          {sortBy !== "default" && (
            <span className="flex items-center gap-1 text-[0.66rem] font-semibold text-[#0a1628] bg-[#0a1628]/[0.06] px-2.5 py-1 rounded-full">
              {SORT_OPTIONS.find(o => o.value === sortBy)?.label}
              <button onClick={() => setSortBy("default")} className="ml-0.5 hover:text-red-400 transition-colors">
                <X size={9} />
              </button>
            </span>
          )}
          {(priceRange[0] > 0 || priceRange[1] < globalMax) && (
            <span className="flex items-center gap-1 text-[0.66rem] font-semibold text-[#0a1628] bg-[#0a1628]/[0.06] px-2.5 py-1 rounded-full">
              ৳{priceRange[0].toLocaleString()} – ৳{priceRange[1].toLocaleString()}
              <button onClick={() => setPriceRange([0, globalMax])} className="ml-0.5 hover:text-red-400 transition-colors">
                <X size={9} />
              </button>
            </span>
          )}
          {activeFiltersCount > 0 && (
            <button onClick={clearAllFilters} className="text-[0.65rem] text-red-400 hover:text-red-500 underline underline-offset-2 transition-colors">
              Clear all
            </button>
          )}
        </div>

        {/* Filter trigger */}
        <button
          onClick={() => setFilterOpen(true)}
          className="relative flex items-center gap-2 text-[0.74rem] font-medium tracking-wider text-[#0a1628] border border-black/[0.08] px-4 py-2 rounded-xl bg-white hover:border-yellow-600 hover:text-yellow-700 transition-all"
        >
          <SlidersHorizontal size={13} />
          Sort & Filter
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-yellow-500 text-[#0a1628] text-[0.55rem] font-black flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Grid ── */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex items-center justify-center py-24">
            <Loader2 size={30} className="animate-spin text-[#0a1628]/25" />
          </motion.div>

        ) : displayProducts.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-center py-20">
            <ShoppingBag size={42} className="mx-auto text-[#0a1628]/10 mb-4" />
            <h3 className="font-bold text-[#0a1628] text-xl mb-1.5" style={{ fontFamily: "serif" }}>
              No products found
            </h3>
            <p className="text-sm text-gray-400 mb-4">Try adjusting your filters or category</p>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-yellow-700 font-semibold underline underline-offset-2 hover:text-yellow-600 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </motion.div>

        ) : (
          <motion.div key={`${active ?? "all"}-${sortBy}-${priceRange.join("-")}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {displayProducts.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} onAddToCart={handleAddToCart} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Filter Panel ── */}
      <FilterPanel
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        sortBy={sortBy}
        setSortBy={setSortBy}
        allProducts={allProducts}
      />

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