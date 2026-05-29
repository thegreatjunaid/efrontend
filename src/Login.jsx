import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Login({ switchPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: "", type: "" });

    try {
      const res = await axios.post("http://localhost:5000/login", { email, password });

      if (res.data.success) {
        setMsg({ text: "Login successful! Redirecting…", type: "success" });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);
        setTimeout(() => navigate("/"), 1200);
      } else {
        setMsg({ text: "Invalid email or password.", type: "error" });
      }
    } catch {
      setMsg({ text: "Server error or wrong credentials.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0a1628 0%, #0d2150 55%, #1a3a6e 100%)" }}>

      {/* Background orbs */}
      <div className="absolute rounded-full pointer-events-none"
        style={{ width: 320, height: 320, background: "#C9A227", opacity: 0.1, top: -100, right: -80 }} />
      <div className="absolute rounded-full pointer-events-none"
        style={{ width: 200, height: 200, background: "#3a7bd5", opacity: 0.1, bottom: -60, left: -50 }} />

      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "0.5px solid rgba(201,162,39,0.35)",
          borderRadius: 20,
          padding: "2.5rem 2rem",
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex items-center justify-center rounded-xl"
            style={{ width: 38, height: 38, background: "linear-gradient(135deg, #C9A227, #e8c84a)" }}>
            <ShoppingBagIcon />
          </div>
          <span style={{ fontSize: 17, fontWeight: 500, color: "#e8c84a", letterSpacing: "0.02em" }}>
            Junaid Store
          </span>
        </div>

        <h2 className="text-center mb-1" style={{ fontSize: 22, fontWeight: 500, color: "#fff" }}>
          Welcome back
        </h2>
        <p className="text-center mb-8" style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
          Sign in to your account
        </p>

        {/* Message */}
        <AnimatePresence>
          {msg.text && (
            <motion.div
              key={msg.text}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 rounded-lg mb-4"
              style={{
                padding: "9px 14px",
                fontSize: 13,
                ...(msg.type === "error"
                  ? { background: "rgba(226,75,74,0.12)", border: "0.5px solid rgba(226,75,74,0.35)", color: "#f09595" }
                  : { background: "rgba(29,158,117,0.12)", border: "0.5px solid rgba(29,158,117,0.35)", color: "#5DCAA5" }),
              }}
            >
              {msg.type === "error" ? <AlertIcon /> : <CheckCircleIcon />}
              {msg.text}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleLogin} className="space-y-0">
          {/* Email */}
          <div className="mb-5">
            <label style={labelStyle}>Email</label>
            <div className="relative">
              <span style={iconWrapStyle}><MailIcon /></span>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#C9A227")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.18)")}
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-2">
            <label style={labelStyle}>Password</label>
            <div className="relative">
              <span style={iconWrapStyle}><LockIcon /></span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ ...inputStyle, paddingRight: 42 }}
                onFocus={(e) => (e.target.style.borderColor = "#C9A227")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.18)")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", padding: 0, display: "flex" }}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <div className="text-right mb-6">
            <span style={{ fontSize: 12, color: "rgba(201,162,39,0.75)", cursor: "pointer" }}
              className="hover:text-yellow-400 transition-colors">
              Forgot password?
            </span>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ opacity: 0.9, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 mb-5"
            style={{
              padding: "13px",
              background: "linear-gradient(135deg, #B8891E, #e8c84a)",
              border: "none",
              borderRadius: 11,
              color: "#0a1628",
              fontSize: 15,
              fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.5 : 1,
            }}
          >
            {loading ? (
              <>
                <LoaderIcon /> Signing in…
              </>
            ) : (
              <>
                <LoginIcon /> Sign in
              </>
            )}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div style={{ flex: 1, height: 0.5, background: "rgba(255,255,255,0.12)" }} />
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>or continue with</span>
          <div style={{ flex: 1, height: 0.5, background: "rgba(255,255,255,0.12)" }} />
        </div>

        {/* Google */}
        <motion.button
  onClick={() => window.location.href = "http://localhost:5000/auth/google"}
  whileHover={{ background: "rgba(255,255,255,0.1)" }}
  whileTap={{ scale: 0.98 }}
  className="w-full flex items-center justify-center gap-2 mb-6"
  style={{
    padding: "11px",
    background: "rgba(255,255,255,0.06)",
    border: "0.5px solid rgba(255,255,255,0.18)",
    borderRadius: 11,
    color: "#fff",
    fontSize: 14,
    cursor: "pointer",
  }}
>
  <GoogleIcon />
  Continue with Google
</motion.button>

        {/* Register link */}
        <p className="text-center" style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
          Don't have an account?{" "}
          <span
            onClick={switchPage}
            style={{ color: "#e8c84a", cursor: "pointer" }}
            className="hover:underline"
          >
            <Link to="/register" className="btn btn-register">Register</Link>
          </span>
        </p>
      </motion.div>
    </div>
  );
}

/* ── Inline SVG icons ─────────────────────────── */
const s = { width: 17, height: 17, stroke: "rgba(255,255,255,0.3)", fill: "none", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };

const MailIcon = () => (
  <svg {...s} viewBox="0 0 24 24">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const LockIcon = () => (
  <svg {...s} viewBox="0 0 24 24">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);
const EyeIcon = () => (
  <svg {...s} viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOffIcon = () => (
  <svg {...s} viewBox="0 0 24 24">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const ShoppingBagIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0a1628" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);
const AlertIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f09595" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const CheckCircleIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#5DCAA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const LoginIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0a1628" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
  </svg>
);
const LoaderIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0a1628" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{animation:"spin 1s linear infinite"}}>
    <path d="M21 12a9 9 0 11-6.219-8.56"/>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </svg>
);
const GoogleIcon = () => (
  <svg width="17" height="17" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.8 2.4 30.3 0 24 0 14.8 0 6.9 5.4 3 13.3l7.8 6C12.7 13.2 17.9 9.5 24 9.5z"/>
    <path fill="#34A853" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.4c-.5 2.8-2.1 5.2-4.5 6.8l7 5.4C43.1 36.8 46.1 31 46.1 24.5z"/>
    <path fill="#FBBC04" d="M10.8 28.7A14.8 14.8 0 019.5 24c0-1.6.3-3.2.8-4.7L2.5 13.3A23.9 23.9 0 000 24c0 3.8.9 7.4 2.5 10.6l8.3-5.9z"/>
    <path fill="#4285F4" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7-5.4c-2.2 1.5-5 2.4-8.9 2.4-6.1 0-11.3-3.7-13.2-9.1l-8.3 5.9C6.9 42.6 14.8 48 24 48z"/>
  </svg>
);

/* ── Shared style objects ─────────────────────── */
const labelStyle = {
  display: "block",
  fontSize: 11,
  color: "rgba(201,162,39,0.85)",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  fontWeight: 500,
  marginBottom: 6,
};

const inputStyle = {
  width: "100%",
  padding: "11px 14px 11px 42px",
  background: "rgba(255,255,255,0.06)",
  border: "0.5px solid rgba(255,255,255,0.18)",
  borderRadius: 10,
  color: "#fff",
  fontSize: 14,
  outline: "none",
  transition: "border-color 0.2s",
};

const iconWrapStyle = {
  position: "absolute",
  left: 14,
  top: "50%",
  transform: "translateY(-50%)",
  display: "flex",
  alignItems: "center",
  pointerEvents: "none",
};