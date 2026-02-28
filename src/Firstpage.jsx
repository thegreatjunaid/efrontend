import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import Home from "./Home";
export default function Firstpage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header/>
    
  
      <main className="flex-grow p-4">
      
        <Outlet />   {/* pages like Home.jsx will appear here */}
      </main>

   
    </div>
  );
}
