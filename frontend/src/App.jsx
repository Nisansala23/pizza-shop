import { useState } from 'react'

const pizzas = [
  { id: 1, name: 'Classic Margherita', price: 12, tag: 'Classic', image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?w=600' },
  { id: 2, name: 'Rustic Pepperoni', price: 15, tag: 'Bestseller', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600' },
  { id: 3, name: 'Garden Veggie', price: 14, tag: "Chef's Pick", image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600' },
  { id: 4, name: 'BBQ Chicken', price: 16, tag: 'New', image: 'https://images.unsplash.com/photo-1555072956-7758afb20e8f?w=600' },
]

export default function App() {
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('Home')

  const addToCart = (pizza) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === pizza.id)
      return existing
        ? prev.map(i => i.id === pizza.id ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { ...pizza, qty: 1 }]
    })
  }

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id))
  const totalItems = cart.reduce((s, i) => s + i.qty, 0)
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <div style={{ fontFamily: 'sans-serif', background: '#111', minHeight: '100vh', color: '#fff' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&family=Nunito+Sans:wght@300;400;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }

        /* ---- HERO ---- */
        .hero {
          position: relative;
           width: 100vw;   /* Change from 100% to 100vw */
           height: 100vh;  /* This is correct */
           margin: 0;
         padding: 0;
        display: flex;
       flex-direction: column;
        }
        .hero-bg {
          position: absolute; inset: 0;
          background: url('https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1800&q=85') center center / cover no-repeat;
          transform-origin: center;
          animation: slowZoom 14s ease-in-out infinite alternate;
        }
        @keyframes slowZoom {
          from { transform: scale(1); }
          to   { transform: scale(1.06); }
        }
        .hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            to right,
            rgba(10,10,10,0.18) 0%,
            rgba(10,10,10,0.10) 40%,
            rgba(10,10,10,0.72) 65%,
            rgba(10,10,10,0.90) 100%
          );
        }

        /* ---- NAV ---- */
        .nav {
          position: absolute; top: 0; left: 0; right: 0; z-index: 50;
          display: flex; align-items: center; justify-content: space-between;
          padding: 28px 52px;
        }
        .logo {
          font-family: 'Oswald', sans-serif;
          font-size: 28px; font-weight: 700;
          color: #E8B83A; letter-spacing: -0.5px;
          cursor: pointer;
        }
        .nav-links {
          display: flex; gap: 40px; list-style: none;
        }
        .nav-links li {
          font-family: 'Nunito Sans', sans-serif;
          font-size: 14px; font-weight: 600; letter-spacing: 0.3px;
          color: rgba(255,255,255,0.82); cursor: pointer;
          transition: color 0.2s; position: relative;
          padding-bottom: 3px;
        }
        .nav-links li::after {
          content: ''; position: absolute; bottom: 0; left: 0;
          width: 0; height: 2px; background: #E8B83A;
          transition: width 0.25s;
        }
        .nav-links li:hover::after, .nav-links li.active::after { width: 100%; }
        .nav-links li:hover, .nav-links li.active { color: #E8B83A; }
        .nav-icons {
          display: flex; align-items: center; gap: 24px;
        }
        .nav-icon {
          background: none; border: none; cursor: pointer;
          color: rgba(255,255,255,0.82); transition: color 0.2s;
          display: flex; align-items: center;
        }
        .nav-icon:hover { color: #E8B83A; }
        .nav-icon svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
        .cart-wrap { position: relative; }
        .cart-badge {
          position: absolute; top: -7px; right: -8px;
          background: #E8B83A; color: #111;
          width: 17px; height: 17px; border-radius: 50%;
          font-family: 'Nunito Sans', sans-serif;
          font-size: 10px; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
        }

        /* ---- HERO CONTENT ---- */
        .hero-content {
          position: absolute; inset: 0; z-index: 10;
          display: flex; align-items: center; justify-content: flex-end;
          padding: 0 120px 0 0;
        }
        .hero-text { max-width: 520px; }
        .hero-title {
          font-family: 'Oswald', sans-serif;
          font-size: clamp(52px, 7vw, 92px);
          font-weight: 700; line-height: 1.0;
          color: #fff; letter-spacing: -1px;
          margin-bottom: 36px;
          animation: fadeUp 0.9s ease both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-cta {
          background: #b32d0f; color: #fff;
          border: none; cursor: pointer;
          font-family: 'Nunito Sans', sans-serif;
          font-size: 15px; font-weight: 700; letter-spacing: 0.4px;
          padding: 16px 44px; border-radius: 40px;
          transition: background 0.25s, transform 0.2s;
          animation: fadeUp 0.9s 0.2s ease both;
          box-shadow: 0 8px 24px rgba(179,45,15,0.45);
        }
        .hero-cta:hover { background: #961f07; transform: translateY(-2px); }

        /* ---- SOCIAL SIDEBAR ---- */
        .social-bar {
          position: absolute; right: 44px; top: 50%; transform: translateY(-50%);
          z-index: 20; display: flex; flex-direction: column; gap: 22px; align-items: center;
        }
        .social-btn {
          background: none; border: none; color: rgba(255,255,255,0.5);
          cursor: pointer; transition: color 0.2s; font-size: 15px;
          font-family: 'Nunito Sans', sans-serif;
        }
        .social-btn:hover { color: #E8B83A; }
        .social-line {
          width: 1px; height: 48px; background: rgba(255,255,255,0.18);
        }

        /* ---- MENU SECTION ---- */
        .menu-section {
          background: #111; padding: 90px 52px;
        }
        .menu-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: 52px;
        }
        .menu-label {
          font-family: 'Nunito Sans', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 4px;
          text-transform: uppercase; color: #E8B83A; margin-bottom: 10px;
        }
        .menu-title {
          font-family: 'Oswald', sans-serif;
          font-size: 40px; font-weight: 700; color: #fff; line-height: 1.1;
        }
        .view-all {
          background: none; border: 1px solid rgba(255,255,255,0.2);
          color: rgba(255,255,255,0.6); cursor: pointer;
          font-family: 'Nunito Sans', sans-serif;
          font-size: 13px; font-weight: 600; letter-spacing: 0.5px;
          padding: 10px 24px; border-radius: 30px;
          transition: all 0.2s;
        }
        .view-all:hover { border-color: #E8B83A; color: #E8B83A; }

        .menu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
          gap: 24px; max-width: 1200px; margin: 0 auto;
        }

        .pizza-card {
          background: #1c1c1c; border-radius: 20px; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.06);
          transition: transform 0.3s, box-shadow 0.3s;
          cursor: pointer;
        }
        .pizza-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }
        .pizza-img-wrap { position: relative; overflow: hidden; }
        .pizza-img {
          width: 100%; height: 210px; object-fit: cover; display: block;
          transition: transform 0.5s;
        }
        .pizza-card:hover .pizza-img { transform: scale(1.07); }
        .pizza-tag {
          position: absolute; top: 14px; left: 14px;
          background: #E8B83A; color: #111;
          font-family: 'Nunito Sans', sans-serif;
          font-size: 11px; font-weight: 800; letter-spacing: 1px;
          text-transform: uppercase;
          padding: 4px 12px; border-radius: 20px;
        }
        .pizza-body { padding: 20px 22px 22px; }
        .pizza-name {
          font-family: 'Oswald', sans-serif;
          font-size: 20px; font-weight: 600; color: #fff; margin-bottom: 14px;
        }
        .pizza-footer {
          display: flex; align-items: center; justify-content: space-between;
        }
        .pizza-price {
          font-family: 'Oswald', sans-serif;
          font-size: 24px; font-weight: 700; color: #E8B83A;
        }
        .pizza-price sup { font-size: 14px; vertical-align: super; }
        .add-btn {
          background: #b32d0f; color: #fff; border: none; cursor: pointer;
          font-family: 'Nunito Sans', sans-serif;
          font-size: 13px; font-weight: 700; letter-spacing: 0.3px;
          padding: 9px 20px; border-radius: 30px;
          transition: background 0.2s, transform 0.15s;
        }
        .add-btn:hover { background: #961f07; transform: scale(1.05); }

        /* ---- CART DRAWER ---- */
        .overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.6);
          z-index: 200; opacity: 0; pointer-events: none;
          transition: opacity 0.3s;
        }
        .overlay.visible { opacity: 1; pointer-events: all; }
        .cart-drawer {
          position: fixed; top: 0; right: 0; bottom: 0; width: 380px;
          background: #1a1a1a; border-left: 1px solid rgba(255,255,255,0.08);
          z-index: 300; display: flex; flex-direction: column;
          transform: translateX(100%);
          transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
          padding: 32px 28px;
        }
        .cart-drawer.open { transform: translateX(0); }
        .drawer-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 28px; padding-bottom: 20px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .drawer-title {
          font-family: 'Oswald', sans-serif; font-size: 24px; font-weight: 700; color: #fff;
        }
        .close-btn {
          background: none; border: none; color: rgba(255,255,255,0.4);
          font-size: 22px; cursor: pointer; transition: color 0.2s; line-height: 1;
        }
        .close-btn:hover { color: #fff; }
        .cart-items { flex: 1; overflow-y: auto; }
        .cart-item {
          display: flex; gap: 14px; align-items: center;
          padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .cart-item img { width: 58px; height: 58px; object-fit: cover; border-radius: 10px; flex-shrink: 0; }
        .cart-item-name {
          font-family: 'Nunito Sans', sans-serif; font-size: 14px; font-weight: 600; color: #fff;
        }
        .cart-item-sub {
          font-family: 'Nunito Sans', sans-serif; font-size: 12px; color: rgba(255,255,255,0.4);
          margin-top: 3px;
        }
        .cart-item-price {
          margin-left: auto; font-family: 'Oswald', sans-serif;
          font-size: 16px; font-weight: 600; color: #E8B83A; flex-shrink: 0;
        }
        .remove-btn {
          background: none; border: none; color: rgba(255,255,255,0.2);
          cursor: pointer; font-size: 16px; transition: color 0.2s; flex-shrink: 0;
        }
        .remove-btn:hover { color: #b32d0f; }
        .cart-footer { padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.08); }
        .cart-total-row {
          display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;
        }
        .cart-total-label {
          font-family: 'Nunito Sans', sans-serif; font-size: 14px; color: rgba(255,255,255,0.5);
        }
        .cart-total-val {
          font-family: 'Oswald', sans-serif; font-size: 26px; font-weight: 700; color: #fff;
        }
        .checkout-btn {
          width: 100%; padding: 15px;
          background: #b32d0f; color: #fff; border: none; cursor: pointer;
          font-family: 'Nunito Sans', sans-serif;
          font-size: 15px; font-weight: 700; letter-spacing: 0.5px;
          border-radius: 40px; transition: background 0.2s;
          box-shadow: 0 6px 20px rgba(179,45,15,0.4);
        }
        .checkout-btn:hover { background: #961f07; }
        .empty-cart {
          font-family: 'Nunito Sans', sans-serif;
          color: rgba(255,255,255,0.3); font-size: 14px; text-align: center;
          margin-top: 60px;
        }

        /* ---- FOOTER ---- */
        footer {
          background: #0d0d0d; padding: 32px 52px;
          display: flex; justify-content: space-between; align-items: center;
          border-top: 1px solid rgba(255,255,255,0.06);
          font-family: 'Nunito Sans', sans-serif;
        }
        .footer-logo {
          font-family: 'Oswald', sans-serif;
          font-size: 22px; font-weight: 700; color: #E8B83A;
        }
        .footer-copy { font-size: 13px; color: rgba(255,255,255,0.22); }

        @media (max-width: 768px) {
          .nav { padding: 20px 24px; }
          .nav-links { display: none; }
          .hero-content { justify-content: center; padding: 0 24px; text-align: center; }
          .social-bar { display: none; }
          .menu-section { padding: 60px 24px; }
          footer { flex-direction: column; gap: 12px; padding: 24px; text-align: center; }
          .cart-drawer { width: 100%; }
        }
      `}</style>

      {/* Cart overlay */}
      <div className={`overlay ${cartOpen ? 'visible' : ''}`} onClick={() => setCartOpen(false)} />

      {/* Cart Drawer */}
      <div className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <span className="drawer-title">Your Order</span>
          <button className="close-btn" onClick={() => setCartOpen(false)}>✕</button>
        </div>
        <div className="cart-items">
          {cart.length === 0
            ? <p className="empty-cart">Your cart is empty.<br />Add some pizzas! 🍕</p>
            : cart.map(item => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} />
                <div>
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-sub">${item.price} × {item.qty}</div>
                </div>
                <div className="cart-item-price">${item.price * item.qty}</div>
                <button className="remove-btn" onClick={() => removeFromCart(item.id)}>✕</button>
              </div>
            ))
          }
        </div>
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total-row">
              <span className="cart-total-label">Total</span>
              <span className="cart-total-val">${totalPrice}</span>
            </div>
            <button className="checkout-btn">Place Order →</button>
          </div>
        )}
      </div>

      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-overlay" />

        {/* NAV */}
        <nav className="nav">
          <div className="logo">pizzafly.</div>
          <ul className="nav-links">
            {['Home', 'Menu', 'Delivery', 'About Us'].map(link => (
              <li key={link} className={activeNav === link ? 'active' : ''} onClick={() => setActiveNav(link)}>
                {link}
              </li>
            ))}
          </ul>
          <div className="nav-icons">
            {/* Search */}
            <button className="nav-icon">
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="22" y2="22" /></svg>
            </button>
            {/* Cart */}
            <button className="nav-icon cart-wrap" onClick={() => setCartOpen(true)}>
              <svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </button>
            {/* Menu */}
            <button className="nav-icon">
              <svg viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </button>
          </div>
        </nav>

        {/* HERO TEXT */}
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Less Waiting.<br />More Eating.</h1>
            <button
              className="hero-cta"
              onClick={() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' })}
            >
              Explore our Menu
            </button>
          </div>
        </div>

        {/* SOCIAL */}
        <div className="social-bar">
          <div className="social-line" />
          <button className="social-btn">f</button>
          <button className="social-btn">◎</button>
          <button className="social-btn">𝕏</button>
          <div className="social-line" />
        </div>
      </section>

      {/* ===== MENU ===== */}
      <section className="menu-section" id="menu">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="menu-header">
            <div>
              <div className="menu-label">What we offer</div>
              <h2 className="menu-title">Our Popular Menu</h2>
            </div>
            <button className="view-all">View All →</button>
          </div>
          <div className="menu-grid">
            {pizzas.map(pizza => (
              <div className="pizza-card" key={pizza.id}>
                <div className="pizza-img-wrap">
                  <img src={pizza.image} alt={pizza.name} className="pizza-img" />
                  <span className="pizza-tag">{pizza.tag}</span>
                </div>
                <div className="pizza-body">
                  <div className="pizza-name">{pizza.name}</div>
                  <div className="pizza-footer">
                    <div className="pizza-price"><sup>$</sup>{pizza.price}</div>
                    <button className="add-btn" onClick={() => addToCart(pizza)}>+ Add</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer>
        <div className="footer-logo">pizzafly.</div>
        <div className="footer-copy">© 2025 Nisa's DevOps Pizza — Shipped with ❤️</div>
      </footer>
    </div>
  )
}
