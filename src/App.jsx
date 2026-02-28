import React, { useState } from "react";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import Product from "./Product.jsx";
import Cart from "./Cart.jsx"
import AdminPanel from "./AdminPanel.jsx";
import Firstpage from "./Firstpage.jsx";
import Profile from "./Profile.jsx";
import Productdetails from "./Productdetails.jsx";
import Checkout from "./Checkout";
import SearchResult from "./SearchResult";
import { Toaster } from "react-hot-toast";

<Toaster position="top-right" />
// inside <Routes>

export default function App() {
  const [showLogin, setShowLogin] = useState(true);

  return (
  <Router>
  <Routes>

     {/* Layout Route */}
     <Route path="/" element={<Firstpage/>}>
        <Route path="home" element={<Home />} />
        <Route path="product" element={<Product />} />
        <Route path="cart" element={<Cart />} />
        <Route path="admin" element={<AdminPanel/>} />
        <Route path="profile" element={<Profile/>} />
          <Route path="pr" element={<Profile/>} />
       <Route path="/product/:id" element={<Productdetails />} />
       <Route path="/search/:keyword" element={<SearchResult />} />
       <Route path="/checkout" element={<Checkout />} />
     </Route>

     {/* Auth Pages */}
     <Route path="/login" element={<Login />} />
     <Route path="/register" element={<Register />} />

  </Routes>
</Router>


  );
}

