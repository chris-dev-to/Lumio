import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Zap, 
  Shield, 
  Battery, 
  Magnet, 
  ChevronRight, 
  Menu, 
  X, 
  Star,
  Lightbulb,
  RotateCcw,
  Eye,
  ArrowLeft,
  Mail,
  MapPin,
  Phone,
  Orbit,
  ShoppingCart,
  CheckCircle2,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  CreditCard
} from 'lucide-react';

// --- Types ---

interface Product {
  id: string;
  name: string;
  tagline: string;
  price: number;
  image: string;
  features: string[];
}

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

// --- Context ---

const CartContext = React.createContext<CartContextType | undefined>(undefined);

const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const context = React.useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

// --- Utils ---

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-lumio-black/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <Orbit className="w-8 h-8 text-lumio-neon relative z-10 group-hover:rotate-180 transition-transform duration-700 animate-pulse" />
            <div className="absolute inset-0 bg-lumio-neon/40 blur-lg rounded-full animate-pulse" />
          </div>
          <span className="text-2xl font-bold tracking-tighter text-white">LUMIO</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-white/70 hover:text-lumio-neon transition-colors">Home</Link>
          <Link to="/shop" className="text-sm font-medium text-white/70 hover:text-lumio-neon transition-colors">Shop</Link>
          <Link to="/about" className="text-sm font-medium text-white/70 hover:text-lumio-neon transition-colors">About</Link>
          
          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative p-2 text-white/70 hover:text-lumio-neon transition-colors">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-lumio-neon text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button 
              onClick={() => navigate('/shop')}
              className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-lumio-neon hover:text-white transition-all duration-300"
            >
              Shop Now
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <Link to="/cart" className="relative p-2 text-white/70">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-lumio-neon text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <button className="text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-lumio-charcoal border-b border-white/5 p-6 flex flex-col gap-4 md:hidden"
          >
            <Link to="/" className="text-lg font-medium text-white/70" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/shop" className="text-lg font-medium text-white/70" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
            <Link to="/about" className="text-lg font-medium text-white/70" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
            <button 
              onClick={() => { navigate('/shop'); setIsMobileMenuOpen(false); }}
              className="bg-lumio-neon text-white px-5 py-3 rounded-xl text-center font-semibold"
            >
              Shop Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="bg-lumio-charcoal pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-6 cursor-pointer group">
              <div className="relative">
                <Orbit className="w-6 h-6 text-lumio-neon relative z-10 group-hover:rotate-180 transition-transform duration-700 animate-pulse" />
                <div className="absolute inset-0 bg-lumio-neon/40 blur-md rounded-full animate-pulse" />
              </div>
              <span className="text-xl font-bold tracking-tighter text-white">LUMIO</span>
            </Link>
            <p className="text-white/40 max-w-sm mb-8">
              Redefining ambient lighting for the modern era. Curating the world's most advanced desk and room lighting solutions.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold mb-6 text-white">Company</h4>
              <ul className="space-y-4 text-sm text-white/40">
                <li><Link to="/about" className="hover:text-white transition-colors">About Lumio</Link></li>
                <li><Link to="/sustainability" className="hover:text-white transition-colors">Sustainability</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            <div className="flex flex-col justify-end items-end text-right">
               <p className="text-xs text-white/20 uppercase tracking-widest font-bold">© LUMIO LIGHTING INC.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Pages ---

const HomePage = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-lumio-neon/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-lumio-blue/20 rounded-full blur-[120px]" />
        
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-lumio-neon font-bold tracking-[0.3em] uppercase text-sm mb-4">Desk & Room Lighting</p>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight mb-6 text-white">
              Light, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lumio-neon to-lumio-blue text-glow">Perfected.</span>
            </h1>
            <p className="text-xl text-white/60 max-w-md mb-8 leading-relaxed">
              Minimal, futuristic lighting for your modern workspace. Designed for clarity, focus, and inspiration.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => navigate('/shop')}
                className="bg-lumio-neon text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform glow-neon"
              >
                Shop Collection <ChevronRight size={20} />
              </button>
              <button 
                onClick={() => navigate('/about')}
                className="border border-white/10 bg-white/5 backdrop-blur-sm text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors"
              >
                Our Vision
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden border border-white/10 bg-lumio-charcoal/50 backdrop-blur-sm p-4">
              <img 
                src="https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=1000" 
                alt="Lumio Orbit" 
                className="w-full h-auto rounded-2xl shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-8 left-8 right-8 bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-1">Status</p>
                  <p className="text-sm font-semibold flex items-center gap-2 text-white">
                    <span className="w-2 h-2 bg-lumio-neon rounded-full animate-pulse" /> Active Ambient
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-1 text-white">Model</p>
                  <p className="text-sm font-semibold text-white">Orbit Gen-2</p>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-lumio-neon/30 blur-[100px] -z-10 animate-pulse" />
          </motion.div>
        </div>
      </section>

      <section className="py-32 bg-lumio-charcoal/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-white">The Lumio Standard</h2>
            <p className="text-white/50 max-w-2xl mx-auto">Every piece in our collection is a sculptural masterpiece that redefines how you interact with light.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <RotateCcw className="text-lumio-neon" />, title: "Precision Design", desc: "Minimalist forms that complement any modern environment." },
              { icon: <Zap className="text-lumio-blue" />, title: "Smart Tech", desc: "Gesture controls and circadian-adaptive spectrums." },
              { icon: <Shield className="text-lumio-neon" />, title: "Built to Last", desc: "Premium materials and sustainable manufacturing." }
            ].map((f, i) => (
              <div key={i} className="p-10 rounded-[40px] bg-white/5 border border-white/5 hover:border-lumio-neon/30 transition-all">
                <div className="mb-6 p-4 bg-white/5 rounded-2xl w-fit">{f.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-white">{f.title}</h3>
                <p className="text-white/40 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto rounded-[60px] bg-gradient-to-br from-lumio-neon to-lumio-blue p-12 md:p-24 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 relative z-10 text-white">Experience the <br />future of light.</h2>
          <button 
            onClick={() => navigate('/shop')}
            className="bg-white text-black px-10 py-5 rounded-full font-bold text-lg hover:scale-105 transition-transform relative z-10 shadow-2xl"
          >
            Shop Lumio Collection
          </button>
        </motion.div>
      </section>
    </>
  );
};

const ShopPage = () => {
  const { addToCart } = useCart();
  const [showToast, setShowToast] = useState<string | null>(null);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setShowToast(product.name);
    setTimeout(() => setShowToast(null), 3000);
  };

  const products: Product[] = [
    {
      id: 'orbit',
      name: 'Lumio Orbit',
      tagline: 'Signature Desk Lamp',
      price: 249,
      image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=1000',
      features: ['360° Magnetic Rotation', 'Gesture Control', 'Wireless Power']
    },
    {
      id: 'beam',
      name: 'Lumio Beam',
      tagline: 'Monitor Light Bar',
      price: 129,
      image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=1000',
      features: ['Asymmetric Optics', 'Auto-Dimming', 'Touch Controls']
    },
    {
      id: 'pulse',
      name: 'Lumio Pulse',
      tagline: 'Ambient Room Light',
      price: 189,
      image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=1000',
      features: ['16M Colors', 'Music Sync', 'App Integration']
    }
  ];

  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-white">The Collection.</h1>
          <p className="text-xl text-white/50 max-w-2xl leading-relaxed">
            Explore our curated range of futuristic lighting solutions designed to transform your workspace and home.
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((p) => (
            <motion.div 
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="group bg-white/5 border border-white/5 rounded-[40px] overflow-hidden hover:border-lumio-neon/30 transition-all"
            >
              <div className="aspect-[4/5] overflow-hidden relative">
                <img 
                  src={p.image} 
                  alt={p.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                  <p className="text-sm font-bold text-white">${p.price}</p>
                </div>
              </div>
              <div className="p-10">
                <p className="text-lumio-neon text-xs font-bold uppercase tracking-widest mb-2">{p.tagline}</p>
                <h2 className="text-3xl font-bold mb-6 text-white">{p.name}</h2>
                <ul className="space-y-3 mb-8">
                  {p.features.map((f, i) => (
                    <li key={i} className="text-sm text-white/40 flex items-center gap-2">
                      <div className="w-1 h-1 bg-lumio-neon rounded-full" /> {f}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => handleAddToCart(p)}
                  className="w-full bg-white text-black py-4 rounded-2xl font-bold hover:bg-lumio-neon hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} /> Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-10 left-1/2 z-50 bg-lumio-neon text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20 backdrop-blur-xl"
          >
            <CheckCircle2 size={20} />
            <p className="font-bold">{showToast} added to cart</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      clearCart();
      setIsCheckingOut(false);
      alert('Order placed successfully! Thank you for shopping with Lumio.');
      navigate('/');
    }, 2000);
  };

  if (cart.length === 0) {
    return (
      <div className="pt-48 pb-20 px-6 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingCart size={40} className="text-white/20" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Your cart is empty.</h1>
          <p className="text-white/40 mb-10">Looks like you haven't added any futuristic light to your space yet.</p>
          <button 
            onClick={() => navigate('/shop')}
            className="bg-lumio-neon text-white px-10 py-4 rounded-full font-bold hover:scale-105 transition-transform"
          >
            Explore Collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-12 text-white">Your Cart.</h1>
        
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="bg-white/5 border border-white/5 rounded-3xl p-6 flex flex-col sm:flex-row gap-6 items-center">
                <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
                  <p className="text-lumio-neon text-sm mb-4">{item.tagline}</p>
                  <div className="flex items-center justify-center sm:justify-start gap-4">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/5"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-white font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/5"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <p className="text-xl font-bold text-white mb-4">${item.price * item.quantity}</p>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-white/20 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white/5 border border-white/5 rounded-[40px] p-10 h-fit sticky top-32">
            <h2 className="text-2xl font-bold text-white mb-8">Order Summary</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-white/40">
                <span>Subtotal</span>
                <span>${cartTotal}</span>
              </div>
              <div className="flex justify-between text-white/40">
                <span>Shipping</span>
                <span className="text-lumio-neon">Free</span>
              </div>
              <div className="pt-4 border-t border-white/5 flex justify-between text-xl font-bold text-white">
                <span>Total</span>
                <span>${cartTotal}</span>
              </div>
            </div>
            <button 
              disabled={isCheckingOut}
              onClick={handleCheckout}
              className="w-full bg-lumio-neon text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:scale-100"
            >
              {isCheckingOut ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Checkout <ArrowRight size={20} />
                </>
              )}
            </button>
            <div className="mt-6 flex items-center justify-center gap-2 text-white/20 text-xs uppercase tracking-widest font-bold">
              <CreditCard size={14} /> Secure Payment
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AboutPage = () => {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-12 text-white">Our Vision.</h1>
        <div className="space-y-8 text-xl text-white/60 leading-relaxed">
          <p>
            At Lumio, we believe that light is more than just a utility—it's an experience. Our mission is to redefine how people interact with their environments by selecting the world's most minimalist, futuristic lighting.
          </p>
          <p>
            We look for precision engineering and sculptural aesthetics to curate products that are as beautiful as they are functional. Our philosophy is rooted in the belief that technology should be invisible, intuitive, and inspiring.
          </p>
          <div className="py-12">
            <img 
              src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1000" 
              alt="Studio" 
              className="rounded-[40px] border border-white/10"
              referrerPolicy="no-referrer"
            />
          </div>
          <p>
            Our team of curators works tirelessly to find products that push the boundaries of what's possible. From gesture-controlled desk lamps to circadian-adaptive room lighting, we are shaping the future of light, one selection at a time.
          </p>
        </div>
      </div>
    </div>
  );
};

const SustainabilityPage = () => {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-12 text-white">Sustainability.</h1>
        <div className="space-y-12">
          <div className="grid md:grid-cols-1 max-w-2xl mx-auto">
            <div className="p-10 rounded-[40px] bg-white/5 border border-white/5">
              <h2 className="text-2xl font-bold mb-4 text-white">Eco-Friendly Selection</h2>
              <p className="text-white/50 leading-relaxed">We carefully curate our collection to include only products that meet rigorous environmental standards, prioritizing low-impact manufacturing and long-term durability.</p>
            </div>
          </div>
          <div className="text-xl text-white/60 leading-relaxed space-y-8">
            <p>
              At Lumio, we believe that the most sustainable product is the one that never needs to be replaced. Our curation process focuses on timeless design and exceptional build quality, ensuring that every piece we select becomes a permanent fixture in your home.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactPage = () => {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-12 text-white">Contact Us.</h1>
        <div className="grid md:grid-cols-2 gap-20">
          <div className="space-y-12">
            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-2xl bg-lumio-neon/10 flex items-center justify-center text-lumio-neon">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-white">Email</h3>
                <p className="text-white/50">hello@lumio.tech</p>
              </div>
            </div>
          </div>
          
          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-white/40">Name</label>
              <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-lumio-neon outline-none transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-white/40">Email</label>
              <input type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-lumio-neon outline-none transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-white/40">Message</label>
              <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-lumio-neon outline-none transition-colors" />
            </div>
            <button className="w-full bg-lumio-neon text-white py-4 rounded-2xl font-bold hover:scale-105 transition-transform">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const PrivacyPage = () => {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-12 text-white">Privacy Policy.</h1>
        <div className="space-y-8 text-lg text-white/50 leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.</p>
          </section>
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">2. How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
          </section>
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">3. Data Security</h2>
            <p>We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="min-h-screen bg-lumio-black selection:bg-lumio-neon/30">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/sustainability" element={<SustainabilityPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/cart" element={<CartPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}
