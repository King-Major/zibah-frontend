import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Search, Plus, Link2, X, Loader2, Edit2, Trash2, FolderTree } from 'lucide-react';

const CategoriesTable = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null); // Holds category data when editing
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', slug: '' });
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, categoryId: null, categoryName: '' });

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        const res = await api.get('/api/products/categories');
        if (isMounted) {
          setCategories(res.data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-generate slug when name changes
  const handleNameChange = (e) => {
    const nameValue = e.target.value;
    const generatedSlug = nameValue
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    setFormData({ name: nameValue, slug: generatedSlug });
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', slug: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, slug: category.slug });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem('adminToken');

    try {
      if (editingCategory) {
        // UPDATE Existing Category
        const res = await api.put(
          `/api/products/categories/${editingCategory.id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Instantly update the UI
        setCategories(prevCategories => prevCategories.map(c => c.id === editingCategory.id ? res.data : c));
      } else {
        // CREATE New Category
        const res = await api.post(
          '/api/products/categories',
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Instantly add to UI
        setCategories(prevCategories => [...prevCategories, res.data]);
      }
      
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save category:', error);
      alert(error.response?.data?.message || 'Error saving category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (category) => {
    setDeleteConfirm({ open: true, categoryId: category.id, categoryName: category.name });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.categoryId) return;

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('adminToken');
      await api.delete(`/api/products/categories/${deleteConfirm.categoryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCategories(prevCategories => prevCategories.filter(c => c.id !== deleteConfirm.categoryId));
      setDeleteConfirm({ open: false, categoryId: null, categoryName: '' });
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert(error.response?.data?.message || 'Error deleting category');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full relative">
      {/* Toolbar */}
      <div className="p-4 lg:p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="hidden sm:flex w-9 h-9 rounded-lg bg-zibah-stores/5 items-center justify-center text-zibah-stores shrink-0">
            <FolderTree size={17} />
          </div>
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search categories..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-zibah-stores focus:ring-1 focus:ring-zibah-stores font-body text-sm transition-all"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>
        <button
          onClick={openCreateModal}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-zibah-stores text-white px-5 py-2.5 rounded-lg font-body text-sm font-medium hover:bg-zibah-stores/90 transition-colors shadow-sm shrink-0"
        >
          <Plus size={18} /> Create Category
        </button>
      </div>

      {/* Row count strip — orients the admin before they scan the table */}
      {!loading && (
        <div className="px-6 py-2.5 bg-gray-50/60 border-b border-gray-100 text-xs font-body text-gray-500">
          {categories.length} {categories.length === 1 ? 'category' : 'categories'}
        </div>
      )}

      <div className="overflow-x-auto w-full min-h-[400px]">
        <table className="w-full text-left font-body whitespace-nowrap">
          <thead className="bg-gray-50 border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
            <tr>
              <th className="px-6 py-3.5">ID</th>
              <th className="px-6 py-3.5">Category Name</th>
              <th className="px-6 py-3.5">URL Slug</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-6 py-16 text-center text-gray-400">
                  <Loader2 size={22} className="animate-spin mx-auto mb-2" />
                  Loading categories...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-16 text-center text-gray-400">
                  <FolderTree size={26} className="mx-auto mb-2 text-gray-300" />
                  No categories yet — create your first one to start organizing products.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id} className="group hover:bg-zibah-stores/[0.03] transition-colors">
                  <td className="px-6 py-4 text-gray-400 font-mono text-xs">#{category.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{category.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-3 py-1 rounded-md w-fit border border-gray-200 font-mono text-xs">
                      <Link2 size={13} />
                      /{category.slug}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(category)}
                        className="text-slate-400 hover:text-zibah-stores hover:bg-zibah-stores/10 transition-colors p-2 rounded-md"
                        title="Edit Category"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(category)}
                        className="text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors p-2 rounded-md"
                        title="Delete Category"
                      >
                        <Trash2 size={15} />
                      </button>
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
                <h3 className="text-lg font-semibold text-gray-900">Delete category?</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-6">
              Are you sure you want to delete <span className="font-semibold text-gray-900">{deleteConfirm.categoryName}</span>?
            </p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setDeleteConfirm({ open: false, categoryId: null, categoryName: '' })} className="flex-1 px-4 py-2.5 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors text-sm">Cancel</button>
              <button type="button" onClick={confirmDelete} disabled={isSubmitting} className="flex-1 px-4 py-2.5 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 transition-colors text-sm disabled:opacity-70">
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMBINED CREATE/EDIT CATEGORY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-zibah-gold/15 flex items-center justify-center text-zibah-stores shrink-0">
                  <FolderTree size={16} />
                </div>
                <h3 className="text-lg font-display font-bold text-zibah-stores">
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 transition-colors bg-white rounded-full p-1 border border-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleNameChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-zibah-stores focus:ring-1 focus:ring-zibah-stores text-sm transition-all"
                  placeholder="e.g. Groceries"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">URL Slug</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-zibah-stores focus:ring-1 focus:ring-zibah-stores text-sm transition-all bg-gray-50 text-gray-600 font-mono"
                  placeholder="e.g. groceries"
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
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : (editingCategory ? 'Update' : 'Save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesTable;