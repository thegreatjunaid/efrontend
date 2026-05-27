import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "./Footer";
import { useCart } from "./Cartcontext";

const isOutOfStock = (stock) => typeof stock === "number" && stock <= 0;

function Productdetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [wished, setWished] = useState(false);

  useEffect(() => {
    fetch(`https://backend-4g4m.onrender.com/api/product/${id}`)
      .then((res) => res.json())
      .then((data) => { setProduct(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    const token = localStorage.getItem("token");
    if (!token) { alert("Please login first"); navigate("/login"); return; }
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#f0f4ff" }}>
        <div
          style={{
            width: 40, height: 40, borderRadius: "50%",
            border: "3px solid transparent",
            borderTopColor: "#C9A227", borderRightColor: "#0d2150",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#f0f4ff" }}>
        <p style={{ fontSize: 18, fontWeight: 500, color: "#0a1628" }}>Product not found</p>
        <button onClick={() => navigate(-1)} style={outlineBtn}>← Go back</button>
      </div>
    );

  return (
    <div style={{ background: "#f0f4ff", minHeight: "100vh" }}>
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-6" style={{ fontSize: 12, color: "rgba(13,33,80,0.5)" }}>
          <span onClick={() => navigate("/home")} className="cursor-pointer hover:text-blue-700 transition">Home</span>
          <ChevronRight />
          <span>{product.category}</span>
          <ChevronRight />
          <span style={{ color: "#0a1628", fontWeight: 500 }}>{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-10">

          {/* LEFT: Image */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
            <div className="relative rounded-2xl overflow-hidden" style={{ background: "#dde8f8", height: 420 }}>
              <img
                src={`https://backend-4g4m.onrender.com${product.image}`}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div style={{
                position: "absolute", top: 14, left: 14,
                background: "linear-gradient(135deg,#C9A227,#e8c84a)",
                color: "#0a1628", fontSize: 11, fontWeight: 500,
                padding: "4px 12px", borderRadius: 20, letterSpacing: "0.04em",
              }}>
                New Arrival
              </div>
              <button
                onClick={() => setWished((w) => !w)}
                aria-label="Add to wishlist"
                style={{
                  position: "absolute", top: 14, right: 14,
                  width: 38, height: 38, borderRadius: "50%",
                  background: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <HeartIcon filled={wished} />
              </button>
            </div>

            <div className="mt-4 overflow-hidden" style={{ border: "0.5px solid rgba(13,33,80,0.12)", borderRadius: 14 }}>
              {[
                { icon: <TruckIcon />, text: "Free delivery inside Dhaka" },
                { icon: <RefreshIcon />, text: "7-day replacement guarantee" },
                { icon: <ShieldIcon />, text: "100% secure payment" },
              ].map((row, i, arr) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 14px", fontSize: 12, color: "#0d2150",
                  background: "rgba(13,33,80,0.025)",
                  borderBottom: i < arr.length - 1 ? "0.5px solid rgba(13,33,80,0.08)" : "none",
                }}>
                  <span style={{ color: "#C9A227", display: "flex" }}>{row.icon}</span>
                  {row.text}
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="flex flex-col">

            <span style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: "rgba(13,33,80,0.08)", color: "#0d2150",
              fontSize: 11, padding: "3px 10px", borderRadius: 20,
              fontWeight: 500, width: "fit-content", marginBottom: 12,
            }}>
              <TagIcon /> {product.category}
            </span>

            <h1 style={{ fontSize: 28, fontWeight: 500, color: "#0a1628", lineHeight: 1.35, marginBottom: 12 }}>
              {product.name}
            </h1>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <span style={{ color: "#C9A227", fontSize: 17, letterSpacing: 2 }}>★★★★★</span>
              <span style={{ fontSize: 12, color: "rgba(13,33,80,0.5)" }}>4.8 · 128 reviews</span>
            </div>

            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 30, fontWeight: 500, color: "#0d2150" }}>৳ {product.price.toLocaleString()}</span>
              <span style={{ fontSize: 13, color: "rgba(13,33,80,0.4)", textDecoration: "line-through" }}>৳ {Math.round(product.price * 1.15).toLocaleString()}</span>
              <span style={{ background: "rgba(29,158,117,0.12)", color: "#0F6E56", fontSize: 11, padding: "3px 8px", borderRadius: 20, fontWeight: 500 }}>13% off</span>
            </div>

            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500,
              marginBottom: 16, padding: "4px 12px", borderRadius: 20, width: "fit-content",
              ...(isOutOfStock(product.stock)
                ? { background: "rgba(226,75,74,0.1)", color: "#A32D2D" }
                : { background: "rgba(29,158,117,0.1)", color: "#0F6E56" }),
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor" }} />
              {isOutOfStock(product.stock) ? "Out of stock" : product.stock > 0 ? `In stock (${product.stock} left)` : "In stock"}
            </div>

            <p style={{ fontSize: 13, color: "rgba(13,33,80,0.65)", lineHeight: 1.75, marginBottom: 20 }}>
              {product.description}
            </p>

            <div style={{ height: 0.5, background: "rgba(13,33,80,0.1)", marginBottom: 20 }} />

            <p style={{ fontSize: 11, color: "rgba(13,33,80,0.5)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 500, marginBottom: 8 }}>
              Quantity
            </p>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 22, width: "fit-content" }}>
              <button onClick={() => qty > 1 && setQty((q) => q - 1)} style={qtyBtnStyle("left")} aria-label="Decrease quantity">−</button>
              <div style={qtyValStyle}>{qty}</div>
              <button onClick={() => setQty((q) => q + 1)} style={qtyBtnStyle("right")} aria-label="Increase quantity">+</button>
            </div>

            {/* Action buttons — plain <button> to avoid Framer hover bug */}
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              <button
                onClick={handleAddToCart}
                disabled={added || isOutOfStock(product.stock)}
                style={{
                  flex: 1, padding: "13px 0", borderRadius: 13, border: "none",
                  background: added
                    ? "linear-gradient(135deg,#0F6E56,#1D9E75)"
                    : "linear-gradient(135deg,#0d2150,#1a3a6e)",
                  color: added ? "#fff" : "#e8c84a",
                  fontSize: 14, fontWeight: 500,
                  cursor: added || isOutOfStock(product.stock) ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                  opacity: isOutOfStock(product.stock) ? 0.5 : 1,
                  transition: "background 0.4s",
                }}
              >
                {added ? <><CheckIcon /> Added to cart!</> : <><CartIcon /> Add to cart</>}
              </button>

              <button
                style={{
                  flex: 1, padding: "13px 0", borderRadius: 13,
                  border: "0.5px solid rgba(13,33,80,0.22)",
                  background: "#fff", color: "#0d2150",
                  fontSize: 14, fontWeight: 500, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(13,33,80,0.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
              >
                <BoltIcon /> Buy now
              </button>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              {[
                { icon: <TruckIcon />, label: "Fast delivery" },
                { icon: <ShieldIcon />, label: "Authentic" },
                { icon: <TagIcon />, label: "Best price" },
              ].map((t, i) => (
                <div key={i} style={{
                  flex: 1, border: "0.5px solid rgba(13,33,80,0.1)",
                  borderRadius: 10, padding: "10px 8px", textAlign: "center",
                  fontSize: 11, color: "rgba(13,33,80,0.6)", background: "#fff",
                }}>
                  <span style={{ display: "flex", justifyContent: "center", color: "#C9A227", marginBottom: 4 }}>{t.icon}</span>
                  {t.label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Product details section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          style={{
            marginTop: "2.5rem", background: "#fff",
            borderRadius: 16, border: "0.5px solid rgba(13,33,80,0.12)", padding: "1.5rem",
          }}
        >
          <h2 style={{ fontSize: 17, fontWeight: 500, color: "#0a1628", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#C9A227", display: "flex" }}><FileIcon /></span>
            Product details
          </h2>
          <p style={{ fontSize: 13, color: "rgba(13,33,80,0.65)", lineHeight: 1.8 }}>
            This product is carefully selected for premium quality and durability.
            It is designed to give you the best experience and long-lasting performance.
            Perfect for everyday use and suitable for all age groups. Each unit undergoes
            rigorous quality control before dispatch.
          </p>
        </motion.div>

      </div>
      <Footer />
    </div>
  );
}

export default Productdetails;

/* ── Shared styles ── */
const qtyBtnStyle = (side) => ({
  width: 38, height: 38,
  border: "0.5px solid rgba(13,33,80,0.2)",
  background: "#fff", cursor: "pointer", fontSize: 20, color: "#0d2150",
  display: "flex", alignItems: "center", justifyContent: "center",
  borderRadius: side === "left" ? "10px 0 0 10px" : "0 10px 10px 0",
});

const qtyValStyle = {
  width: 50, height: 38,
  borderTop: "0.5px solid rgba(13,33,80,0.2)",
  borderBottom: "0.5px solid rgba(13,33,80,0.2)",
  borderLeft: "none", borderRight: "none",
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: 15, fontWeight: 500, color: "#0a1628", background: "#fff",
};

const outlineBtn = {
  padding: "10px 20px", borderRadius: 10,
  border: "0.5px solid rgba(13,33,80,0.2)",
  background: "#fff", color: "#0d2150", fontSize: 14, cursor: "pointer",
};

/* ── SVG Icons ── */
const ic = { width: 16, height: 16, fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
const ChevronRight = () => <svg {...ic} width={12} height={12} viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>;
const TagIcon = () => <svg {...ic} viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;
const HeartIcon = ({ filled }) => <svg width={18} height={18} fill={filled ? "#e24b4a" : "none"} stroke={filled ? "#e24b4a" : "#c9a227"} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>;
const TruckIcon = () => <svg {...ic} viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
const RefreshIcon = () => <svg {...ic} viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>;
const ShieldIcon = () => <svg {...ic} viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const CartIcon = () => <svg {...ic} viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>;
const CheckIcon = () => <svg {...ic} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>;
const BoltIcon = () => <svg {...ic} viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const FileIcon = () => <svg {...ic} viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;