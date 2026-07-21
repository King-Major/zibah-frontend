import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { ShoppingBag, Plus, ArrowLeft, Loader2, Image as ImageIcon } from 'lucide-react';
import StoreNavbar from '../../components/storefront/StoreNavbar';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';

const normalizeSlug = (value) => {
  if (typeof value !== 'string') return '';

  const sanitized = value.trim().toLowerCase();
  return sanitized.replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
};

const sanitizeImageUrl = (value) => {
  if (typeof value !== 'string') return '';

  const trimmed = value.trim();
  if (!trimmed) return '';

  try {
    const parsed = new URL(trimmed, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed.toString() : '';
  } catch {
    return '';
  }
};

const CategoryPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const addToCart = useCartStore((state) => state.addToCart);
  const { openAuthModal } = useAuthStore();

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      setErrorMessage('');

      const safeSlug = normalizeSlug(slug);
      if (!safeSlug) {
        setProducts([]);
        setCategoryName('Category');
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/api/products/category/${encodeURIComponent(safeSlug)}`);
        const fetchedProducts = Array.isArray(res.data?.products) ? res.data.products : [];
        setProducts(fetchedProducts);

        const fallbackTitle = safeSlug
          .split('-')
          .filter(Boolean)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        const resolvedCategoryName = typeof res.data?.categoryName === 'string' && res.data.categoryName.trim() && res.data.categoryName !== 'Category'
          ? res.data.categoryName
          : fallbackTitle;

        setCategoryName(resolvedCategoryName || 'Category');
      } catch (error) {
        console.error('Failed to fetch category:', error);
        setProducts([]);
        setCategoryName('Category');
        setErrorMessage('We could not load this collection right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [slug]);

  const handleAddToCart = async (product) => {
    if (!product || typeof product !== 'object') return;

    const success = await addToCart(product);
    if (!success) openAuthModal();
  };

  return (
    <div className="min-h-screen bg-[#f4f4f5] font-body text-slate-900 pb-24">
      <StoreNavbar />

      {/* HEADER SECTION */}
      <div className="bg-zibah-stores pt-16 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-zibah-gold/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors text-sm font-semibold">
            <ArrowLeft size={16} /> Back to Shop
          </button>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            {categoryName}
          </h1>
          <p className="text-white/80 max-w-lg">
            Explore our curated collection of {categoryName.toLowerCase()} sourced specifically for the Zibah standard.
          </p>
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100 min-h-[400px]">
          
          <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900">All Items</h2>
            <span className="text-sm font-semibold text-slate-500">{products.length} products</span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 size={40} className="animate-spin text-zibah-stores mb-4" />
              <p className="text-slate-500 font-medium">Loading collection...</p>
            </div>
          ) : errorMessage ? (
            <div className="text-center py-20">
              <ShoppingBag size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Unable to load collection</h3>
              <p className="text-slate-500 mb-6">{errorMessage}</p>
              <Link to="/" className="px-6 py-3 rounded-xl bg-zibah-stores text-white font-bold hover:bg-slate-800 transition-colors">
                Continue Shopping
              </Link>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">No products found</h3>
              <p className="text-slate-500 mb-6">We're currently restocking our {categoryName.toLowerCase()}. Check back soon!</p>
              <Link to="/" className="px-6 py-3 rounded-xl bg-zibah-stores text-white font-bold hover:bg-slate-800 transition-colors">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => {
                const productId = product?.id;
                const imageUrl = sanitizeImageUrl(product?.primary_image);
                const productName = typeof product?.name === 'string' && product.name.trim() ? product.name : 'Untitled product';
                const productPrice = Number.isFinite(Number(product?.price)) ? Number(product.price) : 0;

                return (
                  <div key={productId} className="group flex flex-col">
                    <div className="relative w-full aspect-square bg-slate-50 rounded-2xl mb-4 overflow-hidden border border-slate-100">
                      <Link to={`/product/${encodeURIComponent(String(productId))}`} className="block w-full h-full">
                        {imageUrl ? (
                          <img src={imageUrl} alt={productName} className="w-full h-full object-cover md:group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><ImageIcon size={28} className="text-slate-300" /></div>
                        )}
                      </Link>
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); handleAddToCart(product); }}
                        className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-zibah-stores text-white flex items-center justify-center shadow-lg active:scale-95 md:hover:bg-slate-800 transition-transform z-10"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    <Link to={`/product/${encodeURIComponent(String(productId))}`}>
                      <h3 className="font-display font-bold text-slate-900 mb-1 leading-snug line-clamp-2 hover:text-zibah-stores transition-colors">{productName}</h3>
                    </Link>
                    <div className="mt-auto pt-2">
                      <span className="font-bold text-zibah-stores text-lg">₦{productPrice.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;