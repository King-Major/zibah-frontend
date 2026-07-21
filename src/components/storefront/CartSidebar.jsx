import { X, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore'; // Zustand Import
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';


const CartSidebar = () => {
  // Zustand State
  const { isCartOpen, closeCart, cartItems, removeFromCart } = useCartStore();
  
  const { token, openAuthModal } = useAuthStore();
  // Calculate total price dynamically
  const cartTotal = cartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);

  const navigate = useNavigate();


  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Sidebar Drawer */}
      <div className={`
        fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[70] shadow-2xl flex flex-col font-body transform transition-transform duration-300 ease-in-out
        ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
            <ShoppingBag size={20} className="text-zibah-stores" /> Your Bag
          </h2>
          <button 
            onClick={closeCart}
            className="p-2 text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-2">
                <ShoppingBag size={32} />
              </div>
              <p className="text-slate-500 font-medium text-lg">Your bag is empty.</p>
              <button 
                onClick={closeCart}
                className="text-sm font-bold text-zibah-stores uppercase tracking-widest hover:text-zibah-gold transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 border border-slate-100 p-3 rounded-2xl bg-slate-50/50">
                  <div className="w-20 h-20 bg-white rounded-xl overflow-hidden border border-slate-100 flex-shrink-0">
                    <img src={item.primary_image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.category_name}</p>
                      <h3 className="font-display font-semibold text-slate-900 leading-tight line-clamp-1">{item.name}</h3>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-zibah-stores text-sm">₦{parseFloat(item.price).toLocaleString()}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-200">Qty: {item.quantity}</span>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer / Checkout */}
        {cartItems.length > 0 && (
          <div className="border-t border-slate-100 p-6 bg-slate-50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 font-medium">Subtotal</span>
              <span className="text-2xl font-bold text-slate-900">₦{cartTotal.toLocaleString()}</span>
            </div>
            <p className="text-xs text-slate-400 mb-6 text-center">Delivery fees are calculated at checkout.</p>
           <button 
                onClick={() => {
                    if (!token) {
                    closeCart();
                    openAuthModal();
                    } else {
                    closeCart();
                    navigate('/checkout');
                    }
                }}
                className="w-full py-4 rounded-2xl font-bold text-white bg-zibah-stores hover:bg-zibah-stores/90 shadow-lg flex items-center justify-center gap-2 text-lg transition-colors"
                >
                {token ? 'Proceed to Checkout' : 'Sign in to Checkout'} <ArrowRight size={20} />
                </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;