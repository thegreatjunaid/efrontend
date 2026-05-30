// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const AdminPanel = () => {
//   // 🔹 Products state
//   const [products, setProducts] = useState([]);
//   const [name, setName] = useState("");
//   const [price, setPrice] = useState("");
//   const [description, setDescription] = useState("");
//   const [image, setImage] = useState(null);

//   // 🔹 Orders state
//   const [orders, setOrders] = useState([]);

//   // 🔹 Fetch all products
//   const fetchProducts = async () => {
//     try {
//       const res = await axios.get("https://backend-4g4m.onrender.com/api/products");
//       setProducts(res.data);
//     } catch (err) {
//       console.error("Error fetching products:", err);
//     }
//   };

//   // 🔹 Fetch all orders
//   const fetchOrders = async () => {
//     try {
//       const res = await axios.get("https://backend-4g4m.onrender.com/api/orders");
//       setOrders(res.data);
//     } catch (err) {
//       console.error("Error fetching orders:", err);
//     }
//   };

//   // 🔹 Initial load
//   useEffect(() => {
//     fetchProducts();
//     fetchOrders();
//   }, []);

//   // 🔹 Add product
//   const handleAddProduct = async (e) => {
//     e.preventDefault();
//     if (!name || !price) return alert("Name and price are required");

//     try {
//       const formData = new FormData();
//       formData.append("name", name);
//       formData.append("price", price);
//       formData.append("description", description);
//       if (image) formData.append("image", image);

//       await axios.post("https://backend-4g4m.onrender.com/api/products", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       setName("");
//       setPrice("");
//       setDescription("");
//       setImage(null);
//       fetchProducts();
//     } catch (err) {
//       console.error("Error adding product:", err);
//     }
//   };

//   // 🔹 Delete product
//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`https://backend-4g4m.onrender.com/api/products/${id}`);
//       fetchProducts();
//     } catch (err) {
//       console.error("Error deleting product:", err);
//     }
//   };

//   // 🔹 Change order status
//   const handleChangeStatus = async (orderId) => {
//     try {
//       const res = await axios.put(`https://backend-4g4m.onrender.com/api/orders/${orderId}/status`);
//       console.log("Order status updated:", res.data);

//       // Update orders state
//       setOrders((prev) =>
//         prev.map((o) => (o._id === orderId ? { ...o, status: res.data.status } : o))
//       );
//     } catch (err) {
//       console.error("Error updating order status:", err);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h1 className="text-3xl font-bold text-center mb-6">Admin Panel</h1>

//       {/* ➕ Add Product Form */}
//       <form
//         onSubmit={handleAddProduct}
//         className="bg-white p-6 rounded shadow mb-10 max-w-xl mx-auto"
//       >
//         <h2 className="text-xl font-semibold mb-4">Add New Product</h2>

//         <input
//           type="text"
//           placeholder="Product Name"
//           className="w-full p-2 border mb-3"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />
//         <input
//           type="number"
//           placeholder="Price"
//           className="w-full p-2 border mb-3"
//           value={price}
//           onChange={(e) => setPrice(e.target.value)}
//         />
//         <input
//           type="file"
//           accept="image/*"
//           className="w-full p-2 border mb-3"
//           onChange={(e) => setImage(e.target.files[0])}
//         />
//         <textarea
//           placeholder="Description"
//           className="w-full p-2 border mb-3"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//         />

//         <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
//           Add Product
//         </button>
//       </form>

//       {/* 📦 Product List */}
//       <div className="max-w-6xl mx-auto">
//         <h2 className="text-2xl font-semibold mb-4">All Products</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {products.map((product) => (
//             <div key={product._id} className="bg-white p-4 rounded shadow">
//               <img
//                 src={`https://backend-4g4m.onrender.com${product.image}`}
//                 alt={product.name}
//                 className="w-full h-40 object-cover mb-3 rounded"
//               />
//               <h3 className="font-bold">{product.name}</h3>
//               <p className="text-gray-600">৳ {product.price}</p>
//               <p className="text-sm text-gray-500 mb-3">{product.description}</p>
//               <button
//                 onClick={() => handleDelete(product._id)}
//                 className="w-full bg-red-600 text-white py-1 rounded hover:bg-red-700"
//               >
//                 Delete
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* 🛒 Orders List */}
//       <div className="max-w-6xl mx-auto mt-12">
//         <h2 className="text-2xl font-semibold mb-4">All Orders</h2>
//         {orders.length === 0 ? (
//           <p className="text-gray-500">No orders yet.</p>
//         ) : (
//           <div className="space-y-4">
//             {orders.map((order) => (
//               <div key={order._id} className="bg-white p-4 rounded shadow">
//                 <div className="flex justify-between mb-2">
//                   <span className="font-medium">Order ID:</span>
//                   <span>{order._id}</span>
//                 </div>
//                 <div className="flex justify-between mb-2">
//                   <span className="font-medium">User ID:</span>
//                   <span>{order.userId}</span>
//                 </div>
//                 <div className="flex justify-between mb-2">
//                   <span className="font-medium">Total Amount:</span>
//                   <span>৳ {order.totalAmount}</span>
//                 </div>
//                 <div className="flex justify-between mb-2">
//                   <span className="font-medium">Status:</span>
//                   <span>{order.status}</span>
//                 </div>

//                 {/* Change Status Button */}
//                 {order.status === "Pending" && (
//                   <button
//                     onClick={() => handleChangeStatus(order._id)}
//                     className="mt-2 bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700"
//                   >
//                     Mark as Delivered
//                   </button>
//                 )}

//                 <div className="mb-2">
//                   <span className="font-medium">Items:</span>
//                   <ul className="list-disc list-inside">
//                     {order.items.map((item) => (
//                       <li key={item.productId}>
//                         {item.name} x {item.quantity} - ৳ {item.price}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="font-medium">Phone:</span>
//                   <span>{order.phone}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="font-medium">Address:</span>
//                   <span>{order.address}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminPanel;




import React, { useEffect, useState } from "react";
import axios from "axios";

 const API = "https://backend-4g4m.onrender.com";

const AdminPanel = () => {
  // ================================
  // PRODUCT STATES
  // ================================
  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [image, setImage] = useState(null);

  // ================================
  // ORDER STATES
  // ================================
  const [orders, setOrders] = useState([]);

  // ================================
  // FETCH PRODUCTS
  // ================================
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/api/products`);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // ================================
  // FETCH ORDERS
  // ================================
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API}/api/orders`);
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  // ================================
  // INITIAL LOAD
  // ================================
  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  // ================================
  // ADD PRODUCT
  // ================================
  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!name || !price || !category || !type) {
      return alert("Please fill all required fields");
    }

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("type", type);

      if (image) {
        formData.append("image", image);
      }

      await axios.post(`${API}/api/products`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // RESET FORM
      setName("");
      setPrice("");
      setDescription("");
      setCategory("");
      setType("");
      setImage(null);

      fetchProducts();

      alert("Product Added Successfully");
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  // ================================
  // DELETE PRODUCT
  // ================================
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  // ================================
  // CHANGE ORDER STATUS
  // ================================
  const handleChangeStatus = async (orderId) => {
    try {
      const res = await axios.put(
        `${API}/api/orders/${orderId}/status`
      );

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId
            ? { ...o, status: res.data.status }
            : o
        )
      );
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* ================================
          HEADER
      ================================= */}
      <h1 className="text-4xl font-bold text-center mb-10">
        Admin Panel
      </h1>

      {/* ================================
          ADD PRODUCT FORM
      ================================= */}
      <form
        onSubmit={handleAddProduct}
        className="bg-white p-6 rounded-xl shadow max-w-2xl mx-auto mb-14"
      >
        <h2 className="text-2xl font-semibold mb-6">
          Add New Product
        </h2>

        {/* PRODUCT NAME */}
        <input
          type="text"
          placeholder="Product Name"
          className="w-full p-3 border rounded mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* PRICE */}
        <input
          type="number"
          placeholder="Price"
          className="w-full p-3 border rounded mb-4"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        {/* CATEGORY */}
        <select
          className="w-full p-3 border rounded mb-4"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>

          <option value="Men">Men</option>
          <option value="Women">Women</option>
        </select>

        {/* TYPE */}
        <select
          className="w-full p-3 border rounded mb-4"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">Select Product Type</option>

          {/* MEN */}
          <option value="shirt">Shirt</option>
          <option value="pant">Pant</option>
          <option value="t-shirt">T-Shirt</option>
          <option value="hoodie">Hoodie</option>
          <option value="jacket">Jacket</option>

          {/* WOMEN */}
          <option value="saree">Saree</option>
          <option value="three-piece">Three Piece</option>
          <option value="kurti">Kurti</option>
          <option value="lehenga">Lehenga</option>

          {/* BOTH */}
          <option value="shoes">Shoes</option>
          <option value="bags">Bags</option>
          <option value="accessories">Accessories</option>
        </select>

        {/* IMAGE */}
        <input
          type="file"
          accept="image/*"
          className="w-full p-3 border rounded mb-4"
          onChange={(e) => setImage(e.target.files[0])}
        />

        {/* DESCRIPTION */}
        <textarea
          placeholder="Description"
          className="w-full p-3 border rounded mb-4"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* SUBMIT BUTTON */}
        <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition">
          Add Product
        </button>
      </form>

      {/* ================================
          PRODUCT LIST
      ================================= */}
      <div className="max-w-7xl mx-auto">

        <h2 className="text-3xl font-semibold mb-8">
          All Products
        </h2>

        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow overflow-hidden"
              >
                {/* IMAGE */}
                <img
                  src={`${API}${product.image}`}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />

                <div className="p-4">

                  {/* NAME */}
                  <h3 className="text-lg font-bold mb-1">
                    {product.name}
                  </h3>

                  {/* PRICE */}
                  <p className="text-gray-700 font-medium mb-1">
                    ৳ {product.price}
                  </p>

                  {/* CATEGORY + TYPE */}
                  <p className="text-sm text-gray-500 mb-2">
                    {product.category} • {product.type}
                  </p>

                  {/* DESCRIPTION */}
                  <p className="text-sm text-gray-600 mb-4">
                    {product.description}
                  </p>

                  {/* DELETE BUTTON */}
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Delete Product
                  </button>
                </div>
              </div>
            ))}

          </div>
        )}
      </div>

      {/* ================================
          ORDERS SECTION
      ================================= */}
      <div className="max-w-7xl mx-auto mt-16">

        <h2 className="text-3xl font-semibold mb-8">
          All Orders
        </h2>

        {orders.length === 0 ? (
          <p className="text-gray-500">No orders yet.</p>
        ) : (
          <div className="space-y-6">

            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white p-6 rounded-xl shadow"
              >

                {/* ORDER INFO */}
                <div className="grid md:grid-cols-2 gap-3 mb-4">

                  <div>
                    <span className="font-semibold">
                      Order ID:
                    </span>{" "}
                    {order._id}
                  </div>

                  <div>
                    <span className="font-semibold">
                      User ID:
                    </span>{" "}
                    {order.userId}
                  </div>

                  <div>
                    <span className="font-semibold">
                      Total:
                    </span>{" "}
                    ৳ {order.totalAmount}
                  </div>

                  <div>
                    <span className="font-semibold">
                      Status:
                    </span>{" "}
                    {order.status}
                  </div>

                  <div>
                    <span className="font-semibold">
                      Phone:
                    </span>{" "}
                    {order.phone}
                  </div>

                  <div>
                    <span className="font-semibold">
                      Address:
                    </span>{" "}
                    {order.address}
                  </div>
                </div>

                {/* ITEMS */}
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">
                    Ordered Items:
                  </h3>

                  <ul className="list-disc list-inside">
                    {order.items.map((item) => (
                      <li key={item.productId}>
                        {item.name} × {item.quantity} — ৳ {item.price}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* STATUS BUTTON */}
                {order.status === "Pending" && (
                  <button
                    onClick={() => handleChangeStatus(order._id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Mark as Delivered
                  </button>
                )}

              </div>
            ))}

          </div>
        )}
      </div>

    </div>
  );
};

export default AdminPanel;