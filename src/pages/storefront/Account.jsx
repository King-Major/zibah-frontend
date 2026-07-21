import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { useAuthStore } from '../../store/useAuthStore';
import { Package, Download, Clock, Loader2, } from 'lucide-react';
import StoreNavbar from '../../components/storefront/StoreNavbar';
import StoreFooter from '../../components/storefront/StoreFooter';

const Account = () => {
  const navigate = useNavigate();
  const { token, user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await api.get('/api/orders/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, navigate]);



  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID': return 'bg-green-100 text-green-700';
      case 'PENDING': return 'bg-orange-100 text-orange-700';
      case 'SHIPPED': return 'bg-blue-100 text-blue-700';
      case 'DELIVERED': return 'bg-slate-800 text-white';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-[#f4f4f5] font-body text-slate-900 pb-24">
      <StoreNavbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-16">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">My Account</h1>
            <p className="text-slate-500">Welcome back, <span className="font-semibold text-slate-900">{user?.email}</span></p>
          </div>
          {/* <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-slate-200 text-red-500 font-bold hover:bg-red-50 transition-colors shadow-sm w-fit"
          >
            <LogOut size={18} /> Sign Out
          </button> */}
        </div>

        {/* Order History */}
        <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
            <Package className="text-zibah-stores" /> Order History
          </h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 size={40} className="text-zibah-stores animate-spin mb-4" />
              <p className="text-slate-500">Loading your legacy...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100">
              <Clock size={48} className="text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">No orders yet</h3>
              <p className="text-slate-500 mb-6">When you make a purchase, it will appear here.</p>
              <button 
                onClick={() => navigate('/categories')}
                className="px-8 py-3 rounded-xl font-bold text-white bg-zibah-stores hover:bg-zibah-stores/90 shadow-md transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="border border-slate-200 rounded-2xl overflow-hidden">
                  
                  {/* Order Header */}
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">
                        Order #{order.id} • {new Date(order.created_at).toLocaleDateString()}
                      </p>
                      <p className="font-black text-slate-900 text-lg">
                        ₦{parseFloat(order.total_amount).toLocaleString()}
                      </p>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase flex items-center justify-center w-fit ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Order Items */}
                  <div className="p-6 space-y-4">
                    {order.items?.map((item, index) => (
                      <div key={index} className="flex items-center justify-between gap-4 py-2">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-white rounded-xl overflow-hidden border border-slate-100 shrink-0">
                            <img src={item.primary_image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h4 className="font-display font-semibold text-slate-900 line-clamp-1">{item.name}</h4>
                            <p className="text-xs text-slate-500 mt-1">Qty: {item.quantity} • ₦{parseFloat(item.price_at_purchase).toLocaleString()}</p>
                          </div>
                        </div>

                        {/* Digital Download Badge */}
                        {item.is_digital && (
                          <div className="shrink-0">
                            {order.status === 'PAID' ? (
                              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-zibah-gold/20 text-zibah-stores text-xs font-bold rounded-lg">
                                <Download size={14} /> Sent to Email
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400 italic">Awaiting Payment</span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                </div>
              ))}
            </div>
          )}
        </div>

        <StoreFooter />
      </div>
    </div>
  );
};

export default Account;