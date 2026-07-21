import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Search, Package, MapPin, Download, Loader2, Receipt } from 'lucide-react';

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await api.get('/api/orders/all', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (isMounted) {
          setOrders(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const token = localStorage.getItem('adminToken');
      await api.put(
        `/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state instantly
      setOrders(prevOrders => prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Status colors kept close to the originals; dot + text reads faster than a solid fill.
  const getStatusStyles = (status) => {
    switch (status) {
      case 'PAID': return { dot: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-50' };
      case 'PROCESSING': return { dot: 'bg-orange-500', text: 'text-orange-700', bg: 'bg-orange-50' };
      case 'SHIPPED': return { dot: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-50' };
      case 'DELIVERED': return { dot: 'bg-slate-800', text: 'text-white', bg: 'bg-slate-800' };
      case 'PENDING': return { dot: 'bg-slate-400', text: 'text-slate-500', bg: 'bg-slate-100' };
      default: return { dot: 'bg-slate-400', text: 'text-slate-700', bg: 'bg-slate-100' };
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full relative">
      <div className="p-4 lg:p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="hidden sm:flex w-9 h-9 rounded-lg bg-zibah-stores/5 items-center justify-center text-zibah-stores shrink-0">
            <Receipt size={16} />
          </div>
          <div className="relative w-full sm:w-72">
            <input 
              type="text" 
              placeholder="Search Order ID or Customer..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-zibah-stores focus:ring-1 focus:ring-zibah-stores font-body text-sm transition-all"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>
      </div>

      {!loading && (
        <div className="px-6 py-2.5 bg-gray-50/60 border-b border-gray-100 text-xs font-body text-gray-500">
          {orders.length} {orders.length === 1 ? 'order' : 'orders'}
        </div>
      )}

      <div className="overflow-x-auto w-full min-h-[500px]">
        <table className="w-full text-left font-body whitespace-nowrap">
          <thead className="bg-gray-50 border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
            <tr>
              <th className="px-6 py-3.5">Order ID & Date</th>
              <th className="px-6 py-3.5">Customer & Items</th>
              <th className="px-6 py-3.5">Fulfillment / Pickup</th>
              <th className="px-6 py-3.5">Total Value</th>
              <th className="px-6 py-3.5 text-right">Status Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {loading ? (
              <tr><td colSpan="5" className="px-6 py-16 text-center text-gray-400"><Loader2 size={22} className="animate-spin mx-auto mb-2" />Loading orders...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-16 text-center text-gray-400"><Receipt size={26} className="mx-auto mb-2 text-gray-300" />No orders yet — they'll show up here as customers check out.</td></tr>
            ) : (
              orders.map((order) => {
                const statusStyle = getStatusStyles(order.status);
                return (
                <tr key={order.id} className="hover:bg-zibah-stores/[0.03] transition-colors align-top">
                  
                  {/* Order ID & Date */}
                  <td className="px-6 py-4">
                    <div className="font-mono font-semibold text-slate-900 mb-1">#{order.id}</div>
                    <div className="text-xs text-slate-400">{new Date(order.created_at).toLocaleDateString()}</div>
                  </td>

                  {/* Customer & Items */}
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 mb-2">{order.customer_email}</div>
                    <div className="space-y-1">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="text-xs flex items-center gap-1.5 text-slate-500">
                          {item.is_digital ? <Download size={12} className="text-zibah-stores shrink-0" /> : <Package size={12} className="shrink-0" />}
                          <span className="truncate max-w-[200px]">{item.quantity}x {item.name}</span>
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Pickup Location */}
                  <td className="px-6 py-4">
                    {order.pickup_location ? (
                      <div className="flex items-start gap-2 text-slate-600">
                        <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                        <span className="text-sm">{order.pickup_location}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Digital Delivery</span>
                    )}
                  </td>

                  {/* Total Amount */}
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-900">₦{parseFloat(order.total_amount).toLocaleString()}</span>
                  </td>

                  {/* Status Dropdown */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {updatingId === order.id && <Loader2 size={16} className="animate-spin text-zibah-stores" />}
                      <div className={`relative inline-flex items-center gap-2 rounded-lg pl-3 pr-2 py-2 ${statusStyle.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot} ${order.status === 'DELIVERED' ? 'ring-2 ring-white/40' : ''}`} />
                        <select 
                          value={order.status}
                          disabled={updatingId === order.id}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`text-xs font-bold uppercase tracking-wider border-0 outline-none cursor-pointer appearance-none bg-transparent ${statusStyle.text} disabled:opacity-50`}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PAID">PAID</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                        </select>
                      </div>
                    </div>
                  </td>
                  
                </tr>
              );})
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;