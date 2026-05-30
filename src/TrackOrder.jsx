import { useState } from "react";
import axios from "axios";

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const STATUS_STEPS = ["Pending", "Processing", "Shipped", "Delivered"];

  const STATUS_STYLES = {
    Pending:    { bg: "rgba(96,165,250,0.1)",   border: "rgba(96,165,250,0.3)",   color: "#60a5fa", dot: "#60a5fa" },
    Processing: { bg: "rgba(251,191,36,0.1)",   border: "rgba(251,191,36,0.3)",   color: "#fbbf24", dot: "#fbbf24" },
    Shipped:    { bg: "rgba(201,162,39,0.1)",   border: "rgba(201,162,39,0.3)",   color: "#e8c84a", dot: "#e8c84a" },
    Delivered:  { bg: "rgba(74,222,128,0.1)",   border: "rgba(74,222,128,0.3)",   color: "#4ade80", dot: "#4ade80" },
    Cancelled:  { bg: "rgba(248,113,113,0.1)",  border: "rgba(248,113,113,0.3)",  color: "#f87171", dot: "#f87171" },
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const res = await axios.get(`https://backend-4g4m.onrender.com/api/order/track/${orderId.trim()}`);
      setOrder(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Order not found. Check your Order ID.");
    } finally {
      setLoading(false);
    }
  };

  const currentStep = order ? STATUS_STEPS.indexOf(order.status) : -1;
  const style = order ? (STATUS_STYLES[order.status] || STATUS_STYLES.Pending) : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');

        .track-root {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a1628 0%, #0f2147 60%, #0d1b3e 100%);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 52px 16px 80px;
          font-family: 'DM Sans', sans-serif;
        }

        .track-inner {
          width: 100%;
          max-width: 620px;
        }

        .track-heading h1 {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          color: #f0f0f0;
          margin: 0 0 6px;
        }
        .track-heading p {
          color: rgba(255,255,255,0.35);
          font-size: 14px;
          margin: 0 0 32px;
        }

        .card {
          background: rgba(255,255,255,0.04);
          border: 0.5px solid rgba(212,175,55,0.2);
          border-radius: 20px;
          padding: 28px;
          backdrop-filter: blur(10px);
          margin-bottom: 16px;
        }

        .search-row {
          display: flex;
          gap: 10px;
        }

        .track-input {
          flex: 1;
          background: rgba(255,255,255,0.05);
          border: 0.5px solid rgba(212,175,55,0.25);
          border-radius: 11px;
          padding: 13px 16px;
          color: #f0f0f0;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          letter-spacing: 0.04em;
        }
        .track-input::placeholder { color: rgba(255,255,255,0.22); }
        .track-input:focus {
          border-color: rgba(212,175,55,0.5);
          box-shadow: 0 0 0 3px rgba(212,175,55,0.08);
        }

        .track-btn {
          background: linear-gradient(135deg, #d4af37, #b8941e);
          color: #0a1628;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 14px;
          border: none;
          padding: 13px 22px;
          border-radius: 11px;
          cursor: pointer;
          transition: filter 0.2s, transform 0.15s;
          display: flex;
          align-items: center;
          gap: 7px;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .track-btn:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); }
        .track-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .error-box {
          margin-top: 14px;
          padding: 11px 14px;
          border-radius: 10px;
          font-size: 13px;
          background: rgba(248,113,113,0.1);
          border: 0.5px solid rgba(248,113,113,0.3);
          color: #f87171;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .section-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(212,175,55,0.6);
          margin: 0 0 16px;
        }

        /* Status steps */
        .steps-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          position: relative;
          margin-bottom: 8px;
        }

        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          position: relative;
          z-index: 1;
        }

        .step-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 8px;
          transition: all 0.3s;
          border: 2px solid;
          flex-shrink: 0;
        }

        .step-label {
          font-size: 11px;
          font-weight: 500;
          text-align: center;
          color: rgba(255,255,255,0.35);
          transition: color 0.3s;
        }
        .step-label.active { color: #e8c84a; }
        .step-label.done   { color: rgba(255,255,255,0.6); }

        .steps-line-wrap {
          position: absolute;
          top: 18px;
          left: 10%;
          right: 10%;
          height: 2px;
          background: rgba(255,255,255,0.07);
          z-index: 0;
        }
        .steps-line-fill {
          height: 100%;
          background: linear-gradient(90deg, #d4af37, #b8941e);
          transition: width 0.5s ease;
          border-radius: 2px;
        }

        /* Order details */
        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 0.5px solid rgba(255,255,255,0.06);
        }
        .detail-row:last-child { border-bottom: none; }
        .detail-key {
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-weight: 600;
        }
        .detail-val {
          font-size: 13px;
          color: #f0f0f0;
          font-weight: 500;
          text-align: right;
          max-width: 60%;
        }

        /* Items */
        .order-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 0;
          border-bottom: 0.5px solid rgba(255,255,255,0.06);
        }
        .order-item:last-child { border-bottom: none; }

        .item-img {
          width: 48px;
          height: 48px;
          border-radius: 9px;
          object-fit: cover;
          border: 0.5px solid rgba(212,175,55,0.15);
          flex-shrink: 0;
        }
        .item-img-placeholder {
          width: 48px;
          height: 48px;
          border-radius: 9px;
          background: rgba(255,255,255,0.04);
          border: 0.5px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 17px; height: 17px;
          border: 2px solid rgba(10,22,40,0.3);
          border-top-color: #0a1628;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
      `}</style>

      <div className="track-root">
        <div className="track-inner">

          {/* Heading */}
          <div className="track-heading">
            <h1>Track Your Order</h1>
            <p>Enter your Order ID to check the current status</p>
          </div>

          {/* Search card */}
          <div className="card">
            <form onSubmit={handleTrack}>
              <div className="search-row">
                <input
                  className="track-input"
                  placeholder="Enter Order ID e.g. A1B2C3"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                />
                <button type="submit" className="track-btn" disabled={loading || !orderId.trim()}>
                  {loading ? <div className="spinner" /> : (
                    <>
                      Track
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="error-box">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}
            </form>
          </div>

          {/* Result */}
          {order && (
            <>
              {/* Status tracker */}
              {order.status !== "Cancelled" && (
                <div className="card">
                  <p className="section-label">Order Progress</p>

                  <div style={{ position: "relative" }}>
                    <div className="steps-line-wrap">
                      <div className="steps-line-fill" style={{
                        width: currentStep <= 0 ? "0%"
                          : `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%`
                      }} />
                    </div>

                    <div className="steps-row">
                      {STATUS_STEPS.map((step, i) => {
                        const done   = i < currentStep;
                        const active = i === currentStep;
                        return (
                          <div key={step} className="step-item">
                            <div className="step-circle" style={{
                              background: done || active
                                ? "linear-gradient(135deg, #d4af37, #b8941e)"
                                : "rgba(255,255,255,0.04)",
                              borderColor: done || active
                                ? "#d4af37"
                                : "rgba(255,255,255,0.1)",
                              color: done || active ? "#0a1628" : "rgba(255,255,255,0.2)",
                            }}>
                              {done ? (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                  stroke="#0a1628" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"/>
                                </svg>
                              ) : (
                                i + 1
                              )}
                            </div>
                            <span className={`step-label ${active ? "active" : done ? "done" : ""}`}>
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Order details */}
              <div className="card">
                <p className="section-label">Order Details</p>

                {/* Status badge */}
                <div style={{ marginBottom: 16 }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700,
                    background: style.bg, border: `0.5px solid ${style.border}`, color: style.color,
                  }}>
                    <span style={{
                      width: 7, height: 7, borderRadius: "50%",
                      background: style.dot, display: "inline-block",
                    }} />
                    {order.status}
                  </span>
                </div>

                {[
                  { key: "Order ID",   val: `#${order._id.slice(-6).toUpperCase()}` },
                  { key: "Placed on",  val: new Date(order.createdAt).toLocaleDateString("en-BD", { day: "numeric", month: "long", year: "numeric" }) },
                  { key: "Phone",      val: order.phone || "—" },
                  { key: "Address",    val: order.address || "—" },
                  { key: "Total",      val: `৳${order.totalAmount?.toLocaleString()}` },
                ].map(({ key, val }) => (
                  <div key={key} className="detail-row">
                    <span className="detail-key">{key}</span>
                    <span className="detail-val">{val}</span>
                  </div>
                ))}
              </div>

              {/* Items */}
              <div className="card">
                <p className="section-label">{order.items?.length} Item{order.items?.length !== 1 ? "s" : ""}</p>

                {order.items?.map((item, i) => {
                  const imgSrc = item.image
                    ? item.image.startsWith("http") ? item.image
                      : `https://backend-4g4m.onrender.com${item.image.startsWith("/") ? "" : "/"}${item.image}`
                    : null;
                  return (
                    <div key={i} className="order-item">
                      {imgSrc ? (
                        <img src={imgSrc} alt={item.name} className="item-img"
                          onError={e => { e.currentTarget.style.display = "none"; }} />
                      ) : (
                        <div className="item-img-placeholder">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="rgba(212,175,55,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                          </svg>
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "#e8e8e8",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {item.name}
                        </p>
                        <p style={{ margin: "3px 0 0", fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#d4af37", flexShrink: 0 }}>
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  );
                })}

                {/* Total */}
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  marginTop: 14, paddingTop: 14,
                  borderTop: "0.5px solid rgba(212,175,55,0.15)",
                }}>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)",
                    textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>
                    Total
                  </span>
                  <span style={{ fontSize: 18, fontWeight: 700, color: "#f0f0f0" }}>
                    ৳{order.totalAmount?.toLocaleString()}
                  </span>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}