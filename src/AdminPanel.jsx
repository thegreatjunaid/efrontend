import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPanel = () => {
  // 🔹 Products state
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  // 🔹 Orders state
  const [orders, setOrders] = useState([]);

  // 🔹 Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://backend-4g4m.onrender.com/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // 🔹 Fetch all orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get("https://backend-4g4m.onrender.com/api/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  // 🔹 Initial load
  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  // 🔹 Add product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!name || !price) return alert("Name and price are required");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);
      if (image) formData.append("image", image);

      await axios.post("https://backend-4g4m.onrender.com/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setName("");
      setPrice("");
      setDescription("");
      setImage(null);
      fetchProducts();
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  // 🔹 Delete product
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://backend-4g4m.onrender.com/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  // 🔹 Change order status
  const handleChangeStatus = async (orderId) => {
    try {
      const res = await axios.put(`https://backend-4g4m.onrender.com/api/orders/${orderId}/status`);
      console.log("Order status updated:", res.data);

      // Update orders state
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: res.data.status } : o))
      );
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Admin Panel</h1>

      {/* ➕ Add Product Form */}
      <form
        onSubmit={handleAddProduct}
        className="bg-white p-6 rounded shadow mb-10 max-w-xl mx-auto"
      >
        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>

        <input
          type="text"
          placeholder="Product Name"
          className="w-full p-2 border mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          className="w-full p-2 border mb-3"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          className="w-full p-2 border mb-3"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <textarea
          placeholder="Description"
          className="w-full p-2 border mb-3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Add Product
        </button>
      </form>

      {/* 📦 Product List */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">All Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white p-4 rounded shadow">
              <img
                src={`https://backend-4g4m.onrender.com${product.image}`}
                alt={product.name}
                className="w-full h-40 object-cover mb-3 rounded"
              />
              <h3 className="font-bold">{product.name}</h3>
              <p className="text-gray-600">৳ {product.price}</p>
              <p className="text-sm text-gray-500 mb-3">{product.description}</p>
              <button
                onClick={() => handleDelete(product._id)}
                className="w-full bg-red-600 text-white py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 🛒 Orders List */}
      <div className="max-w-6xl mx-auto mt-12">
        <h2 className="text-2xl font-semibold mb-4">All Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white p-4 rounded shadow">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Order ID:</span>
                  <span>{order._id}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">User ID:</span>
                  <span>{order.userId}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Total Amount:</span>
                  <span>৳ {order.totalAmount}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Status:</span>
                  <span>{order.status}</span>
                </div>

                {/* Change Status Button */}
                {order.status === "Pending" && (
                  <button
                    onClick={() => handleChangeStatus(order._id)}
                    className="mt-2 bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700"
                  >
                    Mark as Delivered
                  </button>
                )}

                <div className="mb-2">
                  <span className="font-medium">Items:</span>
                  <ul className="list-disc list-inside">
                    {order.items.map((item) => (
                      <li key={item.productId}>
                        {item.name} x {item.quantity} - ৳ {item.price}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Phone:</span>
                  <span>{order.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Address:</span>
                  <span>{order.address}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;