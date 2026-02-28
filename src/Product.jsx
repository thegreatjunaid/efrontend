import { useState, useEffect } from "react";
import { useCart } from "./Cartcontext";
import { useNavigate } from "react-router-dom";

export default function Product() {
 const [products, setProducts] = useState([]); // initially empty
  const [message, setMessage] = useState("");
  const { addToCart } = useCart();
  const navigate = useNavigate();

const goToProduct = (id) => {
  navigate(`/product/${id}`);
};

  // Fetch products from backend when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://backend-4g4m.onrender.com/api/products");
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        setProducts(data); // set products from DB
      } catch (err) {
        console.error(err);
        setMessage("Could not load products from server");
      }
    };

    fetchProducts();
  }, []);


  
  // Add product to cart
  // const addToCart = async (product) => {
  //   try {
  //     const response = await fetch("https://backend-4g4m.onrender.com/api/cart/add", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         userId: "12345", // replace with logged-in user ID
  //         productId: product._id, // use _id from DB
  //         name: product.name,
  //         price: product.price,
  //         image: product.image,
  //         quantity: 1,
  //       }),
  //     });

  //     const data = await response.json();
  //     if (response.ok) setMessage(`${product.name} added to cart!`);
  //     else setMessage("Failed to add to cart");
  //   } catch (err) {
  //     console.error(err);
  //     setMessage("Server error");
  //   }
  // };



  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Products</h1>

      {message && <p className="mb-4 text-green-600 font-medium">{message}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center">No products available</p>
        ) : (
          products.map((p) => (
           <div
          key={p._id}
          onClick={() => goToProduct(p._id)}
          className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition cursor-pointer"
                >

              <img src={`https://backend-4g4m.onrender.com${p.image}`}  alt={p.name} className="w-full h-40 object-cover rounded-md" />
              <h2 className="text-lg font-semibold mt-3">{p.name}</h2>
              <p className="text-blue-600 text-xl font-bold mt-1">${p.price}</p>
              <button
                onClick={() => addToCart(p)}
                className="mt-3 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              >
                Add to Cart
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
