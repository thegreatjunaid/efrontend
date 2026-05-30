import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "./Cartcontext";
import toast from "react-hot-toast";

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, isGuest } = useCart();
  const selectedItems = cartItems;
  const totalPrice = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const [formData, setFormData] = useState({ name: "", phone: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "https://backend-4g4m.onrender.com/api/order",
        {
          address: formData.address,
          phone: formData.phone,
          items: selectedItems,
          guestName: isGuest ? formData.name : null,
          guestEmail: isGuest ? formData.email : null,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );

      const id = res.data.orderId || res.data._id || res.data.order?._id;
      setOrderId(id);
      setSuccess(true);
      setTimeout(() => navigate("/"), 18000);
    } catch (err) {
      console.error("Order failed:", err.message);
      toast.error("Failed to place order. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');
        .checkout-root {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a1628 0%, #0f2147 60%, #0d1b3e 100%);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 48px 16px 64px;
          font-family: 'DM Sans', sans-serif;
        }
        .checkout-grid {
          width: 100%;
          max-width: 900px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
          align-items: start;
        }
        @media (max-width: 700px) {
          .checkout-grid { grid-template-columns: 1fr; }
        }
        .card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(212,175,55,0.18);
          border-radius: 18px;
          padding: 28px;
          backdrop-filter: blur(10px);
        }
        .card-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem;
          color: #d4af37;
          margin: 0 0 22px;
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(212,175,55,0.15);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .order-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .order-item:last-child { border-bottom: none; }
        .order-item-img {
          width: 52px; height: 52px;
          border-radius: 9px; object-fit: cover;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(212,175,55,0.15);
          flex-shrink: 0;
        }
        .order-item-name {
          flex: 1; font-size: 13.5px; color: #e8e8e8;
          font-weight: 500; white-space: nowrap;
          overflow: hidden; text-overflow: ellipsis;
        }
        .order-item-qty { font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 2px; }
        .order-item-price { font-size: 13.5px; font-weight: 700; color: #d4af37; flex-shrink: 0; }
        .total-row {
          display: flex; justify-content: space-between; align-items: center;
          margin-top: 18px; padding-top: 16px;
          border-top: 1px solid rgba(212,175,55,0.2);
        }
        .total-label { font-size: 14px; color: rgba(255,255,255,0.5); }
        .total-amount { font-size: 20px; font-weight: 700; color: #f0f0f0; }
        .field-group { display: flex; flex-direction: column; gap: 14px; }
        .field-label {
          font-size: 11.5px; font-weight: 600; letter-spacing: 0.08em;
          color: rgba(212,175,55,0.8); text-transform: uppercase; margin-bottom: 5px;
        }
        .field-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 10px; padding: 12px 16px;
          color: #f0f0f0; font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none; transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .field-input::placeholder { color: rgba(255,255,255,0.25); }
        .field-input:focus {
          border-color: rgba(212,175,55,0.55);
          box-shadow: 0 0 0 3px rgba(212,175,55,0.08);
        }
        textarea.field-input { resize: vertical; min-height: 90px; }
        .submit-btn {
          width: 100%; margin-top: 8px;
          background: linear-gradient(135deg, #d4af37, #b8941e);
          color: #0a1628; font-family: 'DM Sans', sans-serif;
          font-weight: 700; font-size: 0.95rem; letter-spacing: 0.06em;
          border: none; padding: 14px; border-radius: 11px;
          cursor: pointer; transition: filter 0.2s, transform 0.15s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .submit-btn:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); }
        .submit-btn:active { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }
        .guest-banner {
          display: flex; align-items: center; gap: 10px;
          padding: 11px 14px; border-radius: 10px; margin-bottom: 18px;
          background: rgba(201,162,39,0.08);
          border: 0.5px solid rgba(201,162,39,0.25);
          font-size: 12.5px; color: rgba(201,162,39,0.85);
        }
        .success-overlay { text-align: center; padding: 24px 0 8px; }
        .success-icon {
          width: 64px; height: 64px; border-radius: 50%;
          background: rgba(212,175,55,0.12);
          border: 2px solid rgba(212,175,55,0.4);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 18px;
        }
        .success-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem; color: #d4af37; margin: 0 0 8px;
        }
        .success-sub { font-size: 14px; color: rgba(255,255,255,0.45); margin: 0; }
        .order-id-box {
          margin-top: 20px;
          padding: 14px 18px;
          background: rgba(212,175,55,0.08);
          border: 1px solid rgba(212,175,55,0.25);
          border-radius: 10px;
          text-align: left;
        }
        .order-id-label {
          font-size: 11px;
          color: rgba(212,175,55,0.7);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin: 0 0 6px;
          font-weight: 600;
        }
        .order-id-value {
          font-size: 13.5px;
          color: #f0f0f0;
          margin: 0;
          font-family: monospace;
          word-break: break-all;
        }
        .order-id-hint {
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          margin: 8px 0 0;
        }
        .redirect-note {
          font-size: 12px;
          color: rgba(255,255,255,0.2);
          margin-top: 18px;
        }
        .page-heading { width: 100%; max-width: 900px; margin-bottom: 28px; }
        .page-heading h1 {
          font-family: 'Playfair Display', serif;
          font-size: 2rem; color: #f0f0f0; margin: 0 0 4px;
        }
        .page-heading p { color: rgba(255,255,255,0.35); font-size: 14px; margin: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(10,22,40,0.3);
          border-top-color: #0a1628;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .order-id-box { animation: fadeIn 0.4s ease 0.2s both; }
      `}</style>

      <div className="checkout-root">
        <div style={{ width: "100%", maxWidth: 900 }}>

          <div className="page-heading">
            <h1>Checkout</h1>
            <p>Review your items and complete your order below</p>
          </div>

          <div className="checkout-grid">

            {/* ── LEFT: Order Summary ── */}
            <div className="card">
              <h2 className="card-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                Order Summary
              </h2>

              {selectedItems.length === 0 ? (
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, textAlign: "center", padding: "24px 0" }}>
                  No items in cart
                </p>
              ) : (
                selectedItems.map((item) => {
                  const imgSrc = item.image
                    ? item.image.startsWith("http") ? item.image
                      : `https://backend-4g4m.onrender.com${item.image.startsWith("/") ? "" : "/"}${item.image}`
                    : null;
                  return (
                    <div key={item.productId} className="order-item">
                      {imgSrc ? (
                        <img src={imgSrc} alt={item.name} className="order-item-img"
                          onError={e => { e.currentTarget.style.display = "none"; }} />
                      ) : (
                        <div className="order-item-img" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(212,175,55,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                          </svg>
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p className="order-item-name">{item.name}</p>
                        <p className="order-item-qty">Qty: {item.quantity}</p>
                      </div>
                      <span className="order-item-price">৳{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  );
                })
              )}

              {selectedItems.length > 0 && (
                <div className="total-row">
                  <span className="total-label">{selectedItems.reduce((a, i) => a + i.quantity, 0)} items total</span>
                  <span className="total-amount">৳{totalPrice.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* ── RIGHT: Delivery Form ── */}
            <div className="card">
              {success ? (
                <div className="success-overlay">
                  <div className="success-icon">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <h3 className="success-title">Order Placed!</h3>
                  <p className="success-sub">Thank you for your order!</p>

                  {orderId && (
                    <div className="order-id-box">
                      <p className="order-id-label">Order ID</p>
                      <p className="order-id-value">#{orderId}</p>
                      <p className="order-id-hint">Save this ID to track your order status</p>
                    </div>
                  )}

                  <p className="redirect-note">Redirecting to home in 3 seconds...</p>
                </div>
              ) : (
                <>
                  <h2 className="card-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    Delivery Details
                  </h2>

                  {/* Guest notice */}
                  {isGuest && (
                    <div className="guest-banner">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                      Ordering as guest — <span
                        onClick={() => navigate("/login")}
                        style={{ color: "#e8c84a", cursor: "pointer", textDecoration: "underline", marginLeft: 3 }}
                      >
                        Login
                      </span> to track your orders
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="field-group">

                      <div>
                        <p className="field-label">Full Name</p>
                        <input type="text" name="name" placeholder="e.g. Junaid Ahmed"
                          onChange={handleChange} required className="field-input" />
                      </div>

                      {/* Email only for guests */}
                      {isGuest && (
                        <div>
                          <p className="field-label">Email</p>
                          <input type="email" name="email" placeholder="you@example.com"
                            onChange={handleChange} required className="field-input" />
                        </div>
                      )}

                      <div>
                        <p className="field-label">Phone Number</p>
                        <input type="text" name="phone" placeholder="e.g. 01XXXXXXXXX"
                          onChange={handleChange} required className="field-input" />
                      </div>

                      <div>
                        <p className="field-label">Delivery Address</p>
                        <textarea name="address" placeholder="Street, area, city..."
                          rows="3" onChange={handleChange} required className="field-input" />
                      </div>

                      <button type="submit" className="submit-btn" disabled={loading || selectedItems.length === 0}>
                        {loading ? (
                          <><div className="spinner" /> Placing Order...</>
                        ) : (
                          <>
                            Place Order · ৳{totalPrice.toFixed(2)}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="5" y1="12" x2="19" y2="12"/>
                              <polyline points="12 5 19 12 12 19"/>
                            </svg>
                          </>
                        )}
                      </button>

                    </div>
                  </form>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}