import { useState } from 'react';
import api from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/api/auth/login', {
        email,
        password,
      });

      const { token, user } = res.data;

      // Ensure only Admins can access this portal
      if (user.role !== 'SUPER_ADMIN') {
        setError('Access denied. Administrator privileges required.');
        setLoading(false);
        return;
      }

      // Securely store the token and navigate to the dashboard
      localStorage.setItem('adminToken', token);
      navigate('/admin');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to connect to the server.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zibah-light flex items-center justify-center p-4 font-body">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Brand Header */}
        <div className="bg-zibah-stores p-8 text-center">
          <h1 className="text-3xl font-display font-bold text-white tracking-wider">
            ZIBAH <span className="text-zibah-gold">STORES</span>
          </h1>
          <p className="text-xs text-zibah-gold mt-2 uppercase tracking-[0.15em] font-medium">
            Authorized Personnel Only
          </p>
        </div>

        {/* Login Form */}
        <div className="p-8">
          <h2 className="text-xl font-display font-bold text-gray-900 mb-6 text-center">
            Admin Login
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-zibah-oxblood/10 border border-zibah-oxblood/20 rounded-lg flex items-start gap-3">
              <AlertCircle size={20} className="text-zibah-oxblood shrink-0 mt-0.5" />
              <p className="text-sm text-zibah-oxblood font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-zibah-stores focus:ring-1 focus:ring-zibah-stores transition-all text-sm"
                  placeholder="admin@zibahstores.com"
                />
                <Mail className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-zibah-stores focus:ring-1 focus:ring-zibah-stores transition-all text-sm"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zibah-stores text-white py-3.5 rounded-lg font-medium hover:bg-zibah-stores/90 transition-colors shadow-md flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Sign In to Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;