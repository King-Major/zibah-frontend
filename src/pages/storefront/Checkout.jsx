import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { MapPin, Lock, Loader2, ArrowRight } from 'lucide-react';
import StoreNavbar from '../../components/storefront/StoreNavbar';
import StoreFooter from '../../components/storefront/StoreFooter';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, closeCart } = useCartStore();
  const { token } = useAuthStore();

  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);

  const cartTotal = cartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  const deliveryFee = selectedLocation ? parseFloat(selectedLocation.added_fee) : 0;
  const grandTotal = cartTotal + deliveryFee;

  // Enforce Auth and Cart State
  useEffect(() => {
    closeCart(); // Close sidebar if it was open
    if (!token) {
      navigate('/');
    }
    if (cartItems.length === 0) {
      navigate('/categories');
    }
  }, [token, cartItems, navigate, closeCart]);

  // Fetch Pickup Locations from PostgreSQL
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await api.get('/api/checkout/locations');
        setLocations(res.data);
        if (res.data.length > 0) {
          setSelectedLocation(res.data[0]); // Default to first location
        }
      } catch (error) {
        console.error('Failed to fetch locations:', error);
      } finally {
        setLoadingLocations(false);
      }
    };
    fetchLocations();
  }, []);

 const handlePaystackCheckout = async () => {
    if (!selectedLocation) return;
    setIsInitializing(true);

    try {
      // 1. Send BOTH the location and the cart items to the backend
      const res = await api.post(
        '/api/checkout/initialize',
        { 
          location_id: selectedLocation.id,
          cartItems: cartItems.map(item => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price // Sending price just in case your backend expects it, though backend should ideally query the DB for security
          }))
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2. Redirect the user to the secure Paystack URL
      window.location.href = res.data.authorization_url;
      
    } catch (error) {
      console.error('Checkout initialization failed:', error);
      // Log the specific backend error message to the alert so we can see exactly what failed
      const errorMsg = error.response?.data?.message || 'Failed to initialize payment. Please try again.';
      alert(`Error: ${errorMsg}`);
      setIsInitializing(false);
    }
  };

  if (!token || cartItems.length === 0) return null;

  return (
    <div className="min-h-screen bg-[#f4f4f5] font-body text-slate-900 pb-24">
      <StoreNavbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-16">
        <h1 className="text-3xl font-display font-bold mb-8 text-center md:text-left">Secure Checkout</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Delivery & Items */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Location Selector */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-zibah-stores" /> Select Pickup Location
              </h2>
              
              {loadingLocations ? (
                <div className="animate-pulse h-16 bg-slate-100 rounded-2xl w-full"></div>
              ) : (
                <div className="grid gap-3">
                  {locations.map((loc) => (
                    <label 
                      key={loc.id} 
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-colors ${
                        selectedLocation?.id === loc.id ? 'border-zibah-stores bg-zibah-stores/5' : 'border-slate-100 hover:border-slate-200 bg-white'
                      }`}
                      onClick={() => setSelectedLocation(loc)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedLocation?.id === loc.id ? 'border-zibah-stores' : 'border-slate-300'
                        }`}>
                          {selectedLocation?.id === loc.id && <div className="w-2.5 h-2.5 bg-zibah-stores rounded-full"></div>}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{loc.name}</p>
                          <p className="text-xs text-slate-500">{loc.address}</p>
                        </div>
                      </div>
                      <span className="font-bold text-zibah-stores text-sm">+₦{parseFloat(loc.added_fee).toLocaleString()}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold mb-6">Order Items</h2>
              <div className="space-y-4 divide-y divide-slate-100">
                {cartItems.map((item) => (
                  <div key={item.id} className="pt-4 first:pt-0 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
                        <img src={item.primary_image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-display font-semibold text-slate-900 text-sm line-clamp-1">{item.name}</p>
                        <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 text-sm">
                      ₦{(parseFloat(item.price) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Payment Details */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 sticky top-32">
              <h2 className="text-lg font-bold mb-6">Payment Summary</h2>
              
              <div className="space-y-4 text-sm mb-6 pb-6 border-b border-slate-100">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">₦{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Pickup Fee</span>
                  <span className="font-semibold text-slate-900">₦{deliveryFee.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-8">
                <span className="text-slate-900 font-bold">Total</span>
                <span className="text-2xl font-black text-zibah-stores">₦{grandTotal.toLocaleString()}</span>
              </div>

              <p className="text-[10px] text-slate-400 text-center mb-4 flex items-center justify-center gap-1">
                <Lock size={12} /> Secure encrypted payment via Paystack
              </p>

              <button 
                onClick={handlePaystackCheckout}
                disabled={isInitializing || !selectedLocation}
                className="w-full py-4 rounded-2xl font-bold text-white bg-zibah-stores hover:bg-zibah-stores/90 shadow-lg flex items-center justify-center gap-2 text-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isInitializing ? <Loader2 size={20} className="animate-spin" /> : 'Pay Now'} <ArrowRight size={20} />
              </button>
            </div>
          </div>

        </div>

        <StoreFooter />
      </div>
    </div>
  );
};

export default Checkout;