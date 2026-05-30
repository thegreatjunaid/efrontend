import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "./Cartcontext";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const { toggleCart, cartItems } = useCart();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() !== "") {
      navigate(`/search/${search}`);
      setSearch("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
    navigate("/");
  };

  const cartCount = cartItems?.length || 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=DM+Sans:wght@400;500;600&display=swap');

        .header-root {
          font-family: 'DM Sans', sans-serif;
          background: linear-gradient(135deg, #0a1628 0%, #0f2147 60%, #0d1b3e 100%);
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
          box-shadow: 0 4px 32px rgba(0, 0, 0, 0.45);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        /* TOP ROW */
        .header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          padding: 0.75rem 0;
        }

        /* LOGO */
        .logo-link img {
          height: 52px;
          object-fit: contain;
          cursor: pointer;
          transition: opacity 0.2s;
          filter: drop-shadow(0 0 8px rgba(212,175,55,0.25));
        }
        .logo-link img:hover { opacity: 0.85; }

        /* SEARCH BAR */
        .search-form {
          flex: 1;
          max-width: 640px;
          display: flex;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(212, 175, 55, 0.25);
          border-radius: 50px;
          overflow: hidden;
          backdrop-filter: blur(8px);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search-form:focus-within {
          border-color: rgba(212, 175, 55, 0.65);
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
        }
        .search-form input {
          flex: 1;
          background: transparent;
          border: none;
          padding: 0.6rem 1.25rem;
          color: #f0f0f0;
          font-size: 0.9rem;
          font-family: 'DM Sans', sans-serif;
          outline: none;
        }
        .search-form input::placeholder { color: rgba(255,255,255,0.38); }
        .search-btn {
          background: linear-gradient(135deg, #d4af37, #c49a1a);
          color: #0a1628;
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 0.04em;
          border: none;
          padding: 0 1.5rem;
          cursor: pointer;
          transition: filter 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .search-btn:hover { filter: brightness(1.12); }

        /* HAMBURGER */
        .menu-toggle {
          display: none;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(212,175,55,0.2);
          color: #d4af37;
          font-size: 1.4rem;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .menu-toggle:hover { background: rgba(212,175,55,0.1); }

        /* DESKTOP NAV */
        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .nav-link {
          color: rgba(255,255,255,0.78);
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          padding: 0.45rem 0.9rem;
          border-radius: 6px;
          transition: color 0.2s, background 0.2s;
          letter-spacing: 0.02em;
        }
        .nav-link:hover {
          color: #d4af37;
          background: rgba(212,175,55,0.08);
        }

        /* CART ICON BUTTON */
        .cart-btn {
          position: relative;
          background: none;
          border: none;
          color: rgba(255,255,255,0.78);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.45rem 0.75rem;
          border-radius: 6px;
          transition: color 0.2s, background 0.2s;
        }
        .cart-btn:hover {
          color: #d4af37;
          background: rgba(212,175,55,0.08);
        }
        .cart-badge {
          position: absolute;
          top: 2px;
          right: 4px;
          background: linear-gradient(135deg, #d4af37, #c49a1a);
          color: #0a1628;
          font-size: 0.6rem;
          font-weight: 700;
          min-width: 16px;
          height: 16px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 3px;
          line-height: 1;
          font-family: 'DM Sans', sans-serif;
        }

        /* DIVIDER between nav links and auth buttons */
        .nav-divider {
          width: 1px;
          height: 22px;
          background: rgba(255,255,255,0.15);
          margin: 0 0.5rem;
        }

        /* AUTH BUTTONS */
        .btn {
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          padding: 0.45rem 1.1rem;
          border-radius: 7px;
          text-decoration: none;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: filter 0.2s, transform 0.15s;
          white-space: nowrap;
        }
        .btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .btn:active { transform: translateY(0); }

        .btn-login {
          background: linear-gradient(135deg, #d4af37, #b8941e);
          color: #0a1628;
        }
        .btn-register {
          background: rgba(59, 130, 246, 0.15);
          color: #93c5fd;
          border: 1px solid rgba(59, 130, 246, 0.35);
        }
        .btn-register:hover { background: rgba(59,130,246,0.25); filter: none; }

        .btn-profile {
          background: rgba(6, 182, 212, 0.12);
          color: #67e8f9;
          border: 1px solid rgba(6,182,212,0.3);
        }
        .btn-profile:hover { background: rgba(6,182,212,0.22); filter: none; }

        .btn-logout {
          background: rgba(239, 68, 68, 0.12);
          color: #fca5a5;
          border: 1px solid rgba(239,68,68,0.3);
        }
        .btn-logout:hover { background: rgba(239,68,68,0.22); filter: none; }

        /* MOBILE SEARCH */
        .search-mobile {
          display: none;
          margin-top: 0.65rem;
        }

        /* MOBILE MENU */
        .mobile-menu {
          display: none;
          flex-direction: column;
          gap: 0.5rem;
          padding: 0.75rem 0 1rem;
          border-top: 1px solid rgba(212, 175, 55, 0.1);
          margin-top: 0.5rem;
        }
        .mobile-menu a, .mobile-menu button {
          color: rgba(255,255,255,0.82);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          padding: 0.55rem 0.85rem;
          border-radius: 7px;
          transition: background 0.2s, color 0.2s;
        }
        .mobile-menu a:hover { background: rgba(212,175,55,0.08); color: #d4af37; }
        .mobile-menu .btn { display: inline-block; width: fit-content; }

        /* MOBILE CART BTN */
        .mobile-cart-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          color: rgba(255,255,255,0.82);
          font-size: 0.9rem;
          font-weight: 500;
          padding: 0.55rem 0.85rem;
          border-radius: 7px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.2s, color 0.2s;
          text-align: left;
        }
        .mobile-cart-btn:hover {
          background: rgba(212,175,55,0.08);
          color: #d4af37;
        }

        /* BOTTOM ACCENT LINE */
        .header-accent {
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(212,175,55,0.6) 30%, rgba(212,175,55,0.85) 50%, rgba(212,175,55,0.6) 70%, transparent);
        }

        /* RESPONSIVE */
        @media (max-width: 767px) {
          .header-inner { padding: 0 1rem; }
          .desktop-nav { display: none !important; }
          .search-desktop { display: none !important; }
          .menu-toggle { display: flex !important; }
          .search-mobile { display: flex !important; }
          .mobile-menu { display: flex !important; }
        }
      `}</style>

      <header className="header-root">
        <div className="header-inner">

          {/* TOP ROW */}
          <div className="header-top">

            {/* LOGO */}
            <Link to="/" className="logo-link">
              <img src="/logo.png.png" alt="Junaid Store" />
            </Link>

            {/* SEARCH BAR (Desktop) */}
            <form onSubmit={handleSearch} className="search-form search-desktop">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit" className="search-btn">Search</button>
            </form>

            {/* MOBILE MENU BUTTON */}
            <button
              className="menu-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? "✕" : "☰"}
            </button>

            {/* DESKTOP NAV */}
            <nav className="desktop-nav">
              <Link to="/home" className="nav-link">Home</Link>
              <Link to="/product" className="nav-link">Products</Link>
               <Link to="/track" className="nav-link">TrackOrder</Link>
              {/* CART ICON */}
              <button onClick={toggleCart} className="cart-btn" aria-label="Open cart">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </button>

              <div className="nav-divider" />

              {!isLoggedIn ? (
                <>
                  <Link to="/login" className="btn btn-login">Signup</Link>
                  <Link to="/register" className="btn btn-register">Register</Link>
                </>
              ) : (
                <>
                  <Link to="/profile" className="btn btn-profile">Profile</Link>
                  <button onClick={handleLogout} className="btn btn-logout">Logout</button>
                </>
              )}
            </nav>

          </div>

          {/* MOBILE SEARCH BAR */}
          <form onSubmit={handleSearch} className="search-form search-mobile">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="search-btn">Search</button>
          </form>

          {/* MOBILE MENU */}
          {menuOpen && (
            <nav className="mobile-menu">
              <Link to="/home">Home</Link>
              <Link to="/product">Products</Link>
<Link to="/track">TrackOrder</Link>
              {/* MOBILE CART BUTTON */}
              <button onClick={() => { toggleCart(); setMenuOpen(false); }} className="mobile-cart-btn" aria-label="Open cart">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                Cart {cartCount > 0 && `(${cartCount})`}
              </button>

              {!isLoggedIn ? (
                <>
                  <Link to="/login" className="btn btn-login">Signup</Link>
                 
                </>
              ) : (
                <>
                  <Link to="/profile" className="btn btn-profile">Profile</Link>
                  <button onClick={handleLogout} className="btn btn-logout">Logout</button>
                </>
              )}
            </nav>
          )}

        </div>

        {/* GOLD ACCENT LINE */}
        <div className="header-accent" />
      </header>
    </>
  );
}