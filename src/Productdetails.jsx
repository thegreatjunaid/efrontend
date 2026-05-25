import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "./Footer";
import { useCart } from "./Cartcontext";

function Productdetails() {
  const [added, setAdded] = useState(false);
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
const { addToCart } = useCart();
const navigate = useNavigate();
  useEffect(() => {
    fetch(`http://localhost:5000/api/product/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="text-center py-20 text-2xl font-semibold">
        Loading Product...
      </div>
    );

  if (!product)
    return (
      <div className="text-center py-20 text-red-500 text-xl">
        Product Not Found
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">

      <div className="grid md:grid-cols-2 gap-12">

        {/* LEFT SIDE IMAGE */}
        <div>
          <img
            src={`http://localhost:5000${product.image}`}
            alt={product.name}
            className="w-full h-[450px] object-cover rounded-2xl shadow-lg"
          />

          {/* Small extra info */}
          <div className="mt-6 p-4 bg-gray-100 rounded-lg text-sm text-gray-600">
            <p>🚚 Free Delivery inside Dhaka</p>
            <p>🔄 7 Days Replacement Guarantee</p>
            <p>🔒 100% Secure Payment</p>
          </div>
        </div>

        {/* RIGHT SIDE DETAILS */}
        <div>

          <h1 className="text-4xl font-bold mb-4">
            {product.name}
          </h1>

          {/* Rating UI */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-yellow-400 text-xl">★★★★★</span>
            <span className="text-gray-600 text-sm">(4.8 Reviews)</span>
          </div>

          <p className="text-3xl text-blue-600 font-bold mb-4">
            ৳ {product.price}
          </p>

          {/* Stock Status */}
          <p className={`mb-4 font-medium ${
            product.stock > 0 ? "text-green-600" : "text-red-500"
          }`}>
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </p>

          {/* Description */}
          <p className="text-gray-700 leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-medium">Quantity:</span>
            <div className="flex items-center border rounded-lg">
              <button
                className="px-4 py-2 text-lg"
                onClick={() => qty > 1 && setQty(qty - 1)}
              >
                -
              </button>
              <span className="px-6">{qty}</span>
              <button
                className="px-4 py-2 text-lg"
                onClick={() => setQty(qty + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Category */}
          <div className="mb-6 text-gray-600">
            Category: <span className="font-medium">{product.category}</span>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            
      <button
 onClick={() => {

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    navigate("/login");
    return;
  }

  addToCart(product);

  setAdded(true);
  setTimeout(() => setAdded(false), 2000);
}}
  disabled={added}
  className={`
    relative overflow-hidden w-full py-3 rounded-xl text-lg font-semibold
    transition-all duration-500 ease-in-out
    ${
      added
        ? "bg-gradient-to-r from-green-500 to-emerald-600 scale-95 shadow-xl"
        : "bg-blue-600 hover:bg-blue-700 hover:scale-105"
    }
    text-white
  `}
>
  <span
    className={`
      flex items-center justify-center gap-2
      transition-all duration-500
      ${added ? "translate-x-0 opacity-100" : "translate-x-0 opacity-100"}
    `}
  >
    {added ? (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 animate-pulse"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="3"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Added Successfully
      </>
    ) : (
      "Add to Cart"
    )}
  </span>

  {/* Glow Effect */}
  {added && (
    <span className="absolute inset-0 rounded-xl bg-white opacity-20 animate-ping"></span>
  )}
</button>
            <button className="w-full border border-blue-600 text-blue-600 py-3 rounded-xl text-lg hover:bg-blue-50 transition">
              Buy Now
            </button>
          </div>

        </div>
      </div>

      {/* Extra Product Info Section */}
      <div className="mt-16 border-t pt-10">
        <h2 className="text-2xl font-bold mb-4">Product Details</h2>
        <p className="text-gray-700 leading-relaxed">
          This product is carefully selected for premium quality and durability.
          It is designed to give you the best experience and long-lasting performance.
          Perfect for everyday use and suitable for all age groups.
        </p>
      </div>

    
    </div>
  );
}

export default Productdetails;
