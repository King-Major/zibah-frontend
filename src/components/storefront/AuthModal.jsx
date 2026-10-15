import { useState } from 'react';
import api from '../../lib/api';
import { X, UserRound, Phone, Mail, Lock, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, setLogin } = useAuthStore();
  
  const [view, setView] = useState('login'); // 'login' | 'register' | 'success'
  const [name, setName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Prevent rendering if closed
  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (view === 'register') {
        // 1. Handle Registration
        await api.post('/api/auth/register', { name, whatsappNumber, email, password });
        setView('success');
      } else {
        // 2. Handle Login
        const res = await api.post('/api/auth/login', { email, password });
        
        // Ensure admins don't accidentally log in here
        if (res.data.user.role === 'SUPER_ADMIN') {
          setError('Admin accounts should use the /login portal.');
          setLoading(false);
          return;
        }

        setLogin(res.data.token, res.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchView = (newView) => {
    setView(newView);
    setError('');
    setName('');
    setWhatsappNumber('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm font-body">
      <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative">
        
        {/* Close Button */}
        <button 
          onClick={closeAuthModal}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        {view === 'success' ? (
          <div className="p-10 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">Check Your Email</h3>
            <p className="text-slate-500 mb-8 leading-relaxed">
              We sent a verification link to <strong>{email}</strong>. Please click the link to activate your account before logging in.
            </p>
            <button 
              onClick={() => switchView('login')}
              className="w-full py-4 rounded-2xl font-bold text-zibah-stores bg-zibah-gold hover:bg-[#e5bc45] transition-colors shadow-sm"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <div className="p-8 md:p-10">
            <h3 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-2">
              {view === 'login' ? 'Welcome Back' : 'Create Account'}
            </h3>
            <p className="text-sm text-slate-500 mb-8">
              {view === 'login' ? 'Sign in to access your curated collection.' : 'Join ZIBAH STORES for a premium experience.'}
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
                <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {view === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                    <div className="relative">
                      <input
                        type="text" required maxLength={100} value={name} onChange={(e) => setName(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:border-zibah-stores focus:ring-2 focus:ring-zibah-stores/20 transition-all text-base bg-slate-50"
                        placeholder="Your full name"
                        autoComplete="name"
                      />
                      <UserRound className="absolute left-4 top-4 text-slate-400" size={20} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2 ml-1">WhatsApp Number</label>
                    <div className="relative">
                      <input
                        type="tel" required maxLength={20} value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:border-zibah-stores focus:ring-2 focus:ring-zibah-stores/20 transition-all text-base bg-slate-50"
                        placeholder="+234 800 000 0000"
                        autoComplete="tel"
                      />
                      <Phone className="absolute left-4 top-4 text-slate-400" size={20} />
                    </div>
                    <p className="mt-2 ml-1 text-xs text-slate-500">Include your country code.</p>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:border-zibah-stores focus:ring-2 focus:ring-zibah-stores/20 transition-all text-base bg-slate-50"
                    placeholder="you@example.com"
                  />
                  <Mail className="absolute left-4 top-4 text-slate-400" size={20} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2 ml-1">Password</label>
                <div className="relative">
                  <input
                    type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:border-zibah-stores focus:ring-2 focus:ring-zibah-stores/20 transition-all text-base bg-slate-50"
                    placeholder="••••••••"
                  />
                  <Lock className="absolute left-4 top-4 text-slate-400" size={20} />
                </div>
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full py-4 rounded-2xl font-bold text-white bg-zibah-stores hover:bg-zibah-stores/90 shadow-lg flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed transition-colors text-lg"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : (view === 'login' ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <div className="mt-8 text-center">
              <button 
                type="button" 
                onClick={() => switchView(view === 'login' ? 'register' : 'login')}
                className="text-sm font-semibold text-slate-500 hover:text-zibah-stores transition-colors"
              >
                {view === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;