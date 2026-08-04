import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../lib/api';
import StoreNavbar from '../../components/storefront/StoreNavbar';
import StoreFooter from '../../components/storefront/StoreFooter';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Verification token is missing.');
      return;
    }

    const verifyEmail = async () => {
      try {
        await api.get(`/api/auth/verify/${token}`);
        setStatus('success');
        setMessage('Your email has been verified successfully. You can now log in.');
      } catch (error) {
        console.error('Email verification failed:', error);
        setStatus('error');
        const errorMsg = error?.response?.data?.message || 'Verification failed. Please try again.';
        setMessage(errorMsg);
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#f4f4f5] font-body text-slate-900 pb-24 flex flex-col">
      <StoreNavbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-slate-200 max-w-lg w-full text-center">
          {status === 'verifying' && (
            <div className="flex flex-col items-center py-10">
              <Loader2 size={48} className="text-zibah-stores animate-spin mb-6" />
              <h2 className="text-2xl font-display font-bold mb-2">Verifying Email</h2>
              <p className="text-slate-500">Please wait while we confirm your email address.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
                <CheckCircle size={40} />
              </div>
              <h2 className="text-3xl font-display font-bold mb-2 text-slate-900">Email Verified!</h2>
              <p className="text-slate-500 mb-8 leading-relaxed">{message}</p>
              <Link
                to="/"
                className="w-full py-4 rounded-2xl font-bold text-zibah-stores bg-zibah-gold hover:bg-[#e5bc45] shadow-sm flex items-center justify-center gap-2 text-lg transition-colors"
              >
                Go to Login
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center py-10">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                <AlertCircle size={40} />
              </div>
              <h2 className="text-2xl font-display font-bold mb-2">Verification Failed</h2>
              <p className="text-slate-500 mb-8">{message}</p>
              <Link to="/" className="text-zibah-stores font-bold hover:underline">Return Home</Link>
            </div>
          )}
        </div>
      </div>
      <StoreFooter />
    </div>
  );
};

export default VerifyEmail;
