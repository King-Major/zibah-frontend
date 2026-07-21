import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Search, Plus, Mail, Building2, X, Loader2, Edit2, Trash2, Users } from 'lucide-react';

const VendorsTable = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', company_name: '' });
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, vendorId: null, vendorName: '' });

  useEffect(() => {
    let isMounted = true;

    const loadVendors = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await api.get('/api/vendors', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (isMounted) {
          setVendors(res.data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch vendors:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadVendors();

    return () => {
      isMounted = false;
    };
  }, []);

  const openCreateModal = () => {
    setEditingVendor(null);
    setFormData({ name: '', email: '', company_name: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (vendor) => {
    setEditingVendor(vendor);
    setFormData({ name: vendor.name, email: vendor.email, company_name: vendor.company_name });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem('adminToken');

    try {
      if (editingVendor) {
        // UPDATE Existing Vendor
        await api.put(`/api/vendors/${editingVendor.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // CREATE New Vendor
        await api.post('/api/vendors', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      // Refresh the table to guarantee synchronization with the database
      window.location.reload();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save vendor:', error);
      alert(error.response?.data?.message || 'Error saving vendor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (vendor) => {
    setDeleteConfirm({ open: true, vendorId: vendor.id, vendorName: vendor.name });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.vendorId) return;

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('adminToken');
      await api.delete(`/api/vendors/${deleteConfirm.vendorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVendors(prevVendors => prevVendors.filter(v => v.id !== deleteConfirm.vendorId));
      setDeleteConfirm({ open: false, vendorId: null, vendorName: '' });
    } catch (error) {
      console.error('Failed to delete vendor:', error);
      alert('Error deleting vendor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full relative">
      
      {/* Top Bar Controls */}
      <div className="p-4 lg:p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="hidden sm:flex w-9 h-9 rounded-lg bg-zibah-stores/5 items-center justify-center text-zibah-stores shrink-0">
            <Users size={16} />
          </div>
          <div className="relative w-full sm:w-72">
            <input 
              type="text" 
              placeholder="Search vendors..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-zibah-stores focus:ring-1 focus:ring-zibah-stores font-body text-sm transition-all"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>
        <button 
          onClick={openCreateModal} 
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-zibah-stores text-white px-5 py-2.5 rounded-lg font-body text-sm font-medium hover:bg-zibah-stores/90 transition-colors shadow-sm shrink-0"
        >
          <Plus size={18} /> Add Vendor
        </button>
      </div>

      {!loading && (
        <div className="px-6 py-2.5 bg-gray-50/60 border-b border-gray-100 text-xs font-body text-gray-500">
          {vendors.length} {vendors.length === 1 ? 'vendor' : 'vendors'}
        </div>
      )}

      {/* Data Table */}
      <div className="overflow-x-auto w-full min-h-[400px]">
        <table className="w-full text-left font-body whitespace-nowrap">
          <thead className="bg-gray-50 border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
            <tr>
              <th className="px-6 py-3.5">ID</th>
              <th className="px-6 py-3.5">Vendor Details</th>
              <th className="px-6 py-3.5">Contact</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {loading ? (
              <tr><td colSpan="4" className="px-6 py-16 text-center text-gray-400"><Loader2 size={22} className="animate-spin mx-auto mb-2" />Loading vendors...</td></tr>
            ) : vendors.length === 0 ? (
              <tr><td colSpan="4" className="px-6 py-16 text-center text-gray-400"><Users size={26} className="mx-auto mb-2 text-gray-300" />No vendors yet — add one to start assigning products.</td></tr>
            ) : (
              vendors.map((vendor) => (
                <tr key={vendor.id} className="group hover:bg-zibah-stores/[0.03] transition-colors">
                  <td className="px-6 py-4 text-gray-400 font-mono text-xs">#{vendor.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{vendor.name}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Building2 size={12}/> {vendor.company_name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail size={14} className="text-gray-400" />{vendor.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditModal(vendor)} className="text-slate-400 hover:text-zibah-stores hover:bg-zibah-stores/10 transition-colors p-2 rounded-md"><Edit2 size={15} /></button>
                      <button onClick={() => handleDeleteClick(vendor)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors p-2 rounded-md"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {deleteConfirm.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-red-50 text-red-500">
                <Trash2 size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete vendor?</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-6">
              Are you sure you want to delete <span className="font-semibold text-gray-900">{deleteConfirm.vendorName}</span>? Their products will lose the vendor association.
            </p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setDeleteConfirm({ open: false, vendorId: null, vendorName: '' })} className="flex-1 px-4 py-2.5 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors text-sm">Cancel</button>
              <button type="button" onClick={confirmDelete} disabled={isSubmitting} className="flex-1 px-4 py-2.5 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 transition-colors text-sm disabled:opacity-70">
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DYNAMIC MODAL (Handles both Create and Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-zibah-gold/15 flex items-center justify-center text-zibah-stores shrink-0">
                  <Users size={16} />
                </div>
                <h3 className="text-lg font-display font-bold text-zibah-stores">
                  {editingVendor ? 'Edit Vendor' : 'Register New Vendor'}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-400 hover:text-gray-700 bg-white rounded-full p-1 border border-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name / Contact Person</label>
                <input 
                  type="text" 
                  required 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-zibah-stores focus:ring-1 focus:ring-zibah-stores text-sm transition-all" 
                  placeholder="e.g. John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name</label>
                <input 
                  type="text" 
                  required 
                  value={formData.company_name} 
                  onChange={(e) => setFormData({...formData, company_name: e.target.value})} 
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-zibah-stores focus:ring-1 focus:ring-zibah-stores text-sm transition-all" 
                  placeholder="e.g. P-Tech Designs Limited"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  required 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-zibah-stores focus:ring-1 focus:ring-zibah-stores text-sm transition-all" 
                  placeholder="vendor@company.com"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 px-4 py-2.5 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="flex-1 px-4 py-2.5 rounded-lg font-medium text-white bg-zibah-stores hover:bg-zibah-stores/90 transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : (editingVendor ? 'Update Vendor' : 'Save Vendor')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorsTable;