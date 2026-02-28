import { useState } from "react";
import axios from "axios";

export default function Checkout() {

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: ""
  });


  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    await axios.post(
      "https://backend-4g4m.onrender.com/api/order",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert("Order placed successfully!");
  };
  

 return (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
    
    <div className="bg-white shadow-xl rounded-2xl w-full max-w-xl p-8">
      
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Checkout
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Name */}
        <div>
          <label className="block text-gray-600 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-gray-600 mb-1">
            Phone Number
          </label>
          <input
            type="text"
            name="phone"
            placeholder="Enter your phone number"
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-gray-600 mb-1">
            Delivery Address
          </label>
          <textarea
            name="address"
            placeholder="Enter full delivery address"
            onChange={handleChange}
            required
            rows="4"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition duration-300"
        >
          Place Order
        </button>

      </form>

    </div>
  </div>
);}