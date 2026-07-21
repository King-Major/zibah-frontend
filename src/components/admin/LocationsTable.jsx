import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Search, Plus, MapPin, X, Loader2, Edit2, Trash2, Navigation } from 'lucide-react';

const LocationsTable = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', address: '', added_fee: '' });
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, locationId: null, locationName: '' });

  useEffect(() => {
    let isMounted = true;

    const loadLocations = async () => {
      try {
        const res = await api.get('/api/checkout/locations');
        if (isMounted) {
          setLocations(res.data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch locations:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadLocations();

    return () => {
      isMounted = false;
    };
  }, []);

  const openCreateModal = () => {
    setEditingLocation(null);
    setFormData({ name: '', address: '', added_fee: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (loc) => {
    setEditingLocation(loc);
    setFormData({ name: loc.name, address: loc.address, added_fee: loc.added_fee });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem('adminToken');

    try {
      if (editingLocation) {
        const res = await api.put(`/api/checkout/locations/${editingLocation.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLocations(prevLocations => prevLocations.map(l => l.id === editingLocation.id ? res.data : l));
      } else {
        const res = await api.post('/api/checkout/locations', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLocations(prevLocations => [...prevLocations, res.data]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save location:', error);
      alert('Error saving location');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (location) => {
    setDeleteConfirm({ open: true, locationId: location.id, locationName: location.name });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.locationId) return;

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('adminToken');
      await api.delete(`/api/checkout/locations/${deleteConfirm.locationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLocations(prevLocations => prevLocations.filter(l => l.id !== deleteConfirm.locationId));
      setDeleteConfirm({ open: false, locationId: null, locationName: '' });
    } catch (error) {
      console.error('Failed to delete location:', error);
      alert('Error deleting location');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full relative">
      <div className="p-4 lg:p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="hidden sm:flex w-9 h-9 rounded-lg bg-zibah-stores/5 items-center justify-center text-zibah-stores shrink-0">
            <Navigation size={16} />
          </div>
          <div className="relative w-full sm:w-72">
            <input type="text" placeholder="Search delivery zones..." className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-zibah-stores focus:ring-1 focus:ring-zibah-stores font-body text-sm transition-all" />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>
        <button onClick={openCreateModal} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-zibah-stores text-white px-5 py-2.5 rounded-lg font-body text-sm font-medium hover:bg-zibah-stores/90 transition-colors shadow-sm shrink-0">
          <Plus size={18} /> Add Zone
        </button>
      </div>

      {!loading && (
        <div className="px-6 py-2.5 bg-gray-50/60 border-b border-gray-100 text-xs font-body text-gray-500">
          {locations.length} delivery {locations.length === 1 ? 'zone' : 'zones'}
        </div>
      )}

      <div className="overflow-x-auto w-full min-h-[400px]">
        <table className="w-full text-left font-body whitespace-nowrap">
          <thead className="bg-gray-50 border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
            <tr>
              <th className="px-6 py-3.5">Zone Name</th>
              <th className="px-6 py-3.5">Address / Details</th>
              <th className="px-6 py-3.5">Delivery Fee</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {loading ? (
              <tr><td colSpan="4" className="px-6 py-16 text-center text-gray-400"><Loader2 size={22} className="animate-spin mx-auto mb-2" />Loading zones...</td></tr>
            ) : locations.length === 0 ? (
              <tr><td colSpan="4" className="px-6 py-16 text-center text-gray-400"><MapPin size={26} className="mx-auto mb-2 text-gray-300" />No delivery zones yet — add one to start charging shipping by area.</td></tr>
            ) : (
              locations.map((loc) => (
                <tr key={loc.id} className="group hover:bg-zibah-stores/[0.03] transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">{loc.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={14} className="text-gray-400 shrink-0" />
                      <span className="truncate max-w-[300px]">{loc.address}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-zibah-stores bg-zibah-stores/5 px-2.5 py-1 rounded-md">₦{parseFloat(loc.added_fee).toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditModal(loc)} className="text-slate-400 hover:text-zibah-stores hover:bg-zibah-stores/10 transition-colors p-2 rounded-md"><Edit2 size={15} /></button>
                      <button onClick={() => handleDeleteClick(loc)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors p-2 rounded-md"><Trash2 size={15} /></button>
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
                <h3 className="text-lg font-semibold text-gray-900">Delete delivery zone?</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-6">
              Are you sure you want to delete <span className="font-semibold text-gray-900">{deleteConfirm.locationName}</span>?
            </p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setDeleteConfirm({ open: false, locationId: null, locationName: '' })} className="flex-1 px-4 py-2.5 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors text-sm">Cancel</button>
              <button type="button" onClick={confirmDelete} disabled={isSubmitting} className="flex-1 px-4 py-2.5 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 transition-colors text-sm disabled:opacity-70">
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-zibah-gold/15 flex items-center justify-center text-zibah-stores shrink-0">
                  <MapPin size={16} />
                </div>
                <h3 className="text-lg font-display font-bold text-zibah-stores">{editingLocation ? 'Edit Delivery Zone' : 'Add Delivery Zone'}</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 bg-white rounded-full p-1 border border-gray-200"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Zone Name</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Within UNILAG" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-zibah-stores text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Address / Description</label>
                <input type="text" required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="e.g. University of Lagos Campus Area" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-zibah-stores text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Delivery Fee (₦)</label>
                <input type="number" required min="0" step="0.01" value={formData.added_fee} onChange={(e) => setFormData({...formData, added_fee: e.target.value})} placeholder="300" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-zibah-stores text-sm" />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 text-sm">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 rounded-lg font-medium text-white bg-zibah-stores hover:bg-zibah-stores/90 flex items-center justify-center gap-2 text-sm disabled:opacity-70">
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : (editingLocation ? 'Update Zone' : 'Save Zone')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationsTable;