import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { ArrowLeft, ShoppingBag, ShieldCheck, Loader2 } from 'lucide-react';
import StoreNavbar from '../../components/storefront/StoreNavbar';
import StoreFooter from '../../components/storefront/StoreFooter';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');

  // Zustand Actions
  const { addToCart } = useCartStore();
  const { token, openAuthModal } = useAuthStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/api/products/${id}`);
        setProduct(res.data);
        
        // Set the initial active image to the primary one, or the first one available
        if (res.data.images && res.data.images.length > 0) {
          const primary = res.data.images.find(img => img.is_primary);
          setActiveImage(primary ? primary.url : res.data.images[0].url);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!token) {
      openAuthModal();
      return;
    }
    await addToCart(product);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f4f5] flex items-center justify-center">
        <Loader2 size={48} className="text-zibah-stores animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f4f4f5] flex items-center justify-center flex-col">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Product not found</h2>
        <button onClick={() => navigate('/categories')} className="text-zibah-stores font-bold hover:underline">Return to Shop</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f4f5] font-body text-slate-900 pb-24">
      <StoreNavbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-16">
        
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-semibold mb-8 transition-colors">
          <ArrowLeft size={20} /> Back
        </button>

        <div className="bg-white rounded-[2rem] p-6 md:p-12 shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* LEFT: Image Gallery */}
          <div className="flex flex-col gap-4">
            {/* Main Featured Image */}
            <div className="w-full aspect-square rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden">
              {activeImage ? (
                <img src={activeImage} alt={product.name} className="w-full h-full object-cover transition-opacity duration-300" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">No Image Available</div>
              )}
            </div>
            
            {/* Thumbnail Strip */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img) => (
                  <button 
                    key={img.id}
                    onClick={() => setActiveImage(img.url)}
                    className={`w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImage === img.url ? 'border-zibah-stores opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Details */}
          <div className="flex flex-col justify-center">
            
            <div className="mb-2 flex items-center gap-3">
              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-full">
                {product.category_name}
              </span>
              {product.is_digital && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider rounded-full">
                  Digital Delivery
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-4 leading-tight">
              {product.name}
            </h1>
            
            <p className="text-3xl font-black text-zibah-stores mb-6">
              ₦{parseFloat(product.price).toLocaleString()}
            </p>

            <div className="prose prose-slate mb-8 text-slate-600 leading-relaxed">
              {product.description ? (
                <p>{product.description}</p>
              ) : (
                <p className="italic text-slate-400">No description provided.</p>
              )}
            </div>

            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <ShieldCheck size={18} className="text-green-500" /> 
                Guaranteed safe & secure checkout
              </div>
              {!product.is_digital && (
                <div className="text-sm font-semibold">
                  Availability: <span className={product.stock > 0 ? 'text-green-600' : 'text-red-500'}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
              )}
            </div>

            <button 
              onClick={handleAddToCart}
              disabled={!product.is_digital && product.stock <= 0}
              className="w-full py-5 rounded-2xl font-bold text-white bg-zibah-stores hover:bg-zibah-stores/90 shadow-xl shadow-zibah-stores/20 flex items-center justify-center gap-3 text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={24} /> 
              {!product.is_digital && product.stock <= 0 ? 'Out of Stock' : 'Add to Bag'}
            </button>
            
          </div>
        </div>

        <StoreFooter />
      </div>
    </div>
  );
};

export default ProductDetails;