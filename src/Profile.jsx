import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Cart from "./Cart";
import Ordered from "./Ordered";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState("");
  const [activeTab, setActiveTab] = useState("orders");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const res = await axios.get(`https://backend-4g4m.onrender.com/api/profile/${userId}`);
        setUser(res.data);
      } catch (err) {
        console.log(err);
        setMsg("Failed to load profile");
      }
    };
    fetchProfile();
  }, []);

  if (!user) {
    return (
      <div style={{
        minHeight: "50vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 14,
      }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
          stroke="#C9A227" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ animation: "spin 1s linear infinite" }}>
          <path d="M21 12a9 9 0 11-6.219-8.56" />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </svg>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>Loading profile…</span>
      </div>
    );
  }

  const initials = user.name
    ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : user.email?.[0]?.toUpperCase() || "?";

  const tabs = [
    { key: "orders", label: "Orders", icon: <BagIcon /> },
    { key: "cart",   label: "Cart",   icon: <CartIcon /> },
  ];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1rem 5rem" }}>

      {msg && (
        <div style={{
          marginBottom: 16, padding: "10px 16px", borderRadius: 10, fontSize: 13,
          background: "rgba(226,75,74,0.1)", border: "0.5px solid rgba(226,75,74,0.3)",
          color: "#f09595",
        }}>{msg}</div>
      )}

      {/* ── PROFILE CARD ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: "linear-gradient(135deg, #0a1628 0%, #0f2a52 55%, #162f5c 100%)",
          border: "0.5px solid rgba(201,162,39,0.3)",
          borderRadius: 22, padding: "2rem",
          position: "relative", overflow: "hidden", marginBottom: 14,
        }}
      >
        {/* Background orbs */}
        <div style={{
          position: "absolute", right: -80, top: -80, width: 260, height: 260,
          borderRadius: "50%", background: "#C9A227", opacity: 0.06, pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", left: -50, bottom: -50, width: 180, height: 180,
          borderRadius: "50%", background: "#3a7bd5", opacity: 0.06, pointerEvents: "none",
        }} />

        <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", position: "relative" }}>

          {/* Avatar */}
          {user.image ? (
            <img
              src={`https://backend-4g4m.onrender.com${user.image}`}
              alt="profile"
              style={{
                width: 82, height: 82, borderRadius: "50%", objectFit: "cover", flexShrink: 0,
                border: "2px solid rgba(201,162,39,0.45)",
              }}
            />
          ) : (
            <div style={{
              width: 82, height: 82, borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg, #B8891E, #e8c84a)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, fontWeight: 700, color: "#0a1628",
              border: "2px solid rgba(201,162,39,0.4)",
              letterSpacing: "-0.02em",
            }}>
              {initials}
            </div>
          )}

          {/* Name + email */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <h2 style={{ margin: 0, fontSize: 21, fontWeight: 600, color: "#fff", letterSpacing: "-0.02em" }}>
                {user.name || "No name"}
              </h2>
              {user.isVerified && (
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
                  textTransform: "uppercase", padding: "3px 9px", borderRadius: 20,
                  background: "rgba(74,222,128,0.1)", border: "0.5px solid rgba(74,222,128,0.3)",
                  color: "#4ade80",
                }}>Verified</span>
              )}
            </div>
            <p style={{ margin: "5px 0 0", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{user.email}</p>
            {user.phone && (
              <p style={{ margin: "3px 0 0", fontSize: 13, color: "rgba(255,255,255,0.3)" }}>{user.phone}</p>
            )}
          </div>

          {/* Member badge */}
          <div style={{
            padding: "7px 16px", borderRadius: 20,
            background: "rgba(201,162,39,0.1)", border: "0.5px solid rgba(201,162,39,0.3)",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
            textTransform: "uppercase", color: "#e8c84a", flexShrink: 0,
          }}>
            Member
          </div>
        </div>

        {/* Info pills */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px,1fr))",
          gap: 10, marginTop: 22,
        }}>
          {[
            { label: "Name",     value: user.name  || "—" },
            { label: "Phone",    value: user.phone || "—" },
            { label: "Verified", value: user.isVerified ? "Yes ✓" : "No" },
          ].map(({ label, value }) => (
            <div key={label} style={{
              background: "rgba(255,255,255,0.04)",
              border: "0.5px solid rgba(255,255,255,0.07)",
              borderRadius: 12, padding: "11px 14px",
            }}>
              <p style={{
                margin: 0, fontSize: 10, fontWeight: 700, letterSpacing: "0.07em",
                textTransform: "uppercase", color: "rgba(201,162,39,0.65)",
              }}>{label}</p>
              <p style={{
                margin: "5px 0 0", fontSize: 13, fontWeight: 500, color: "#fff",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>{value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── TAB BAR ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        style={{
          display: "flex", gap: 6, marginBottom: 14,
          background: "rgba(255,255,255,0.03)",
          border: "0.5px solid rgba(255,255,255,0.08)",
          borderRadius: 14, padding: 5,
        }}
      >
        {tabs.map(({ key, label, icon }) => {
          const active = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                gap: 7, padding: "10px 14px", borderRadius: 10, border: "none",
                cursor: "pointer", fontSize: 13, fontWeight: 600,
                transition: "all 0.2s ease",
                background: active ? "linear-gradient(135deg, #B8891E, #e8c84a)" : "transparent",
                color: active ? "#0a1628" : "rgba(255,255,255,0.4)",
              }}
            >
              <span style={{ opacity: active ? 1 : 0.6 }}>{icon}</span>
              {label}
            </button>
          );
        })}
      </motion.div>

      {/* ── TAB CONTENT ── */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: "rgba(255,255,255,0.025)",
          border: "0.5px solid rgba(255,255,255,0.08)",
          borderRadius: 18, overflow: "hidden",
        }}
      >
        {/* Section header */}
        <div style={{
          padding: "14px 20px",
          borderBottom: "0.5px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10, display: "flex",
            alignItems: "center", justifyContent: "center", flexShrink: 0,
            background: activeTab === "orders"
              ? "linear-gradient(135deg, #B8891E, #e8c84a)"
              : "linear-gradient(135deg, #1a3a6e, #3a7bd5)",
          }}>
            {activeTab === "orders"
              ? <BagIcon color="#0a1628" size={16} />
              : <CartIcon color="#fff" size={16} />}
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#fff" }}>
              {activeTab === "orders" ? "My Orders" : "My Cart"}
            </h3>
            <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
              {activeTab === "orders" ? "Your full order history" : "Items saved in your cart"}
            </p>
          </div>
        </div>

        <div style={{ padding: "1rem 1.25rem" }}>
          {activeTab === "orders" ? <Ordered /> : <Cart />}
        </div>
      </motion.div>

    </div>
  );
}

/* ── Icons ── */
function BagIcon({ color = "currentColor", size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  );
}

function CartIcon({ color = "currentColor", size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.61L23 6H6"/>
    </svg>
  );
}