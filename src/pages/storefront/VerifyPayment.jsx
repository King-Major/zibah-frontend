import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../../lib/api';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { Loader2, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import StoreNavbar from '../../components/storefront/StoreNavbar';
import StoreFooter from '../../components/storefront/StoreFooter';

const VerifyPayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [orderDetails, setOrderDetails] = useState(null);
  
  // Use a ref to prevent strict mode from verifying twice in dev
  const hasVerified = useRef(false); 

  useEffect(() => {
    const reference = searchParams.get('reference');
    
    if (!reference || !token) {
      navigate('/');
      return;
    }

    const verifyTransaction = async () => {
      if (hasVerified.current) return;
      hasVerified.current = true;

      try {
        const res = await api.post(
          '/api/checkout/verify',
          { reference },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setOrderDetails(res.data.order);
        setStatus('success');
        
        // CLEAR THE CART using Zustand
        useCartStore.setState({ cartItems: [], isCartOpen: false });

      } catch (error) {
        console.error('Verification failed:', error);
        setStatus('error');
      }
    };

    verifyTransaction();
  }, [searchParams, token, navigate]);

  return (
    <div className="min-h-screen bg-[#f4f4f5] font-body text-slate-900 pb-24 flex flex-col">
      <StoreNavbar />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-slate-200 max-w-lg w-full text-center">
          
          {status === 'verifying' && (
            <div className="flex flex-col items-center py-10">
              <Loader2 size={48} className="text-zibah-stores animate-spin mb-6" />
              <h2 className="text-2xl font-display font-bold mb-2">Verifying Payment</h2>
              <p className="text-slate-500">Please wait while we confirm your transaction with Paystack...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
                <CheckCircle size={40} />
              </div>
              <h2 className="text-3xl font-display font-bold mb-2 text-slate-900">Payment Successful!</h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Thank you for your purchase. Your order <span className="font-bold text-slate-900">#{orderDetails?.id}</span> has been confirmed. 
                If you purchased digital items, check your email for the download links.
              </p>
              
              <Link 
                to="/categories"
                className="w-full py-4 rounded-2xl font-bold text-zibah-stores bg-zibah-gold hover:bg-[#e5bc45] shadow-sm flex items-center justify-center gap-2 text-lg transition-colors"
              >
                Continue Shopping <ArrowRight size={20} />
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center py-10">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                <AlertCircle size={40} />
              </div>
              <h2 className="text-2xl font-display font-bold mb-2">Verification Failed</h2>
              <p className="text-slate-500 mb-8">We could not verify this transaction. Please contact support if you were charged.</p>
              <Link to="/checkout" className="text-zibah-stores font-bold hover:underline">Return to Checkout</Link>
            </div>
          )}

        </div>

        <StoreFooter />
      </div>
    </div>
  );
};

export default VerifyPayment;