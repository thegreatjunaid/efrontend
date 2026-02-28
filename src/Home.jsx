import Header from "./Header";
import Product from "./Product";

export default function Home() {
  return (

    <div className="bg-white text-gray-800">
   
      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-blue-50 to-orange-50 py-24 px-6 text-center">
        <h1 className="text-5xl font-extrabold mb-6">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
            Junaid Store
          </span>
        </h1>
                        
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Discover premium quality products at unbeatable prices with fast delivery across Bangladesh.
        </p>

        <button className="bg-gradient-to-r from-orange-500 to-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-md hover:scale-105 transition duration-300">
          Start Shopping
        </button>
      </section>


      {/* PRODUCTS */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <Product />
      </div>


      {/* CATEGORIES */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Shop by Category
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {["Electronics", "Fashion", "Home & Kitchen", "Sports"].map(
            (cat, index) => (
              <div
                key={index}
                className="bg-white border rounded-2xl p-6 text-center shadow-sm hover:shadow-lg hover:-translate-y-2 transition duration-300 cursor-pointer"
              >
                <div className="text-4xl mb-3">🛍️</div>
                <h3 className="font-semibold text-lg">{cat}</h3>
              </div>
            )
          )}
        </div>
      </section>


      {/* FEATURED PRODUCTS */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Featured Products
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white p-6 rounded-2xl border shadow-sm hover:shadow-xl transition duration-300"
              >
                <div className="h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  Product {item}
                </div>

                <p className="text-xl font-bold text-blue-600 mb-4">
                  ৳ 49.99
                </p>

                <button className="w-full bg-orange-500 text-white py-2 rounded-full hover:bg-orange-600 transition">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* NEWSLETTER */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Subscribe to Our Newsletter
        </h2>

        <p className="text-gray-600 mb-8">
          Get updates on new arrivals and exclusive offers.
        </p>

        <div className="max-w-md mx-auto flex shadow-md rounded-full overflow-hidden">
          <input
            type="email"
            placeholder="Enter your email"
            className="grow px-5 py-3 focus:outline-none"
          />
          <button className="bg-gradient-to-r from-orange-500 to-blue-600 text-white px-6">
            Subscribe
          </button>
        </div>
      </section>

    </div>
  );
}
