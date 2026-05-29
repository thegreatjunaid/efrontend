import { Link } from "react-router-dom";
import { useCart } from "./Cartcontext";

const HEADER_HEIGHT = 73; // px — matches your sticky header height

function CartDrawer() {
  const { cartItems, isOpen, closeCart, removeFromCart, decreaseQuantity, totalPrice } = useCart();

  return (
    <>
      {/* Backdrop — starts below header */}
      <div
        onClick={closeCart}
        style={{
          display: isOpen ? "block" : "none",
          position: "fixed",
          top: HEADER_HEIGHT,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(3px)",
          zIndex: 98,
        }}
      />

      {/* Drawer panel — starts below header */}
      <div
        style={{
          position: "fixed",
          top: HEADER_HEIGHT,
          right: 0,
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          width: 380,
          background: "linear-gradient(160deg, #0a1628 0%, #0f2147 100%)",
          borderLeft: "1px solid rgba(212,175,55,0.2)",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.6)",
          zIndex: 99,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
          display: "flex",
          flexDirection: "column",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=DM+Sans:wght@400;500;600&display=swap');

          .drawer-scrollbar::-webkit-scrollbar { width: 4px; }
          .drawer-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .drawer-scrollbar::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.3); border-radius: 99px; }

          .cart-item-row {
            display: flex;
            gap: 14px;
            padding: 14px 0;
            border-bottom: 1px solid rgba(255,255,255,0.07);
            transition: background 0.2s;
          }
          .cart-item-row:last-child { border-bottom: none; }

          .qty-btn {
            width: 28px;
            height: 28px;
            border-radius: 6px;
            border: 1px solid rgba(212,175,55,0.3);
            background: rgba(212,175,55,0.08);
            color: #d4af37;
            font-size: 15px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
            font-family: 'DM Sans', sans-serif;
            line-height: 1;
          }
          .qty-btn:hover { background: rgba(212,175,55,0.2); }

          .delete-btn {
            background: none;
            border: none;
            cursor: pointer;
            color: rgba(239,68,68,0.6);
            font-size: 16px;
            padding: 4px;
            border-radius: 6px;
            transition: color 0.2s, background 0.2s;
            display: flex;
            align-items: flex-start;
            line-height: 1;
          }
          .delete-btn:hover { color: #ef4444; background: rgba(239,68,68,0.1); }

          .checkout-btn {
            display: block;
            text-align: center;
            background: linear-gradient(135deg, #d4af37, #b8941e);
            color: #0a1628;
            padding: 13px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 700;
            font-size: 0.9rem;
            letter-spacing: 0.05em;
            font-family: 'DM Sans', sans-serif;
            transition: filter 0.2s, transform 0.15s;
          }
          .checkout-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
          .checkout-btn:active { transform: translateY(0); }

          .img-fallback {
            width: 72px;
            height: 72px;
            border-radius: 10px;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(212,175,55,0.15);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            overflow: hidden;
          }
          .img-fallback img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
            border-radius: 10px;
            display: block;
          }
        `}</style>

        {/* ── HEADER ── */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 22px",
          borderBottom: "1px solid rgba(212,175,55,0.15)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: "#f0f0f0", letterSpacing: "0.01em" }}>
              Your Cart
              {cartItems.length > 0 && (
                <span style={{
                  marginLeft: 8,
                  background: "linear-gradient(135deg,#d4af37,#b8941e)",
                  color: "#0a1628",
                  fontSize: 11,
                  fontWeight: 700,
                  borderRadius: 99,
                  padding: "1px 8px",
                  verticalAlign: "middle",
                }}>
                  {cartItems.length}
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={closeCart}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.7)",
              width: 32,
              height: 32,
              borderRadius: 8,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              transition: "background 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
          >✕</button>
        </div>

        {/* ── ITEMS ── */}
        <div className="drawer-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "8px 22px" }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: "center", marginTop: 60 }}>
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="rgba(212,175,55,0.3)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 16 }}>
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 14, margin: 0 }}>Your cart is empty</p>
            </div>
          ) : (
            cartItems.map((item) => {
              // Robustly resolve image URL
              const imgSrc = item.image
                ? item.image.startsWith("http")
                  ? item.image
                  : `https://backend-4g4m.onrender.com${item.image.startsWith("/") ? "" : "/"}${item.image}`
                : null;

              return (
                <div key={item.productId} className="cart-item-row">

                  {/* Image */}
                  <div className="img-fallback">
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={item.name}
                        onError={e => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.parentElement.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(212,175,55,0.4)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`;
                        }}
                      />
                    ) : (
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(212,175,55,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: "0 0 3px", fontWeight: 600, fontSize: 13.5, color: "#f0f0f0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {item.name}
                    </p>
                    <p style={{ margin: "0 0 10px", color: "#d4af37", fontSize: 13, fontWeight: 600 }}>
                      ৳{item.price?.toFixed ? item.price.toFixed(2) : item.price}
                    </p>

                    {/* Qty controls */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <button className="qty-btn" onClick={() => decreaseQuantity(item.productId)}>−</button>
                      <span style={{ fontSize: 14, color: "#f0f0f0", minWidth: 18, textAlign: "center" }}>{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => {/* increaseQuantity if you add it later */}}
                        style={{ opacity: 0.4, cursor: "not-allowed" }}
                        disabled
                      >+</button>
                    </div>
                  </div>

                  {/* Subtotal + delete */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between", flexShrink: 0 }}>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>
                      ৳{((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                    </span>
                    <button className="delete-btn" onClick={() => removeFromCart(item.productId)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                        <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                      </svg>
                    </button>
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* ── FOOTER ── */}
        {cartItems.length > 0 && (
          <div style={{
            padding: "16px 22px 20px",
            borderTop: "1px solid rgba(212,175,55,0.15)",
            flexShrink: 0,
            background: "rgba(0,0,0,0.2)",
          }}>
            {/* Subtotal row */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
              <span>{cartItems.reduce((a, i) => a + (i.quantity || 0), 0)} items</span>
              <span>Subtotal</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, fontSize: 17, fontWeight: 700, color: "#f0f0f0" }}>
              <span style={{ color: "#d4af37" }}>Total</span>
              <span>৳{totalPrice.toFixed(2)}</span>
            </div>
            <Link to="/checkout" onClick={closeCart} className="checkout-btn">
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export default CartDrawer;