import { useState, useEffect } from "react";
import axios from "axios";

export default function Register({ switchPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [msg, setMsg] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // OTP countdown timer
  useEffect(() => {
    if (!showOtp || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [showOtp, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Register and send OTP
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("https://backend-4g4m.onrender.com/api/register", {
        email,
        password,
      });

      setMsg(res.data.message);
      setShowOtp(true);
      setTimeLeft(res.data.otpValidity || 180);
    } catch (err) {
      setMsg(err.response?.data?.message || "Registration failed");
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (timeLeft <= 0) {
      setMsg("OTP expired. Please resend OTP.");
      return;
    }

    try {
      const res = await axios.post("https://backend-4g4m.onrender.com/api/verify-otp", {
        email,
        otp,
      });

      if (res.data.success) {
        setSuccessModal(true);
        setMsg("");

        // redirect to home after 2 seconds
        setTimeout(() => {
          window.location.href = "/home";
        }, 2000);
      } else {
        setMsg(res.data.message || "OTP verification failed");
      }
    } catch (err) {
      setMsg("OTP verification failed");
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    try {
      const res = await axios.post("https://backend-4g4m.onrender.com/api/resend-otp", {
        email,
      });

      setMsg(res.data.message);
      setTimeLeft(res.data.otpValidity || 180);
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 relative">
      <form
        className="bg-white p-8 rounded-2xl shadow-md w-96 relative z-10"
        onSubmit={showOtp ? handleVerifyOtp : handleRegister}
      >
        <h2 className="text-2xl font-semibold text-center mb-6">
          {showOtp ? "Verify OTP" : "Register in Junaid Store"}
        </h2>

        {!showOtp && (
          <>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded mb-4"
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border rounded mb-4"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </>
        )}

        {showOtp && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full p-3 border rounded mb-2"
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            {timeLeft > 0 ? (
              <p className="text-center text-gray-700 mb-4">
                OTP expires in {formatTime(timeLeft)}
              </p>
            ) : (
              <div className="text-center mb-4">
                <p className="text-red-600 mb-2">OTP expired.</p>

                <button
                  type="button"
                  className="text-blue-600 underline"
                  onClick={handleResendOtp}
                >
                  Resend OTP
                </button>
              </div>
            )}
          </>
        )}

        <button
          type="submit"
          disabled={showOtp && timeLeft <= 0}
          className={`w-full py-2 rounded mb-4 text-white ${
            showOtp && timeLeft <= 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {showOtp ? "Verify OTP" : "Register"}
        </button>

        <p
          className="text-center text-blue-600 cursor-pointer"
          onClick={switchPage}
        >
          Back to Login
        </p>

        {msg && !successModal && (
          <p className="mt-3 text-center text-red-600">{msg}</p>
        )}
      </form>

      {/* Success Modal */}
      {successModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-80 text-center animate-scale-up">
            <div className="mx-auto mb-4 w-16 h-16 flex justify-center items-center rounded-full bg-green-100">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h3 className="text-2xl font-semibold text-green-600 mb-2">
              Account Verified ✅
            </h3>

            <p className="mb-6 text-gray-700">
              Welcome to Junaid Store! Redirecting to Home...
            </p>
          </div>
        </div>
      )}

      {/* animation */}
      <style>
        {`
        @keyframes scale-up {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        .animate-scale-up {
          animation: scale-up 0.3s ease-out forwards;
        }
        `}
      </style>
    </div>
  );
}