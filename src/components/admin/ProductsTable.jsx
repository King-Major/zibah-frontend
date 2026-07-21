import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Search, Plus, Image as ImageIcon, X, Loader2, Edit2, Trash2, UploadCloud, Star, Boxes } from 'lucide-react';

const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, productId: null, productName: '' });
  
  // Form & Image States
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', stock: 0, 
    category_id: '', vendor_id: '', is_digital: false
  });
  
  const [existingImages, setExistingImages] = useState([]); // Images already in the DB
  const [newImages, setNewImages] = useState([]); // New files selected for upload

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const [prodRes, catRes, venRes] = await Promise.all([
          api.get('/api/products'),
          api.get('/api/products/categories'),
          api.get('/api/vendors', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        if (isMounted) {
          setProducts(prodRes.data);
          setCategories(catRes.data);
          setVendors(venRes.data);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // --- MODAL TRIGGERS ---
  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({ name: '', description: '', price: '', stock: 0, category_id: '', vendor_id: '', is_digital: false });
    setExistingImages([]);
    setNewImages([]);
    setIsModalOpen(true);
  };

  const openEditModal = async (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name, description: product.description || '', price: product.price,
      stock: product.stock, category_id: product.category_id || '', vendor_id: product.vendor_id || '',
      is_digital: product.is_digital
    });
    setNewImages([]);

    // Fetch the specific product's full image gallery
    try {
      const res = await api.get(`/api/products/${product.id}`);
      setExistingImages(res.data.images || []);
    } catch {
      console.error("Failed to fetch product images");
      setExistingImages([]);
    }
    
    setIsModalOpen(true);
  };

  // --- IMAGE HANDLING LOGIC ---
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const mappedFiles = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setNewImages(prev => [...prev, ...mappedFiles]);
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (imageId) => {
    if (!window.confirm('Delete this image permanently?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await api.delete(`/api/products/images/${imageId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
    } catch (error) {
      console.error('Failed to delete image', error);
      alert('Error deleting image. Check console.');
    }
  };

  // --- SUBMISSION LOGIC ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem('adminToken');

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    
    newImages.forEach(imageObj => {
      data.append('productImages', imageObj.file);
    });

    try {
      if (editingProduct) {
        await api.put(`/api/products/${editingProduct.id}`, data, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data' 
          }
        });
      } else {
        await api.post('/api/products', data, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      setTimeout(() => {
        window.location.reload();
      }, 100);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Error saving product');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- DELETE LOGIC ---
  const handleDeleteClick = (product) => {
    setDeleteConfirm({ open: true, productId: product.id, productName: product.name });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.productId) return;

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('adminToken');
      await api.delete(`/api/products/${deleteConfirm.productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(prevProducts => prevProducts.filter(p => p.id !== deleteConfirm.productId));
      setDeleteConfirm({ open: false, productId: null, productName: '' });
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Error deleting product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full relative">
      
      {/* Top Controls */}
      <div className="p-4 lg:p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="hidden sm:flex w-9 h-9 rounded-lg bg-zibah-stores/5 items-center justify-center text-zibah-stores shrink-0">
            <Boxes size={16} />
          </div>
          <div className="relative w-full sm:w-72">
            <input type="text" placeholder="Search inventory..." className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-zibah-stores focus:ring-1 focus:ring-zibah-stores font-body text-sm transition-all" />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>
        <button onClick={openCreateModal} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-zibah-stores text-white px-5 py-2.5 rounded-lg font-body text-sm font-medium hover:bg-zibah-stores/90 transition-colors shadow-sm shrink-0">
          <Plus size={18} /> Upload Product
        </button>
      </div>

      {!loading && (
        <div className="px-6 py-2.5 bg-gray-50/60 border-b border-gray-100 text-xs font-body text-gray-500">
          {products.length} {products.length === 1 ? 'product' : 'products'}
        </div>
      )}

      {/* Main Table */}
      <div className="overflow-x-auto w-full min-h-[400px]">
        <table className="w-full text-left font-body whitespace-nowrap">
          <thead className="bg-gray-50 border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
            <tr>
              <th className="px-6 py-3.5">Product</th>
              <th className="px-6 py-3.5">Pricing</th>
              <th className="px-6 py-3.5">Inventory</th>
              <th className="px-6 py-3.5">Type</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {loading ? (
              <tr><td colSpan="5" className="px-6 py-16 text-center text-gray-400"><Loader2 size={22} className="animate-spin mx-auto mb-2" />Loading inventory...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-16 text-center text-gray-400"><Boxes size={26} className="mx-auto mb-2 text-gray-300" />No products yet — upload your first one to start selling.</td></tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="group hover:bg-zibah-stores/[0.03] transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                      {product.primary_image ? <img src={product.primary_image} alt="" className="w-full h-full object-cover" /> : <ImageIcon size={16} className="text-gray-300" />}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 truncate max-w-[200px]">{product.name}</div>
                      <div className="text-xs text-gray-400">{product.category_name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">₦{parseFloat(product.price).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    {product.is_digital ? <span className="text-gray-400 text-xs italic">Unlimited</span> : (
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${product.stock > 10 ? 'bg-green-50 text-green-700' : product.stock > 0 ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-orange-500' : 'bg-red-500'}`} />
                        {product.stock} left
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${product.is_digital ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
                      {product.is_digital ? 'Digital' : 'Physical'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditModal(product)} className="text-slate-400 hover:text-zibah-stores hover:bg-zibah-stores/10 transition-colors p-2 rounded-md"><Edit2 size={15} /></button>
                      <button onClick={() => handleDeleteClick(product)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors p-2 rounded-md"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-red-50 text-red-500">
                <Trash2 size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete product?</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-6">
              Are you sure you want to delete <span className="font-semibold text-gray-900">{deleteConfirm.productName}</span>? This will remove it from active customer carts.
            </p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setDeleteConfirm({ open: false, productId: null, productName: '' })} className="flex-1 px-4 py-2.5 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors text-sm">Cancel</button>
              <button type="button" onClick={confirmDelete} disabled={isSubmitting} className="flex-1 px-4 py-2.5 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 transition-colors text-sm disabled:opacity-70">
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPGRADED FULL-FEATURED UPLOAD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-zibah-gold/15 flex items-center justify-center text-zibah-stores shrink-0">
                  <Boxes size={16} />
                </div>
                <h3 className="text-xl font-display font-bold text-zibah-stores">
                  {editingProduct ? 'Edit Product & Gallery' : 'Create New Product'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 bg-white rounded-full p-1 border border-gray-200"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row flex-1 overflow-hidden">
              
              {/* LEFT COLUMN: Data Details */}
              <div className="w-full md:w-1/2 p-6 space-y-4 overflow-y-auto border-r border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Product Details</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-zibah-stores text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                  <textarea rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-zibah-stores text-sm" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₦)</label>
                    <input type="number" required min="0" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-zibah-stores text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock</label>
                    <input type="number" required min="0" disabled={formData.is_digital} value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-zibah-stores text-sm disabled:bg-gray-100" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                    <select required value={formData.category_id} onChange={(e) => setFormData({...formData, category_id: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-zibah-stores text-sm bg-white">
                      <option value="">Select Category...</option>
                      {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Vendor</label>
                    <select value={formData.vendor_id} onChange={(e) => setFormData({...formData, vendor_id: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-zibah-stores text-sm bg-white">
                      <option value="">Select Vendor...</option>
                      {vendors.map(ven => <option key={ven.id} value={ven.id}>{ven.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="checkbox" checked={formData.is_digital} onChange={(e) => setFormData({...formData, is_digital: e.target.checked, stock: e.target.checked ? 0 : formData.stock})} className="w-4 h-4 text-zibah-stores rounded border-gray-300 focus:ring-zibah-stores" />
                    <span className="text-sm font-medium text-gray-700">Digital Product (No shipping)</span>
                  </label>
                </div>
              </div>

              {/* RIGHT COLUMN: Image Gallery & Upload */}
              <div className="w-full md:w-1/2 p-6 overflow-y-auto bg-slate-50 flex flex-col pb-24">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Media Gallery</h4>
                
                {/* Drag & Drop Zone */}
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-white hover:bg-slate-50 transition-colors mb-6 relative">
                  <UploadCloud size={40} className="text-zibah-stores mb-3" />
                  <p className="text-sm font-medium text-slate-700 mb-1">Click to upload images</p>
                  <p className="text-xs text-slate-500">PNG, JPG up to 5MB</p>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/png, image/jpeg, image/webp" 
                    onChange={handleImageSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-3 gap-3">
                  
                  {/* Existing Images from DB */}
                  {existingImages.map((img) => (
                    <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                      <img src={img.url} alt="Product" className="w-full h-full object-cover" />
                      {img.is_primary && (
                        <div className="absolute top-1 left-1 bg-zibah-stores text-white p-1 rounded-md shadow-sm">
                          <Star size={12} className="fill-current" />
                        </div>
                      )}
                      <button 
                        type="button" 
                        onClick={() => removeExistingImage(img.id)}
                        className="absolute inset-0 bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <span className="bg-red-500 text-white p-2 rounded-full shadow-lg"><Trash2 size={16} /></span>
                      </button>
                    </div>
                  ))}

                  {/* Newly selected images pending upload */}
                  {newImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border-2 border-zibah-stores group">
                      <img src={img.preview} alt="New upload" className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 right-1 bg-zibah-stores text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">NEW</span>
                      <button 
                        type="button" 
                        onClick={() => removeNewImage(idx)}
                        className="absolute inset-0 bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <span className="bg-red-500 text-white p-2 rounded-full shadow-lg"><Trash2 size={16} /></span>
                      </button>
                    </div>
                  ))}

                </div>
              </div>

              {/* Sticky Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 bg-white flex justify-end gap-3 z-10">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-lg font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 text-sm">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-8 py-2.5 rounded-lg font-medium text-white bg-zibah-stores hover:bg-zibah-stores/90 flex items-center gap-2 text-sm disabled:opacity-70">
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Save Product & Upload'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsTable;