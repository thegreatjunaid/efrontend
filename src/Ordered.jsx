import { useEffect, useState } from "react";
import axios from "axios";

export default function Ordered() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/orders/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Fetched Orders:", res.data); // check data
        setOrders(res.data);
      } catch (err) {
        console.log("Error loading orders:", err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchOrders();
  }, [token]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Ordered Products</h1>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">You haven't placed any orders yet.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow-md rounded-lg p-5 mb-6"
          >
            <div className="flex justify-between items-center mb-4">
              <p className="font-semibold">
                Order ID: {order._id.slice(-6).toUpperCase()}
              </p>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium
                ${
                  order.status === "Delivered"
                    ? "bg-green-100 text-green-700"
                    : order.status === "Shipped"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {order.status || "Pending"}
              </span>
            </div>

            {/* Map items */}
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 border-b pb-3"
                >
                  <img
                    src={`http://localhost:5000${item.image}`}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />

                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{item.name}</h3>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                  </div>

                  <p className="font-semibold text-blue-600">${item.price}</p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}