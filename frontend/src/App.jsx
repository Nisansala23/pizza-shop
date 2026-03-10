import { useState, useEffect, useRef } from 'react'

const pizzas = [
  { id: 1, name: 'Classic Margherita', price: 12, tag: 'Classic', image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=600' },
  { id: 2, name: 'Rustic Pepperoni', price: 15, tag: 'Bestseller', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600' },
  { id: 3, name: 'Garden Veggie', price: 14, tag: "Chef's Pick", image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600' },
  { id: 4, name: 'BBQ Chicken', price: 16, tag: 'New', image: 'https://images.unsplash.com/photo-1555072956-7758afb20e8f?w=600' },
]

const deals = [
  { id: 1, title: 'Buy 2 Get 1 Free', desc: 'Every Tuesday — mix & match any pizzas', badge: 'TODAY', color: '#b32d0f', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600' },
  { id: 2, title: '30% Off First Order', desc: 'Use code FLY30 at checkout', badge: 'NEW USER', color: '#E8B83A', image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=600' },
  { id: 3, title: 'Family Feast Bundle', desc: '4 pizzas + drinks for just $49', badge: 'BUNDLE', color: '#2d8f5e', image: 'https://images.unsplash.com/photo-1555072956-7758afb20e8f?w=600' },
]

const reviews = [
  { name: 'Sara M.', stars: 5, text: 'Absolutely the best pizza in town. The crust is perfectly crispy and the toppings are so fresh!', location: 'New York' },
  { name: 'James R.', stars: 5, text: 'Ordered the BBQ Chicken and it blew my mind. Delivered hot and fast — will definitely order again.', location: 'Chicago' },
  { name: 'Lena K.', stars: 5, text: 'Garden Veggie is a dream. Love that they use real veggies. The app makes ordering so easy!', location: 'Los Angeles' },
  { name: 'Tom B.', stars: 4, text: 'Pepperoni is classic done right. Crispy edges, generous toppings. My go-to every Friday night.', location: 'Austin' },
]

const steps = [
  { num: '01', title: 'Pick Your Pizza', desc: 'Browse our handcrafted menu and choose your favourite or build your own.', icon: '🍕' },
  { num: '02', title: 'Customize It', desc: 'Choose your size, crust type, and extra toppings to your heart\'s content.', icon: '✏️' },
  { num: '03', title: 'We Bake & Pack', desc: 'Our chefs fire up the oven the moment your order comes in — fresh every time.', icon: '🔥' },
  { num: '04', title: 'Fast Delivery', desc: 'Your pizza arrives hot at your door, usually within 30 minutes or less.', icon: '🚀' },
]

const features = [
  { icon: '🌿', title: 'Fresh Ingredients', desc: 'Sourced daily from local farms. No shortcuts, no compromises.' },
  { icon: '⚡', title: '30-Min Delivery', desc: 'We guarantee your pizza arrives hot or your next one is free.' },
  { icon: '👨‍🍳', title: 'Master Chefs', desc: 'Our pizzaiolos trained in Naples. Every pie is a work of art.' },
  { icon: '♻️', title: 'Eco Packaging', desc: '100% compostable boxes. Good for you, good for the planet.' },
]

function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [start, target, duration])
  return count
}

function StatItem({ value, suffix, label, start }) {
  const count = useCountUp(value, 2000, start)
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 'clamp(40px,5vw,64px)', fontWeight: 700, color: '#E8B83A', lineHeight: 1 }}>
        {count.toLocaleString()}{suffix}
      </div>
      <div style={{ fontFamily: "'Nunito Sans',sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.45)', letterSpacing: 2, textTransform: 'uppercase', marginTop: 8 }}>{label}</div>
    </div>
  )
}

export default function App() {
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('Home')
  const [loading, setLoading] = useState(true)
  const [loadPct, setLoadPct] = useState(0)
  const [statsVisible, setStatsVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const statsRef = useRef(null)

  // Loading screen
  useEffect(() => {
    let pct = 0
    const iv = setInterval(() => {
      pct += Math.random() * 18 + 5
      if (pct >= 100) { pct = 100; clearInterval(iv); setTimeout(() => setLoading(false), 400) }
      setLoadPct(Math.min(pct, 100))
    }, 120)
    return () => clearInterval(iv)
  }, [])

  // Stats intersection observer
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true) }, { threshold: 0.3 })
    if (statsRef.current) obs.observe(statsRef.current)
    return () => obs.disconnect()
  }, [])

  const addToCart = (pizza) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === pizza.id)
      return existing ? prev.map(i => i.id === pizza.id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { ...pizza, qty: 1 }]
    })
  }
  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id))
  const totalItems = cart.reduce((s, i) => s + i.qty, 0)
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <div style={{ fontFamily: 'sans-serif', background: '#111', minHeight: '100vh', color: '#fff', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&family=Nunito+Sans:wght@300;400;600;700;800&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior: smooth; }
        
        /* LOADING */
        .loader { position:fixed; inset:0; background:#0d0d0d; z-index:9999; display:flex; flex-direction:column; align-items:center; justify-content:center; transition:opacity 0.5s, visibility 0.5s; }
        .loader.done { opacity:0; visibility:hidden; }
        .loader-logo { font-family:'Oswald',sans-serif; font-size:52px; font-weight:700; color:#E8B83A; letter-spacing:-1px; margin-bottom:40px; animation: pulse 1s ease-in-out infinite alternate; }
        @keyframes pulse { from{opacity:0.7;transform:scale(0.97)} to{opacity:1;transform:scale(1)} }
        .loader-bar-bg { width:240px; height:3px; background:rgba(255,255,255,0.1); border-radius:10px; overflow:hidden; }
        .loader-bar { height:100%; background:#E8B83A; border-radius:10px; transition:width 0.15s ease; }
        .loader-pct { font-family:'Nunito Sans',sans-serif; font-size:12px; color:rgba(255,255,255,0.3); letter-spacing:3px; margin-top:14px; }

        /* HERO */
        .hero { position:relative; width:100vw; height:100vh; display:flex; flex-direction:column; overflow:hidden;  margin-left: calc(-50vw + 50%); }
        .hero-bg { position:absolute; inset:0; background:url('https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1800&q=85') center/cover no-repeat; animation:slowZoom 14s ease-in-out infinite alternate; }
        @keyframes slowZoom { from{transform:scale(1)} to{transform:scale(1.06)} }
        .hero-overlay { position:absolute; inset:0; background:linear-gradient(to right,rgba(10,10,10,0.18) 0%,rgba(10,10,10,0.10) 40%,rgba(10,10,10,0.72) 65%,rgba(10,10,10,0.90) 100%); }

        /* NAV */
        .nav { position:absolute; top:0; left:0; right:0; z-index:50; display:flex; align-items:center; justify-content:space-between; padding:28px 52px; }
        .logo { font-family:'Oswald',sans-serif; font-size:28px; font-weight:700; color:#E8B83A; letter-spacing:-0.5px; cursor:pointer; }
        .nav-links { display:flex; gap:40px; list-style:none; }
        .nav-links li { font-family:'Nunito Sans',sans-serif; font-size:14px; font-weight:600; letter-spacing:0.3px; color:rgba(255,255,255,0.82); cursor:pointer; transition:color 0.2s; position:relative; padding-bottom:3px; }
        .nav-links li::after { content:''; position:absolute; bottom:0; left:0; width:0; height:2px; background:#E8B83A; transition:width 0.25s; }
        .nav-links li:hover::after, .nav-links li.active::after { width:100%; }
        .nav-links li:hover, .nav-links li.active { color:#E8B83A; }
        .nav-icons { display:flex; align-items:center; gap:24px; }
        .nav-icon { background:none; border:none; cursor:pointer; color:rgba(255,255,255,0.82); transition:color 0.2s; display:flex; align-items:center; }
        .nav-icon:hover { color:#E8B83A; }
        .nav-icon svg { width:20px; height:20px; fill:none; stroke:currentColor; stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round; }
        .cart-wrap { position:relative; }
        .cart-badge { position:absolute; top:-7px; right:-8px; background:#E8B83A; color:#111; width:17px; height:17px; border-radius:50%; font-family:'Nunito Sans',sans-serif; font-size:10px; font-weight:800; display:flex; align-items:center; justify-content:center; }

        /* HERO CONTENT */
        .hero-content { position:absolute; inset:0; z-index:10; display:flex; align-items:center; justify-content:flex-end; padding:0 120px 0 0; }
        .hero-text { max-width:520px; }
        .hero-title { font-family:'Oswald',sans-serif; font-size:clamp(52px,7vw,92px); font-weight:700; line-height:1.0; color:#fff; letter-spacing:-1px; margin-bottom:36px; animation:fadeUp 0.9s ease both; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        .hero-cta { background:#b32d0f; color:#fff; border:none; cursor:pointer; font-family:'Nunito Sans',sans-serif; font-size:15px; font-weight:700; letter-spacing:0.4px; padding:16px 44px; border-radius:40px; transition:background 0.25s,transform 0.2s; animation:fadeUp 0.9s 0.2s ease both; box-shadow:0 8px 24px rgba(179,45,15,0.45); }
        .hero-cta:hover { background:#961f07; transform:translateY(-2px); }

        /* SOCIAL */
        .social-bar { position:absolute; right:44px; top:50%; transform:translateY(-50%); z-index:20; display:flex; flex-direction:column; gap:22px; align-items:center; }
        .social-btn { background:none; border:none; color:rgba(255,255,255,0.5); cursor:pointer; transition:color 0.2s; font-size:15px; font-family:'Nunito Sans',sans-serif; }
        .social-btn:hover { color:#E8B83A; }
        .social-line { width:1px; height:48px; background:rgba(255,255,255,0.18); }

        /* DEALS BANNER */
        .deals-section { background:#161616; padding:80px 52px; }
.section-label { font-family:'Nunito Sans',sans-serif; font-size:11px; font-weight:700; letter-spacing:4px; text-transform:uppercase; color:#E8B83A; margin-bottom:10px; }
.section-title { font-family:'Oswald',sans-serif; font-size:40px; font-weight:700; color:#fff; line-height:1.1; margin-bottom:48px; }
.deals-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; max-width:1200px; margin:0 auto; }
.deal-card { border-radius:18px; overflow:hidden; border:1px solid rgba(255,255,255,0.07); transition:transform 0.3s,box-shadow 0.3s; cursor:pointer; background:#1c1c1c; padding:0; position:relative; }
.deal-card:hover { transform:translateY(-5px); box-shadow:0 20px 40px rgba(0,0,0,0.5); }
.deal-img-wrap { overflow:hidden; position:relative; }
.deal-img { width:100%; height:180px; object-fit:cover; display:block; transition:transform 0.5s; }
.deal-card:hover .deal-img { transform:scale(1.06); }
.deal-body { padding:22px 24px 28px; position:relative; }
.deal-badge { display:inline-block; font-family:'Nunito Sans',sans-serif; font-size:10px; font-weight:800; letter-spacing:2px; padding:5px 14px; border-radius:30px; margin-bottom:18px; }
.deal-title { font-family:'Oswald',sans-serif; font-size:26px; font-weight:700; color:#fff; margin-bottom:10px; }
.deal-desc { font-family:'Nunito Sans',sans-serif; font-size:14px; color:rgba(255,255,255,0.5); line-height:1.6; }
.deal-arrow { position:absolute; bottom:24px; right:24px; font-size:20px; opacity:0.3; transition:opacity 0.2s,transform 0.2s; }
.deal-card:hover .deal-arrow { opacity:1; transform:translateX(4px); }

        /* FEATURES */
        .features-section { background:#111; padding:80px 52px; }
        .features-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:24px; max-width:1200px; margin:0 auto; }
        .feature-card { background:#1a1a1a; border-radius:18px; padding:32px 28px; border:1px solid rgba(255,255,255,0.06); transition:border-color 0.3s,transform 0.3s; }
        .feature-card:hover { border-color:rgba(232,184,58,0.3); transform:translateY(-4px); }
        .feature-icon { font-size:36px; margin-bottom:20px; }
        .feature-title { font-family:'Oswald',sans-serif; font-size:20px; font-weight:700; color:#fff; margin-bottom:10px; }
        .feature-desc { font-family:'Nunito Sans',sans-serif; font-size:14px; color:rgba(255,255,255,0.45); line-height:1.7; }

        /* HOW IT WORKS */
        .hiw-section { background:#161616; padding:80px 52px; }
        .hiw-steps { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:0; max-width:1200px; margin:0 auto; position:relative; }
        .hiw-steps::before { content:''; position:absolute; top:36px; left:10%; right:10%; height:1px; background:linear-gradient(to right,transparent,rgba(232,184,58,0.3),transparent); z-index:0; }
        .step-card { text-align:center; padding:32px 24px; position:relative; z-index:1; }
        .step-num { font-family:'Oswald',sans-serif; font-size:11px; font-weight:700; letter-spacing:3px; color:rgba(232,184,58,0.5); margin-bottom:16px; }
        .step-icon-wrap { width:72px; height:72px; border-radius:50%; background:#1e1e1e; border:1px solid rgba(232,184,58,0.2); display:flex; align-items:center; justify-content:center; margin:0 auto 20px; font-size:28px; transition:background 0.3s,border-color 0.3s; }
        .step-card:hover .step-icon-wrap { background:rgba(232,184,58,0.1); border-color:rgba(232,184,58,0.5); }
        .step-title { font-family:'Oswald',sans-serif; font-size:18px; font-weight:700; color:#fff; margin-bottom:10px; }
        .step-desc { font-family:'Nunito Sans',sans-serif; font-size:13px; color:rgba(255,255,255,0.4); line-height:1.7; }

        /* STATS */
        .stats-section { background:#0d0d0d; padding:80px 52px; border-top:1px solid rgba(255,255,255,0.05); border-bottom:1px solid rgba(255,255,255,0.05); }
        .stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:40px; max-width:900px; margin:0 auto; }

        /* MENU */
        .menu-section { background:#111; padding:90px 52px; }
        .menu-header { display:flex; align-items:flex-end; justify-content:space-between; margin-bottom:52px; }
        .menu-label { font-family:'Nunito Sans',sans-serif; font-size:11px; font-weight:700; letter-spacing:4px; text-transform:uppercase; color:#E8B83A; margin-bottom:10px; }
        .menu-title { font-family:'Oswald',sans-serif; font-size:40px; font-weight:700; color:#fff; line-height:1.1; }
        .view-all { background:none; border:1px solid rgba(255,255,255,0.2); color:rgba(255,255,255,0.6); cursor:pointer; font-family:'Nunito Sans',sans-serif; font-size:13px; font-weight:600; letter-spacing:0.5px; padding:10px 24px; border-radius:30px; transition:all 0.2s; }
        .view-all:hover { border-color:#E8B83A; color:#E8B83A; }
        .menu-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(270px,1fr)); gap:24px; max-width:1200px; margin:0 auto; }
        .pizza-card { background:#1c1c1c; border-radius:20px; overflow:hidden; border:1px solid rgba(255,255,255,0.06); transition:transform 0.3s,box-shadow 0.3s; cursor:pointer; }
        .pizza-card:hover { transform:translateY(-6px); box-shadow:0 20px 40px rgba(0,0,0,0.4); }
        .pizza-img-wrap { position:relative; overflow:hidden; }
        .pizza-img { width:100%; height:210px; object-fit:cover; display:block; transition:transform 0.5s; }
        .pizza-card:hover .pizza-img { transform:scale(1.07); }
        .pizza-tag { position:absolute; top:14px; left:14px; background:#E8B83A; color:#111; font-family:'Nunito Sans',sans-serif; font-size:11px; font-weight:800; letter-spacing:1px; text-transform:uppercase; padding:4px 12px; border-radius:20px; }
        .pizza-body { padding:20px 22px 22px; }
        .pizza-name { font-family:'Oswald',sans-serif; font-size:20px; font-weight:600; color:#fff; margin-bottom:14px; }
        .pizza-footer { display:flex; align-items:center; justify-content:space-between; }
        .pizza-price { font-family:'Oswald',sans-serif; font-size:24px; font-weight:700; color:#E8B83A; }
        .pizza-price sup { font-size:14px; vertical-align:super; }
        .add-btn { background:#b32d0f; color:#fff; border:none; cursor:pointer; font-family:'Nunito Sans',sans-serif; font-size:13px; font-weight:700; letter-spacing:0.3px; padding:9px 20px; border-radius:30px; transition:background 0.2s,transform 0.15s; }
        .add-btn:hover { background:#961f07; transform:scale(1.05); }

        /* REVIEWS */
        .reviews-section { background:#161616; padding:80px 52px; }
        .reviews-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:20px; max-width:1200px; margin:0 auto; }
        .review-card { background:#1e1e1e; border-radius:18px; padding:28px; border:1px solid rgba(255,255,255,0.06); transition:border-color 0.3s; }
        .review-card:hover { border-color:rgba(232,184,58,0.2); }
        .review-stars { color:#E8B83A; font-size:14px; letter-spacing:2px; margin-bottom:14px; }
        .review-text { font-family:'Nunito Sans',sans-serif; font-size:14px; color:rgba(255,255,255,0.6); line-height:1.75; margin-bottom:20px; font-style:italic; }
        .review-author { display:flex; align-items:center; gap:12px; }
        .review-avatar { width:38px; height:38px; border-radius:50%; background:linear-gradient(135deg,#E8B83A,#b32d0f); display:flex; align-items:center; justify-content:center; font-family:'Oswald',sans-serif; font-size:16px; font-weight:700; color:#fff; flex-shrink:0; }
        .review-name { font-family:'Nunito Sans',sans-serif; font-size:13px; font-weight:700; color:#fff; }
        .review-loc { font-family:'Nunito Sans',sans-serif; font-size:12px; color:rgba(255,255,255,0.3); }

        /* NEWSLETTER */
        .newsletter-section { background:linear-gradient(135deg,#1a0a06 0%,#111 50%,#0d1a0d 100%); padding:80px 52px; position:relative; overflow:hidden; }
        .newsletter-section::before { content:''; position:absolute; top:-100px; right:-100px; width:400px; height:400px; border-radius:50%; background:radial-gradient(circle,rgba(232,184,58,0.07),transparent 70%); pointer-events:none; }
        .newsletter-inner { max-width:600px; margin:0 auto; text-align:center; position:relative; z-index:1; }
        .newsletter-title { font-family:'Oswald',sans-serif; font-size:clamp(32px,4vw,48px); font-weight:700; color:#fff; margin-bottom:12px; }
        .newsletter-sub { font-family:'Nunito Sans',sans-serif; font-size:15px; color:rgba(255,255,255,0.45); margin-bottom:36px; line-height:1.6; }
        .newsletter-form { display:flex; gap:0; border-radius:50px; overflow:hidden; border:1px solid rgba(255,255,255,0.12); background:rgba(255,255,255,0.04); max-width:480px; margin:0 auto; }
        .newsletter-input { flex:1; background:none; border:none; outline:none; padding:16px 24px; font-family:'Nunito Sans',sans-serif; font-size:14px; color:#fff; }
        .newsletter-input::placeholder { color:rgba(255,255,255,0.25); }
        .newsletter-btn { background:#b32d0f; color:#fff; border:none; cursor:pointer; font-family:'Nunito Sans',sans-serif; font-size:13px; font-weight:700; padding:16px 28px; transition:background 0.2s; white-space:nowrap; border-radius:0 50px 50px 0; }
        .newsletter-btn:hover { background:#961f07; }
        .newsletter-success { font-family:'Nunito Sans',sans-serif; font-size:15px; color:#E8B83A; font-weight:600; }

        /* CART */
        .overlay { position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:200; opacity:0; pointer-events:none; transition:opacity 0.3s; }
        .overlay.visible { opacity:1; pointer-events:all; }
        .cart-drawer { position:fixed; top:0; right:0; bottom:0; width:380px; background:#1a1a1a; border-left:1px solid rgba(255,255,255,0.08); z-index:300; display:flex; flex-direction:column; transform:translateX(100%); transition:transform 0.35s cubic-bezier(0.4,0,0.2,1); padding:32px 28px; }
        .cart-drawer.open { transform:translateX(0); }
        .drawer-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:28px; padding-bottom:20px; border-bottom:1px solid rgba(255,255,255,0.08); }
        .drawer-title { font-family:'Oswald',sans-serif; font-size:24px; font-weight:700; color:#fff; }
        .close-btn { background:none; border:none; color:rgba(255,255,255,0.4); font-size:22px; cursor:pointer; transition:color 0.2s; line-height:1; }
        .close-btn:hover { color:#fff; }
        .cart-items { flex:1; overflow-y:auto; }
        .cart-item { display:flex; gap:14px; align-items:center; padding:14px 0; border-bottom:1px solid rgba(255,255,255,0.06); }
        .cart-item img { width:58px; height:58px; object-fit:cover; border-radius:10px; flex-shrink:0; }
        .cart-item-name { font-family:'Nunito Sans',sans-serif; font-size:14px; font-weight:600; color:#fff; }
        .cart-item-sub { font-family:'Nunito Sans',sans-serif; font-size:12px; color:rgba(255,255,255,0.4); margin-top:3px; }
        .cart-item-price { margin-left:auto; font-family:'Oswald',sans-serif; font-size:16px; font-weight:600; color:#E8B83A; flex-shrink:0; }
        .remove-btn { background:none; border:none; color:rgba(255,255,255,0.2); cursor:pointer; font-size:16px; transition:color 0.2s; flex-shrink:0; }
        .remove-btn:hover { color:#b32d0f; }
        .cart-footer { padding-top:24px; border-top:1px solid rgba(255,255,255,0.08); }
        .cart-total-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }
        .cart-total-label { font-family:'Nunito Sans',sans-serif; font-size:14px; color:rgba(255,255,255,0.5); }
        .cart-total-val { font-family:'Oswald',sans-serif; font-size:26px; font-weight:700; color:#fff; }
        .checkout-btn { width:100%; padding:15px; background:#b32d0f; color:#fff; border:none; cursor:pointer; font-family:'Nunito Sans',sans-serif; font-size:15px; font-weight:700; letter-spacing:0.5px; border-radius:40px; transition:background 0.2s; box-shadow:0 6px 20px rgba(179,45,15,0.4); }
        .checkout-btn:hover { background:#961f07; }
        .empty-cart { font-family:'Nunito Sans',sans-serif; color:rgba(255,255,255,0.3); font-size:14px; text-align:center; margin-top:60px; }

        /* FOOTER */
        .footer { background:#0a0a0a; padding:60px 52px 32px; border-top:1px solid rgba(255,255,255,0.06); }
        .footer-top { display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:48px; margin-bottom:48px; }
        .footer-brand-desc { font-family:'Nunito Sans',sans-serif; font-size:13px; color:rgba(255,255,255,0.3); line-height:1.8; margin-top:14px; max-width:260px; }
        .footer-col-title { font-family:'Oswald',sans-serif; font-size:14px; font-weight:700; color:#fff; letter-spacing:1px; text-transform:uppercase; margin-bottom:18px; }
        .footer-links { list-style:none; display:flex; flex-direction:column; gap:10px; }
        .footer-links li { font-family:'Nunito Sans',sans-serif; font-size:13px; color:rgba(255,255,255,0.35); cursor:pointer; transition:color 0.2s; }
        .footer-links li:hover { color:#E8B83A; }
        .footer-bottom { display:flex; justify-content:space-between; align-items:center; padding-top:28px; border-top:1px solid rgba(255,255,255,0.06); }
        .footer-copy { font-family:'Nunito Sans',sans-serif; font-size:12px; color:rgba(255,255,255,0.18); }
        .footer-logo { font-family:'Oswald',sans-serif; font-size:22px; font-weight:700; color:#E8B83A; }

        @media (max-width:768px) {
          .nav { padding:20px 24px; }
          .nav-links { display:none; }
          .hero-content { justify-content:center; padding:0 24px; text-align:center; }
          .social-bar { display:none; }
          .deals-section,.features-section,.hiw-section,.stats-section,.menu-section,.reviews-section,.newsletter-section { padding:60px 24px; }
          .hiw-steps::before { display:none; }
          .stats-grid { grid-template-columns:repeat(2,1fr); }
          .footer-top { grid-template-columns:1fr; }
          .footer { padding:48px 24px 24px; }
          .footer-bottom { flex-direction:column; gap:12px; }
          .cart-drawer { width:100%; }
        }
      `}</style>

      {/* LOADING SCREEN */}
      <div className={`loader ${!loading ? 'done' : ''}`}>
        <div className="loader-logo">pizzafly.</div>
        <div className="loader-bar-bg"><div className="loader-bar" style={{ width: `${loadPct}%` }} /></div>
        <div className="loader-pct">{Math.round(loadPct)}%</div>
      </div>

      {/* CART OVERLAY */}
      <div className={`overlay ${cartOpen ? 'visible' : ''}`} onClick={() => setCartOpen(false)} />

      {/* CART DRAWER */}
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
            ))}
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
        <nav className="nav">
          <div className="logo">pizzafly.</div>
          <ul className="nav-links">
            {['Home', 'Menu', 'Delivery', 'About Us'].map(link => (
              <li key={link} className={activeNav === link ? 'active' : ''} onClick={() => setActiveNav(link)}>{link}</li>
            ))}
          </ul>
          <div className="nav-icons">
            <button className="nav-icon">
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="22" y2="22" /></svg>
            </button>
            <button className="nav-icon cart-wrap" onClick={() => setCartOpen(true)}>
              <svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </button>
            <button className="nav-icon">
              <svg viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </button>
          </div>
        </nav>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Less Waiting.<br />More Eating.</h1>
            <button className="hero-cta" onClick={() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' })}>
              Explore our Menu
            </button>
          </div>
        </div>
        <div className="social-bar">
          <div className="social-line" />
          <button className="social-btn">f</button>
          <button className="social-btn">◎</button>
          <button className="social-btn">𝕏</button>
          <div className="social-line" />
        </div>
      </section>

      {/* ===== SPECIAL OFFERS ===== */}
      <section className="deals-section">
        {deals.map(deal => (
          <div className="deal-card" key={deal.id}>
            <div className="deal-img-wrap">
              <img src={deal.image} alt={deal.title} className="deal-img" />
            </div>
            <div className="deal-body">
              <span className="deal-badge" style={{ background: deal.color + '22', color: deal.color }}>{deal.badge}</span>
              <div className="deal-title">{deal.title}</div>
              <div className="deal-desc">{deal.desc}</div>
              <div className="deal-arrow">→</div>
            </div>
          </div>
        ))}
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="features-section">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="section-label">Why pizzafly</div>
          <h2 className="section-title">Built Different</h2>
          <div className="features-grid">
            {features.map((f, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="hiw-section">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="section-label" style={{ justifyContent: 'center', display: 'flex' }}>Simple process</div>
            <h2 className="section-title" style={{ fontSize: 'clamp(28px,4vw,40px)' }}>How It Works</h2>
          </div>
          <div className="hiw-steps">
            {steps.map((s, i) => (
              <div className="step-card" key={i}>
                <div className="step-num">{s.num}</div>
                <div className="step-icon-wrap">{s.icon}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="stats-section" ref={statsRef}>
        <div className="stats-grid">
          <StatItem value={48200} suffix="+" label="Orders Delivered" start={statsVisible} />
          <StatItem value={12400} suffix="+" label="Happy Customers" start={statsVisible} />
          <StatItem value={98} suffix="%" label="Satisfaction Rate" start={statsVisible} />
          <StatItem value={30} suffix="min" label="Avg. Delivery Time" start={statsVisible} />
        </div>
      </section>

      {/* ===== MENU ===== */}
      <section className="menu-section" id="menu">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
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

      {/* ===== REVIEWS ===== */}
      <section className="reviews-section">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="section-label">What people say</div>
          <h2 className="section-title">Customer Love ❤️</h2>
          <div className="reviews-grid">
            {reviews.map((r, i) => (
              <div className="review-card" key={i}>
                <div className="review-stars">{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</div>
                <div className="review-text">"{r.text}"</div>
                <div className="review-author">
                  <div className="review-avatar">{r.name[0]}</div>
                  <div>
                    <div className="review-name">{r.name}</div>
                    <div className="review-loc">{r.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="newsletter-section">
        <div className="newsletter-inner">
          <div className="section-label" style={{ justifyContent: 'center', display: 'flex', marginBottom: 12 }}>Stay in the loop</div>
          <h2 className="newsletter-title">Get Deals Before<br />Everyone Else</h2>
          <p className="newsletter-sub">Join 10,000+ pizza lovers. Get exclusive offers, new menu drops, and weekly deals straight to your inbox.</p>
          {subscribed
            ? <div className="newsletter-success">🎉 You're in! Check your inbox for a welcome gift.</div>
            : (
              <div className="newsletter-form">
                <input className="newsletter-input" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && email && setSubscribed(true)} />
                <button className="newsletter-btn" onClick={() => email && setSubscribed(true)}>Subscribe</button>
              </div>
            )}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="footer-top">
          <div>
            <div className="footer-logo">pizzafly.</div>
            <div className="footer-brand-desc">Handcrafted pizzas delivered fast. Made with love, fired in a real oven, shipped to your door.</div>
          </div>
          <div>
            <div className="footer-col-title">Menu</div>
            <ul className="footer-links">
              {['Classics', 'Specialties', 'Vegan', 'Sides & Drinks', 'Desserts'].map(l => <li key={l}>{l}</li>)}
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Company</div>
            <ul className="footer-links">
              {['About Us', 'Careers', 'Press', 'Blog', 'Contact'].map(l => <li key={l}>{l}</li>)}
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Support</div>
            <ul className="footer-links">
              {['Track Order', 'FAQ', 'Returns', 'Privacy Policy', 'Terms'].map(l => <li key={l}>{l}</li>)}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© 2025 pizzafly — Shipped with ❤️</div>
          <div style={{ display: 'flex', gap: 20 }}>
            {['f', '◎', '𝕏'].map((s, i) => (
              <button key={i} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', width: 34, height: 34, borderRadius: '50%', transition: 'all 0.2s', fontFamily: 'sans-serif', fontSize: 14 }}
                onMouseEnter={e => { e.target.style.borderColor = '#E8B83A'; e.target.style.color = '#E8B83A' }}
                onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.color = 'rgba(255,255,255,0.3)' }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}