import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userId = params.get("userId");

    if (token) {
      localStorage.setItem("token", token);
      if (userId) localStorage.setItem("userId", userId);
      navigate("/", { replace: true });
    }
    // ← removed the else block, no redirect if no token
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #0a1628 0%, #0d2150 55%, #1a3a6e 100%)",
      color: "#e8c84a",
      fontSize: 16,
      gap: 12
    }}>
      <LoaderIcon /> Signing you in...
    </div>
  );
}

const LoaderIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="#e8c84a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ animation: "spin 1s linear infinite" }}>
    <path d="M21 12a9 9 0 11-6.219-8.56"/>
    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
  </svg>
);