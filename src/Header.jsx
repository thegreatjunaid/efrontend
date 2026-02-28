// import { Link } from "react-router-dom";

// export default function Header() {
//   return (
//     <header className="bg-white shadow-md px-6 py-4 sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto flex items-center justify-between">
        
//         {/* Logo */}
//         <div className="text-2xl font-bold text-blue-600">
//           <Link to="/">ShopX</Link>
//         </div>

//         {/* Navigation Links */}
//         <nav className="hidden md:flex space-x-6 text-gray-700 font-medium">
//           <Link to="/home" className="hover:text-blue-600">Home</Link>
//           <Link to="/product" className="hover:text-blue-600">Products</Link>
//           <Link to="/cart" className="hover:text-blue-600">Cart</Link>
//           <Link to="/about" className="hover:text-blue-600">About</Link>
//           <Link to="/contact" className="hover:text-blue-600">Contact</Link>
//         </nav>

//         {/* Login Button */}
//         <div className="hidden md:block">
//           <Link
//             to="/login"
//             className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
//           >
//             Login
//           </Link>
//         </div>

//         {/* Mobile Menu Button */}
//         <button className="md:hidden text-gray-700 text-2xl">
//           &#9776;
//         </button>
//       </div>
//     </header>
//   );
// }


import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [search, setSearch] = useState(""); // <-- add this
  const navigate = useNavigate();           // <-- add this

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() !== "") {
      navigate(`/search/${search}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <header className="bg-[#0b1f3a] px-8 py-3 flex items-center justify-between">
      {/* LOGO */}
      <div className="flex items-center">
        <img
          src="/logo.png.png"
          alt="Junaid Store"
          className="h-26 w-auto object-contain"
        />
      </div>

      {/* SEARCH BAR */}
      <form
        onSubmit={handleSearch}
        className="flex w-1/3 bg-white rounded-full overflow-hidden shadow-md"
      >
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 text-black focus:outline-none"
        />
        <button
          type="submit"
          className="bg-orange-500 text-white px-6 hover:bg-orange-600"
        >
          Search
        </button>
      </form>

      {/* NAV */}
      <nav className="flex items-center gap-6 text-white font-medium">
        <Link to="/home" className="hover:text-orange-400">
          Home
        </Link>
        <Link to="/product" className="hover:text-orange-400">
          Products
        </Link>
        <Link to="/cart" className="hover:text-orange-400">
          Cart
        </Link>

        {!isLoggedIn ? (
          <>
            <Link
              to="/login"
              className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/profile"
              className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-md"
            >
              Profile
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md"
            >
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}