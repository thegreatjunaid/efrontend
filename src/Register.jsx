import { useState, useEffect } from "react";
import axios from "axios";

export default function Register({ switchPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [successModal, setSuccessModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    if (!showOtp || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(timer);
  }, [showOtp, timeLeft]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    return `${m}:${(s % 60).toString().padStart(2, "0")}`;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: "", type: "" });
    try {
      const res = await axios.post("http://localhost:5000/api/register", { email, password });
      setMsg({ text: res.data.message, type: "success" });
      setShowOtp(true);
      setTimeLeft(res.data.otpValidity || 180);
    } catch (err) {
      setMsg({ text: err.response?.data?.message || "Registration failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (timeLeft <= 0) {
      setMsg({ text: "OTP expired. Please resend.", type: "error" });
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/verify-otp", { email, otp });
      if (res.data.success) {
        setSuccessModal(true);
        setMsg({ text: "", type: "" });
        setTimeout(() => { window.location.href = "/home"; }, 2000);
      } else {
        setMsg({ text: res.data.message || "OTP verification failed", type: "error" });
      }
    } catch {
      setMsg({ text: "OTP verification failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/resend-otp", { email });
      setMsg({ text: res.data.message, type: "success" });
      setTimeLeft(res.data.otpValidity || 180);
    } catch (err) {
      setMsg({ text: err.response?.data?.message || "Failed to resend OTP", type: "error" });
    }
  };

  return (
    <div style={styles.page}>
      {/* Background orbs */}
      <div style={{ ...styles.orb, width: 300, height: 300, background: "#C9A227", top: -80, right: -60, opacity: 0.12 }} />
      <div style={{ ...styles.orb, width: 200, height: 200, background: "#3a7bd5", bottom: -60, left: -40, opacity: 0.12 }} />

      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoRow}>
          <div style={styles.logoIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0a1628" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </div>
          <span style={styles.logoText}>Junaid Store</span>
        </div>

        {/* Step dots */}
        <div style={styles.dotsRow}>
          <div style={{ ...styles.dot, ...(showOtp ? styles.dotInactive : styles.dotActive) }} />
          <div style={{ ...styles.dot, ...(showOtp ? styles.dotActive : styles.dotInactive) }} />
        </div>

        <form onSubmit={showOtp ? handleVerifyOtp : handleRegister}>
          <h2 style={styles.title}>{showOtp ? "Verify your email" : "Create account"}</h2>
          <p style={styles.subtitle}>
            {showOtp ? `Code sent to ${email}` : "Join us and start shopping"}
          </p>

          {/* Message */}
          {msg.text && !successModal && (
            <div style={msg.type === "error" ? styles.msgError : styles.msgSuccess}>
              {msg.text}
            </div>
          )}

          {!showOtp && (
            <>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Email</label>
                <div style={styles.fieldWrap}>
                  <MailIcon />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    style={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Password</label>
                <div style={styles.fieldWrap}>
                  <LockIcon />
                  <input
                    type="password"
                    placeholder="Min. 8 characters"
                    style={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </>
          )}

          {showOtp && (
            <>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>One-time code</label>
                <input
                  type="text"
                  placeholder="— — — — — —"
                  maxLength={6}
                  style={{ ...styles.input, textAlign: "center", letterSpacing: "0.3em", fontSize: 20, padding: "11px 14px" }}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>

              <div style={styles.timerRow}>
                <div style={styles.timerBadge}>
                  <ClockIcon />
                  <span>{timeLeft > 0 ? formatTime(timeLeft) : "Expired"}</span>
                </div>
                {timeLeft <= 0 ? (
                  <button type="button" style={styles.resendBtn} onClick={handleResendOtp}>
                    Resend code
                  </button>
                ) : (
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>Resend available after expiry</span>
                )}
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading || (showOtp && timeLeft <= 0)}
            style={{
              ...styles.submitBtn,
              opacity: (loading || (showOtp && timeLeft <= 0)) ? 0.45 : 1,
              cursor: (loading || (showOtp && timeLeft <= 0)) ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Please wait…" : showOtp ? "Verify & continue" : "Send OTP"}
          </button>

          {showOtp ? (
            <p style={styles.backLink}>
              <span style={styles.linkAccent} onClick={() => { setShowOtp(false); setMsg({ text: "", type: "" }); }}>
                ← Back
              </span>
            </p>
          ) : (
            <p style={styles.backLink}>
              Already have an account?{" "}
              <span style={styles.linkAccent} onClick={switchPage}>Sign in</span>
            </p>
          )}
        </form>

        {/* Success overlay */}
        {successModal && (
          <div style={styles.successOverlay}>
            <div style={styles.successCircle}>
              <CheckIcon />
            </div>
            <p style={styles.successTitle}>Account verified!</p>
            <p style={styles.successSub}>Redirecting to your store…</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scaleUp {
          from { transform: scale(0.6); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        input:focus { outline: none; border-color: #C9A227 !important; }
        input::placeholder { color: rgba(255,255,255,0.3); }
      `}</style>
    </div>
  );
}

// --- Inline SVG icons ---
const MailIcon = () => (
  <svg style={iconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);
const LockIcon = () => (
  <svg style={iconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e8c84a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5DCAA5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const iconStyle = { position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 17, height: 17, color: "rgba(255,255,255,0.3)", pointerEvents: "none" };

// --- Styles ---
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0a1628 0%, #0d2150 55%, #1a3a6e 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem 1rem",
    position: "relative",
    overflow: "hidden",
  },
  orb: {
    position: "absolute",
    borderRadius: "50%",
  },
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "0.5px solid rgba(201,162,39,0.35)",
    borderRadius: 20,
    padding: "2.5rem 2rem",
    width: "100%",
    maxWidth: 400,
    position: "relative",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: "1.75rem",
  },
  logoIcon: {
    width: 38,
    height: 38,
    background: "linear-gradient(135deg, #C9A227, #e8c84a)",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 17,
    fontWeight: 500,
    color: "#e8c84a",
    letterSpacing: "0.02em",
  },
  dotsRow: {
    display: "flex",
    justifyContent: "center",
    gap: 6,
    marginBottom: "2rem",
  },
  dot: {
    height: 6,
    borderRadius: 3,
    transition: "all 0.3s",
  },
  dotActive: { background: "#C9A227", width: 20 },
  dotInactive: { background: "rgba(255,255,255,0.2)", width: 6, borderRadius: "50%" },
  title: {
    fontSize: 22,
    fontWeight: 500,
    color: "#fff",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.45)",
    textAlign: "center",
    marginBottom: "2rem",
  },
  msgError: {
    background: "rgba(226,75,74,0.12)",
    border: "0.5px solid rgba(226,75,74,0.35)",
    borderRadius: 8,
    padding: "9px 14px",
    fontSize: 13,
    color: "#f09595",
    marginBottom: "1rem",
  },
  msgSuccess: {
    background: "rgba(29,158,117,0.12)",
    border: "0.5px solid rgba(29,158,117,0.35)",
    borderRadius: 8,
    padding: "9px 14px",
    fontSize: 13,
    color: "#5DCAA5",
    marginBottom: "1rem",
  },
  fieldGroup: { marginBottom: "1.25rem" },
  label: {
    display: "block",
    fontSize: 12,
    color: "rgba(201,162,39,0.9)",
    marginBottom: 6,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    fontWeight: 500,
  },
  fieldWrap: { position: "relative" },
  input: {
    width: "100%",
    padding: "11px 14px 11px 42px",
    background: "rgba(255,255,255,0.06)",
    border: "0.5px solid rgba(255,255,255,0.18)",
    borderRadius: 10,
    color: "#fff",
    fontSize: 14,
  },
  timerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1.5rem",
  },
  timerBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "rgba(201,162,39,0.12)",
    border: "0.5px solid rgba(201,162,39,0.35)",
    borderRadius: 20,
    padding: "5px 12px",
    fontSize: 13,
    color: "#e8c84a",
  },
  resendBtn: {
    background: "none",
    border: "none",
    color: "#e8c84a",
    fontSize: 13,
    cursor: "pointer",
  },
  submitBtn: {
    width: "100%",
    padding: 13,
    background: "linear-gradient(135deg, #B8891E, #e8c84a)",
    border: "none",
    borderRadius: 11,
    color: "#0a1628",
    fontSize: 15,
    fontWeight: 500,
    marginBottom: "1.25rem",
  },
  backLink: {
    textAlign: "center",
    fontSize: 13,
    color: "rgba(255,255,255,0.4)",
  },
  linkAccent: {
    color: "#e8c84a",
    cursor: "pointer",
  },
  successOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(10,22,40,0.9)",
    borderRadius: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    animation: "scaleUp 0.3s ease-out",
  },
  successCircle: {
    width: 64,
    height: 64,
    borderRadius: "50%",
    background: "rgba(29,158,117,0.2)",
    border: "1.5px solid #1D9E75",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  successTitle: { fontSize: 18, fontWeight: 500, color: "#fff" },
  successSub: { fontSize: 13, color: "rgba(255,255,255,0.5)" },
};