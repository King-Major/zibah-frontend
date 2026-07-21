import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingBag, User } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore'; // Zustand Import
import { useAuthStore } from '../../store/useAuthStore';
import logo from '../../assets/42-cropped.png';

const StoreNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { token, openAuthModal, setLogout } = useAuthStore();
  
  // Zustand State
  const toggleCart = useCartStore((state) => state.toggleCart);
  const cartItems = useCartStore((state) => state.cartItems);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      {/* 📱 MOBILE NAVIGATION */}
      <div className="md:hidden flex items-center justify-between p-5 bg-white/90 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <Link to="/" className="flex items-center h-10">
          <img 
            src={logo} 
            alt="Zibah logo" 
            className="h-full w-auto object-contain" 
          />
        </Link>
        <div className="flex items-center gap-4">
          <button onClick={toggleCart} className="relative text-slate-800">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-zibah-gold text-zibah-stores text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="p-2 -mr-2 text-slate-900 bg-slate-100 rounded-full active:bg-slate-200 transition-colors"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* 📱 MOBILE MENU DROPDOWN */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[69px] bg-zibah-light z-40 p-4 flex flex-col gap-3 overflow-y-auto font-body">
          <div className="bg-white rounded-3xl p-6 flex flex-col gap-4 shadow-sm border border-slate-200">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">Home</Link>
            {/* <Link to="/categories" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">Collection</Link> */}
            <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-slate-800 pb-1">About Zibah</Link>
          </div>
          <div className="flex flex-col gap-3 mt-2">
            {token ? (
              <>
                <Link to="/account" onClick={() => setIsMenuOpen(false)} className="py-4 rounded-2xl font-bold text-slate-800 bg-white border border-slate-200 shadow-sm active:bg-slate-50 text-lg flex items-center justify-center gap-2 whitespace-nowrap">
                  <User size={20} /> My Account
                </Link>
                <button onClick={() => { setLogout(); setIsMenuOpen(false); }} className="py-4 rounded-2xl font-bold text-red-500 bg-white border border-slate-200 shadow-sm active:bg-slate-50 text-lg flex items-center justify-center gap-2 whitespace-nowrap">
                  Sign Out
                </button>
              </>
            ) : (
              <button onClick={() => { openAuthModal(); setIsMenuOpen(false); }} className="py-4 rounded-2xl font-bold text-slate-800 bg-white border border-slate-200 shadow-sm active:bg-slate-50 text-lg flex items-center justify-center gap-2 whitespace-nowrap">
                <User size={20} /> Sign In
              </button>
            )}
            <button onClick={() => setIsMenuOpen(false)} className="py-4 rounded-2xl font-bold text-zibah-stores bg-zibah-gold shadow-lg active:bg-[#e5bc45] text-lg">
              Start Shopping
            </button>
          </div>
        </div>
      )}

      {/* 💻 DESKTOP FLOATING NAVIGATION */}
      <nav className="hidden md:flex fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-white/80 backdrop-blur-xl border border-white rounded-full px-8 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] items-center gap-10 font-body">
        <Link to="/" className="flex items-center mr-4 h-10">
          <img 
            src={logo} 
            alt="Zibah logo" 
            className="h-full w-auto object-contain" 
          />
        </Link>
        <Link to="/" className="text-sm font-semibold text-slate-800 hover:text-zibah-gold transition-colors">Home</Link>
        {/* <Link to="/categories" className="text-sm font-semibold text-slate-600 hover:text-zibah-gold transition-colors">Collection</Link> */}
        <Link to="/about" className="text-sm font-semibold text-slate-600 hover:text-zibah-gold transition-colors whitespace-nowrap">About Us</Link>
        
        <div className="flex items-center gap-4 ml-4 pl-8 border-l border-slate-200">
          <button onClick={toggleCart} className="relative text-slate-800 hover:text-zibah-gold transition-colors">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-zibah-gold text-zibah-stores text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          
          {token ? (
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-slate-200">
                <Link 
                  to="/account" 
                  className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-zibah-stores shadow-md hover:shadow-lg hover:bg-zibah-stores/90 transition-all whitespace-nowrap"
                >
                  My Account
                </Link>
                <button 
                  onClick={setLogout} 
                  className="px-5 py-2.5 rounded-full text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors whitespace-nowrap"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button 
                onClick={openAuthModal} 
                className="ml-4 px-8 py-2.5 rounded-full text-sm font-bold text-zibah-stores bg-zibah-gold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all whitespace-nowrap"
              >
                Sign In
              </button>
            )}
        </div>
      </nav>
    </>
  );
};

export default StoreNavbar;