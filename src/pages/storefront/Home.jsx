import { useState, useEffect, useMemo } from 'react';
import api from '../../lib/api';
import { Link } from 'react-router-dom'; // ADDED: React Router Link
import {
  ArrowRight,
  ShoppingBag,
  Plus,
  Search,
  Image as ImageIcon,
  Home as HomeIcon,
  Music,
  Smartphone,
  Package,
  Sparkles,
  Flame,
  Tag,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
  BadgeCheck,
} from 'lucide-react';
import StoreNavbar from '../../components/storefront/StoreNavbar';
import StoreFooter from '../../components/storefront/StoreFooter';
import { useCartStore } from '../../store/useCartStore'; 
import { useAuthStore } from '../../store/useAuthStore';

const PAGE_SIZE = 9;

const CATEGORY_ICONS = {
  home: HomeIcon,
  music: Music,
  phone: Smartphone,
  storage: Package,
};

const TRUST_POINTS = [
  { icon: Truck, label: 'Nationwide delivery' },
  { icon: ShieldCheck, label: 'Secure checkout' },
  { icon: BadgeCheck, label: 'Verified listings' },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [page, setPage] = useState(1);

  // Zustand State
  const addToCart = useCartStore((state) => state.addToCart);
  const { openAuthModal } = useAuthStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/api/products');
        setProducts(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const map = new Map();
    products.forEach((p) => {
      if (!p.category_name) return;
      map.set(p.category_name, (map.get(p.category_name) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        activeCategory === 'all' || p.category_name === activeCategory;
      const matchesSearch = p.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleAddToCart = async (product) => {
    const success = await addToCart(product);
    if (!success) {
      openAuthModal();
    }
  };

  const goToPage = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  const paginationItems = () => {
    const items = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        items.push(i);
      } else if (items[items.length - 1] !== '...') {
        items.push('...');
      }
    }
    return items;
  };

  const CategoryIcon = (name) => {
    const key = name?.toLowerCase() || '';
    return (
      Object.entries(CATEGORY_ICONS).find(([k]) => key.includes(k))?.[1] ||
      Package
    );
  };

  return (
    <div className="min-h-screen bg-[#f4f4f5] font-body text-slate-900 selection:bg-zibah-gold selection:text-zibah-stores pb-16 md:pb-28">
      <StoreNavbar />

      {/* HERO */}
      <div className="relative overflow-hidden">
        <div className="relative h-[260px] sm:h-[320px] md:h-[420px] w-full bg-zibah-stores">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zibah-stores/40 to-zibah-stores"></div>
          <div className="absolute top-0 right-0 w-72 h-72 md:w-[28rem] md:h-[28rem] bg-zibah-gold/20 rounded-full blur-3xl -mr-24 -mt-24"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2 px-3 py-1.5 rounded-full bg-zibah-gold/20 text-zibah-gold text-[10px] md:text-xs font-bold tracking-widest uppercase mb-4 border border-zibah-gold/30">
              The 1% Path
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.08] max-w-2xl">
              Quality essentials,
              <br />
              <span className="text-zibah-gold">minus the complexity.</span>
            </h1>
            <p className="text-sm md:text-base text-white/70 max-w-lg mt-4 leading-relaxed">
              Curated physical goods and digital resources, priced in naira,
              delivered with the Zibah standard of excellence.
            </p>
          </div>
        </div>

        {/* Floating glass search card, overlapping hero */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-9 md:-mt-12 bg-white/95 backdrop-blur-xl rounded-3xl p-5 sm:p-6 shadow-xl shadow-slate-900/5 border border-white flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                placeholder="Search products on Zibah Stores..."
                className="w-full rounded-2xl pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-zibah-stores text-sm"
              />
            </div>
            <button className="px-6 py-3.5 rounded-2xl font-bold text-zibah-stores bg-zibah-gold active:bg-[#e5bc45] md:hover:bg-[#e5bc45] shadow-sm flex items-center justify-center gap-2 text-sm transition-colors whitespace-nowrap">
              Search <ArrowRight size={16} />
            </button>
          </div>

          {/* Trust strip */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-5 px-2">
            {TRUST_POINTS.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="flex items-center gap-2 text-xs md:text-sm font-semibold text-slate-500"
              >
                <Icon size={16} className="text-zibah-stores" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12">
        {/* MOBILE CATEGORY CHIPS */}
        <div className="md:hidden -mx-4 px-4 mb-6 flex gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => {
              setActiveCategory('all');
              setPage(1);
            }}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              activeCategory === 'all'
                ? 'bg-zibah-stores text-white'
                : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            All Products
          </button>
          {categories.map(({ name }) => (
            <button
              key={name}
              onClick={() => {
                setActiveCategory(name);
                setPage(1);
              }}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                activeCategory === name
                  ? 'bg-zibah-stores text-white'
                  : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        {/* MAIN LAYOUT: SIDEBAR + PRODUCT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          {/* CATEGORY SIDEBAR — desktop only */}
          <aside className="hidden md:block md:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 sticky top-24">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                Category
              </h3>

              <button
                onClick={() => {
                  setActiveCategory('all');
                  setPage(1);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold mb-2 transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-zibah-stores text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag size={16} /> All Products
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeCategory === 'all'
                      ? 'bg-white/20 text-white'
                      : 'bg-zibah-gold/20 text-zibah-stores'
                  }`}
                >
                  {products.length}
                </span>
              </button>

              <div className="space-y-1 mb-5">
                {categories.map(({ name, count }) => {
                  const Icon = CategoryIcon(name);
                  return (
                    <button
                      key={name}
                      onClick={() => {
                        setActiveCategory(name);
                        setPage(1);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-sm font-medium transition-colors ${
                        activeCategory === name
                          ? 'bg-zibah-stores text-white'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon size={15} /> {name}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          activeCategory === name
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-1">
                <button className="w-full flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                  <Sparkles size={15} /> New Arrival
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                  <Flame size={15} /> Best Seller
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                  <Tag size={15} /> On Discount
                </button>
              </div>

              {/* Signature element: quiet gold callout */}
              <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <p className="text-[11px] font-bold text-zibah-stores uppercase tracking-widest mb-1">
                  Zibah Standard
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Every listing is checked for quality before it reaches the
                  shelf.
                </p>
              </div>
            </div>
          </aside>

          {/* PRODUCT GRID */}
          <div className="md:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-slate-900">
                Live Inventory
              </h2>
              {!loading && (
                <span className="text-xs md:text-sm font-semibold text-slate-400">
                  {filteredProducts.length} item
                  {filteredProducts.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="bg-white rounded-3xl h-72 animate-pulse shadow-sm border border-slate-200"
                  ></div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-200">
                <ImageIcon size={28} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">
                  No products match this search yet.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 md:gap-6">
                  {paginatedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="group bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-sm border border-slate-200 md:hover:border-zibah-stores md:hover:shadow-md transition-all flex flex-col"
                    >
                      <div className="relative w-full aspect-square bg-slate-50 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 overflow-hidden border border-slate-100">
                        
                        {/* ADDED: Link wrapping the image for routing */}
                        <Link to={`/product/${product.id}`} className="block w-full h-full">
                          {product.primary_image ? (
                            <img
                              src={product.primary_image}
                              alt={product.name}
                              className="w-full h-full object-cover md:group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon size={28} className="text-slate-300" />
                            </div>
                          )}
                        </Link>

                        <span className="absolute top-2 left-2 bg-white/90 backdrop-blur text-zibah-stores text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm pointer-events-none">
                          {product.is_digital
                            ? 'Digital'
                            : product.category_name || 'Other'}
                        </span>

                        {/* ADDED: e.preventDefault() so the Quick Add button doesn't trigger the Link */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(product);
                          }}
                          aria-label={`Add ${product.name} to cart`}
                          className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-zibah-stores text-white flex items-center justify-center shadow-lg active:scale-95 md:hover:bg-slate-800 transition-transform z-10"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* ADDED: Link wrapping the title for routing */}
                      <Link to={`/product/${product.id}`}>
                        <h3 className="text-sm sm:text-base font-display font-bold text-slate-900 mb-1 leading-snug line-clamp-2 hover:text-zibah-stores transition-colors">
                          {product.name}
                        </h3>
                      </Link>

                      {product.rating && (
                        <div className="flex items-center gap-1 mb-2 text-[11px] text-slate-500">
                          <span className="text-zibah-gold">★</span>
                          <span className="font-semibold text-slate-700">
                            {product.rating}
                          </span>
                          {product.reviews_count && (
                            <span>({product.reviews_count})</span>
                          )}
                        </div>
                      )}

                      <div className="mt-auto flex items-center justify-between pt-2 sm:pt-3">
                        <span className="text-base sm:text-lg font-bold text-zibah-stores tabular-nums">
                          ₦{parseFloat(product.price).toLocaleString()}
                        </span>
                        
                        {/* ADDED: e.preventDefault() for the desktop 'Buy Now' button too */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(product);
                          }}
                          className="hidden sm:inline-flex px-4 py-2 rounded-xl font-semibold text-xs bg-zibah-gold/20 text-zibah-stores hover:bg-zibah-stores hover:text-white transition-colors"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* PAGINATION */}
                <div className="flex items-center justify-between mt-8 sm:mt-10">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-slate-500 disabled:opacity-40 hover:text-zibah-stores transition-colors"
                  >
                    <ChevronLeft size={16} /> Prev
                  </button>

                  <div className="flex items-center gap-1 sm:gap-1.5">
                    {paginationItems().map((item, idx) =>
                      item === '...' ? (
                        <span
                          key={`ellipsis-${idx}`}
                          className="px-1.5 sm:px-2 text-slate-400 text-xs sm:text-sm"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={item}
                          onClick={() => goToPage(item)}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-semibold transition-colors ${
                            item === currentPage
                              ? 'bg-zibah-stores text-white'
                              : 'text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          {item}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-slate-500 disabled:opacity-40 hover:text-zibah-stores transition-colors"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* CTA BANNER */}
        <div className="mt-12 md:mt-16 bg-zibah-stores rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-zibah-gold/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <h3 className="text-2xl md:text-4xl font-display font-bold text-white leading-tight">
              Ready to get
              <br className="hidden md:block" /> our new stuff?
            </h3>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md w-full md:w-auto">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 rounded-2xl px-5 py-3.5 bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-zibah-gold text-sm"
              />
              <button className="px-6 py-3.5 rounded-2xl font-bold text-zibah-stores bg-zibah-gold hover:bg-[#e5bc45] transition-colors text-sm whitespace-nowrap">
                Send
              </button>
            </div>
          </div>
        </div>

        <StoreFooter />
      </div>
    </div>
  );
};

export default Home;