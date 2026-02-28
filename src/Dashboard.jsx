import React from "react";

export default function Dashboard({ email }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-green-50">
      
      <h1 className="text-3xl font-bold mb-4">Welcome, {email}!</h1>
      <p className="text-lg text-gray-700 mb-6">
        You have successfully logged in.
      </p>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded"
        onClick={() => window.location.reload()}
      >
        Logout
      </button>
      
    </div>
  );
}
