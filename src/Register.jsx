import React, { useState } from "react";
import axios from "axios";

export default function Register({ switchPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [msg, setMsg] = useState("");

  // 🔹 Register + send OTP
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://backend-4g4m.onrender.com/api/register",
        { email, password }
      );

      setMsg(res.data.message);
      setShowOtp(true); // show otp box
    } catch (err) {
      setMsg(err.response?.data?.message || "Registration failed");
    }
  };

  // 🔹 Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://backend-4g4m.onrender.com/api/verify-otp",
        { email, otp }
      );

      setMsg(res.data.message);

      if (res.data.success) {
        alert("Email verified. Now login.");
        switchPage(); // go to login
      }
    } catch (err) {
      setMsg("OTP verification failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <form
        className="bg-white p-8 rounded-2xl shadow-md w-96"
        onSubmit={showOtp ? handleVerifyOtp : handleRegister}
      >

        <h2 className="text-2xl font-semibold text-center mb-6">
          {showOtp ? "Verify OTP" : "Register"}
        </h2>

        {!showOtp && (
          <>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded mb-4"
              onChange={(e)=>setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border rounded mb-4"
              onChange={(e)=>setPassword(e.target.value)}
            />
          </>
        )}

        {showOtp && (
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full p-3 border rounded mb-4"
            onChange={(e)=>setOtp(e.target.value)}
          />
        )}

        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mb-4">
          {showOtp ? "Verify OTP" : "Register"}
        </button>

        <p
          className="text-center text-blue-600 cursor-pointer"
          onClick={switchPage}
        >
          Back to Login
        </p>

        {msg && (
          <p className="mt-3 text-center text-red-600">
            {msg}
          </p>
        )}

      </form>
    </div>
  );
}
