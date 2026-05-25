import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function Checkout() {

  const location = useLocation();
  const navigate = useNavigate();

  const selectedItems = location.state?.selectedItems || [];

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(
      "http://localhost:5000/api/order",
      {
        ...formData,
        items: selectedItems
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert("Order placed successfully!");
    navigate("/orders");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">

      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-xl">

        <h2 className="text-2xl font-bold mb-6">Checkout</h2>

        {/* Selected Products */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Selected Items</h3>

          {selectedItems.map((item) => (
            <div
              key={item._id}
              className="flex justify-between border-b py-2"
            >
              <p>{item.name}</p>
              <p>${item.price * item.quantity}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
            className="w-full border p-3 rounded"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
            required
            className="w-full border p-3 rounded"
          />

          <textarea
            name="address"
            placeholder="Address"
            rows="3"
            onChange={handleChange}
            required
            className="w-full border p-3 rounded"
          />

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
            Place Order
          </button>

        </form>

      </div>

    </div>
  );
}