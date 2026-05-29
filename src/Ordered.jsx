import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_STYLES = {
  Delivered: { bg: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.3)", color: "#4ade80", dot: "#4ade80" },
  Shipped:   { bg: "rgba(201,162,39,0.1)", border: "rgba(201,162,39,0.3)", color: "#e8c84a", dot: "#e8c84a" },
  Pending:   { bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.3)", color: "#60a5fa", dot: "#60a5fa" },
  Cancelled: { bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.3)", color: "#f87171", dot: "#f87171" },
};

export default function Ordered() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("https://backend-4g4m.onrender.com/api/orders/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.log("Error loading orders:", err.message);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchOrders();
  }, [token]);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "1rem 0" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="#C9A227" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ animation: "spin 1s linear infinite", flexShrink: 0 }}>
          <path d="M21 12a9 9 0 11-6.219-8.56"/>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </svg>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>Loading orders…</span>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={{
        padding: "2.5rem 1rem", textAlign: "center",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: "rgba(255,255,255,0.04)",
          border: "0.5px solid rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="rgba(255,255,255,0.25)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
        </div>
        <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.25)" }}>No orders yet</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {orders.map((order, i) => {
        const status = order.status || "Pending";
        const style = STATUS_STYLES[status] || STATUS_STYLES.Pending;
        const isOpen = expanded === order._id;
        const total = order.items.reduce((sum, it) => sum + it.price * it.quantity, 0);

        return (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "0.5px solid rgba(255,255,255,0.08)",
              borderRadius: 14, overflow: "hidden",
            }}
          >
            {/* Order header — clickable to expand */}
            <div
              onClick={() => setExpanded(isOpen ? null : order._id)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "14px 16px", cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              {/* Order ID */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#fff" }}>
                  #{order._id.slice(-6).toUpperCase()}
                </p>
                <p style={{ margin: "3px 0 0", fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""} · ৳{total.toLocaleString()}
                </p>
              </div>

              {/* Status badge */}
              <span style={{
                padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                letterSpacing: "0.05em",
                background: style.bg, border: `0.5px solid ${style.border}`, color: style.color,
                display: "flex", alignItems: "center", gap: 5, flexShrink: 0,
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%", background: style.dot,
                  display: "inline-block",
                }} />
                {status}
              </span>

              {/* Chevron */}
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s", flexShrink: 0 }}
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>

            {/* Expandable items */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  style={{ overflow: "hidden" }}
                >
                  <div style={{
                    borderTop: "0.5px solid rgba(255,255,255,0.07)",
                    padding: "12px 16px",
                    display: "flex", flexDirection: "column", gap: 10,
                  }}>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{
                        display: "flex", alignItems: "center", gap: 12,
                        paddingBottom: idx < order.items.length - 1 ? 10 : 0,
                        borderBottom: idx < order.items.length - 1
                          ? "0.5px solid rgba(255,255,255,0.06)" : "none",
                      }}>
                        <img
                          src={`https://backend-4g4m.onrender.com${item.image}`}
                          alt={item.name}
                          style={{
                            width: 52, height: 52, borderRadius: 10,
                            objectFit: "cover", flexShrink: 0,
                            border: "0.5px solid rgba(255,255,255,0.1)",
                          }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "#fff",
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {item.name}
                          </p>
                          <p style={{ margin: "3px 0 0", fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#e8c84a", flexShrink: 0 }}>
                          ৳{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}

                    {/* Total row */}
                    <div style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      marginTop: 4, paddingTop: 10,
                      borderTop: "0.5px solid rgba(255,255,255,0.07)",
                    }}>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)",
                        textTransform: "uppercase", letterSpacing: "0.06em" }}>Total</span>
                      <span style={{ fontSize: 15, fontWeight: 700, color: "#e8c84a" }}>
                        ৳{total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}