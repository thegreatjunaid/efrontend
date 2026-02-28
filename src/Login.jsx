import React, { useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboard";
import Header from "./Header";
import Home from "./Home";
import Footer from "./Footer";
import Firstpage from "./Firstpage";
import { useNavigate } from "react-router-dom";

export default function Login({ switchPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
   const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("https://backend-4g4m.onrender.com/login", {
        email,
        password,
      });

      // if (res.data.success) {
      //   setMsg("Login Successful!");
      //   setLoggedIn(true); // ✅ switch to dashboard
      // }
      if (res.data.success) {
     setMsg("Login Successful!");

  // 🔥 THIS TELLS HEADER USER IS LOGGED IN
         localStorage.setItem("token", res.data.token);
         localStorage.setItem("userId", res.data.userId);

  // 🔥 reload so header updates
     
         navigate("/home ");
      }

      
      else {
        setMsg("Invalid email or password");
      }
    } catch (err) {
      setMsg("Server error or wrong credentials");
    }
  };

  // If logged in → show dashboard

  if (loggedIn) {
    return (
    <>
 
      
      
      
    </>
  );
}
  

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <form className="p-6 border rounded w-80 bg-white" onSubmit={handleLogin}>
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-gray-800 text-white p-2 mb-3">
          Login
        </button>

        <p
          className="text-sm text-blue-600 cursor-pointer text-center"
          onClick={switchPage}
        >
          Go to Register
        </p>

        {msg && <p className="text-center text-red-600 mt-2">{msg}</p>}
      </form>
    </div>
  );
}
