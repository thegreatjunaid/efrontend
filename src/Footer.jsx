import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, ShoppingBag, MapPin, Mail, Phone, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=DM+Sans:wght@400;500;600&display=swap');

        .footer-root {
          font-family: 'DM Sans', sans-serif;
          background: linear-gradient(170deg, #0a1628 0%, #0c1d3a 50%, #080f1e 100%);
          border-top: 1px solid rgba(212, 175, 55, 0.2);
          position: relative;
          overflow: hidden;
        }

        /* Background decorative glow */
        .footer-root::before {
          content: '';
          position: absolute;
          top: -80px;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 160px;
          background: radial-gradient(ellipse, rgba(212,175,55,0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        .footer-top-accent {
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(212,175,55,0.5) 30%, rgba(212,175,55,0.9) 50%, rgba(212,175,55,0.5) 70%, transparent);
        }

        .footer-grid {
          max-width: 1280px;
          margin: 0 auto;
          padding: 3.5rem 2rem 2.5rem;
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr 1.3fr;
          gap: 2.5rem;
        }

        /* BRAND COLUMN */
        .brand-logo {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 1rem;
          text-decoration: none;
        }
        .brand-icon {
          background: linear-gradient(135deg, #d4af37, #b8941e);
          border-radius: 10px;
          padding: 0.4rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(212,175,55,0.3);
        }
        .brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem;
          color: #fff;
          letter-spacing: 0.02em;
        }
        .brand-tagline {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.45);
          line-height: 1.7;
          margin-bottom: 1.5rem;
          max-width: 240px;
        }

        /* CONTACT INFO */
        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          color: rgba(255,255,255,0.5);
          font-size: 0.8rem;
          margin-bottom: 0.55rem;
          transition: color 0.2s;
        }
        .contact-item:hover { color: #d4af37; }
        .contact-icon {
          color: #d4af37;
          opacity: 0.8;
          flex-shrink: 0;
        }

        /* COLUMN HEADINGS */
        .footer-col h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1rem;
          color: #d4af37;
          margin-bottom: 1.2rem;
          letter-spacing: 0.04em;
          position: relative;
          padding-bottom: 0.6rem;
        }
        .footer-col h3::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 28px;
          height: 1.5px;
          background: rgba(212,175,55,0.5);
          border-radius: 2px;
        }

        /* NAV LINKS */
        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .footer-links li a {
          color: rgba(255,255,255,0.52);
          text-decoration: none;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          transition: color 0.2s, gap 0.2s;
        }
        .footer-links li a .arrow-icon {
          opacity: 0;
          transform: translateX(-4px);
          transition: opacity 0.2s, transform 0.2s;
          color: #d4af37;
        }
        .footer-links li a:hover {
          color: #f0f0f0;
          gap: 0.6rem;
        }
        .footer-links li a:hover .arrow-icon {
          opacity: 1;
          transform: translateX(0);
        }

        /* NEWSLETTER */
        .newsletter-text {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.45);
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        .newsletter-form {
          display: flex;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 8px;
          overflow: hidden;
          transition: border-color 0.2s;
          margin-bottom: 1.5rem;
        }
        .newsletter-form:focus-within {
          border-color: rgba(212,175,55,0.55);
        }
        .newsletter-form input {
          flex: 1;
          background: transparent;
          border: none;
          padding: 0.6rem 0.85rem;
          color: #f0f0f0;
          font-size: 0.8rem;
          font-family: 'DM Sans', sans-serif;
          outline: none;
        }
        .newsletter-form input::placeholder { color: rgba(255,255,255,0.3); }
        .newsletter-btn {
          background: linear-gradient(135deg, #d4af37, #b8941e);
          border: none;
          padding: 0 1rem;
          cursor: pointer;
          color: #0a1628;
          font-weight: 700;
          font-size: 0.78rem;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.04em;
          transition: filter 0.2s;
          white-space: nowrap;
        }
        .newsletter-btn:hover { filter: brightness(1.1); }

        /* SOCIAL ICONS */
        .social-row {
          display: flex;
          gap: 0.65rem;
        }
        .social-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(212,175,55,0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.2s;
          text-decoration: none;
        }
        .social-btn:hover {
          background: rgba(212,175,55,0.12);
          border-color: rgba(212,175,55,0.5);
          color: #d4af37;
          transform: translateY(-2px);
        }

        /* BOTTOM BAR */
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.06);
          max-width: 1280px;
          margin: 0 auto;
          padding: 1.2rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .footer-copy {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.3);
        }
        .footer-copy span {
          color: rgba(212,175,55,0.6);
        }
        .footer-bottom-links {
          display: flex;
          gap: 1.5rem;
        }
        .footer-bottom-links a {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.3);
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-bottom-links a:hover { color: #d4af37; }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
        }
        @media (max-width: 560px) {
          .footer-grid {
            grid-template-columns: 1fr;
            padding: 2.5rem 1.25rem 2rem;
          }
          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
            padding: 1rem 1.25rem;
          }
          .footer-bottom-links { gap: 1rem; }
        }
      `}</style>

      <footer className="footer-root">
        <div className="footer-top-accent" />

        <div className="footer-grid">

          {/* BRAND COLUMN */}
          <div className="footer-col">
            <Link to="/home" className="brand-logo">
              <div className="brand-icon">
                <ShoppingBag size={18} color="#0a1628" />
              </div>
              <span className="brand-name">Junaid Store</span>
            </Link>
            <p className="brand-tagline">
              Your trusted online fashion & lifestyle marketplace. Premium products at prices that make sense.
            </p>

            <div className="contact-item">
              <MapPin size={13} className="contact-icon" />
              Karachi, Pakistan
            </div>
            <div className="contact-item">
              <Mail size={13} className="contact-icon" />
              support@junaidstore.com
            </div>
            <div className="contact-item">
              <Phone size={13} className="contact-icon" />
              +92 300 0000000
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="footer-col">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              {[
                { label: "Home", to: "/home" },
                { label: "Shop", to: "/product" },
                { label: "Cart", to: "/cart" },
                { label: "My Profile", to: "/profile" },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to}>
                    <ArrowRight size={11} className="arrow-icon" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CUSTOMER SERVICE */}
          <div className="footer-col">
            <h3>Customer Service</h3>
            <ul className="footer-links">
              {[
                { label: "Contact Us", to: "/contact" },
                { label: "Order Tracking", to: "/orders" },
                { label: "Returns & Refunds", to: "/returns" },
                { label: "FAQ", to: "/faq" },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to}>
                    <ArrowRight size={11} className="arrow-icon" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* NEWSLETTER + SOCIAL */}
          <div className="footer-col">
            <h3>Stay Updated</h3>
            <p className="newsletter-text">
              Subscribe for exclusive deals, new arrivals, and style inspiration.
            </p>
            <div className="newsletter-form">
              <input type="email" placeholder="your@email.com" />
              <button className="newsletter-btn">Subscribe</button>
            </div>

            <h3 style={{ marginTop: "0.25rem" }}>Follow Us</h3>
            <div className="social-row">
              <a href="#" className="social-btn" aria-label="Facebook">
                <Facebook size={15} />
              </a>
              <a href="#" className="social-btn" aria-label="Instagram">
                <Instagram size={15} />
              </a>
              <a href="#" className="social-btn" aria-label="Twitter">
                <Twitter size={15} />
              </a>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="footer-bottom">
          <p className="footer-copy">
            © {new Date().getFullYear()} <span>Junaid Store.</span> All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/sitemap">Sitemap</Link>
          </div>
        </div>

      </footer>
    </>
  );
}