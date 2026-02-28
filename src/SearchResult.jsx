import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function SearchResult() {
  const { keyword } = useParams();
  const [products, setProducts] = useState([]);
    const navigate = useNavigate();
  useEffect(() => {
    fetch(`https://backend-4g4m.onrender.com/api/product/search?q=${keyword}`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, [keyword]);
      
  const goToProduct = (id) => {
  navigate(`/product/${id}`);
};

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-2xl font-bold mb-8">
        Search Results for "{keyword}"
      </h2>

      {products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
               
        
              key={product._id}
              onClick={() => goToProduct(product._id)}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <img
                src={`https://backend-4g4m.onrender.com${product.image}`}
                alt={product.name}
                className="h-40 w-full object-cover rounded-md mb-3"
              />
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-blue-600 font-bold mb-2">৳ {product.price}</p>
              <p className="text-gray-600 text-sm">{product.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}