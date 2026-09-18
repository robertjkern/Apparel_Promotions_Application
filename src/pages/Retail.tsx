import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import type { Product, Category } from '@/types';
import { ShoppingBag, Search, Check } from 'lucide-react';

export default function Retail() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState<string | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    (async () => {
      const [{ data: productsData }, { data: categoriesData }] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name'),
      ]);
      setProducts(productsData as Product[] ?? []);
      setCategories(categoriesData as Category[] ?? []);
      setLoading(false);
    })();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (selectedCategory) {
      const cat = categories.find(c => c.slug === selectedCategory);
      result = result.filter(p => p.category_id === cat?.id);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [products, categories, selectedCategory, searchQuery]);

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Retail Store</h1>
          <p className="mt-2 text-gray-600">Browse our catalog of apparel, promotional products, and 3D printed items.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                !selectedCategory ? 'bg-sky-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              All Products
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.slug ? 'bg-sky-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
            <p className="mt-4 text-gray-500">No products found. Try a different search or filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:border-sky-200 transition-all flex flex-col"
              >
                <div className="aspect-square overflow-hidden bg-gray-100 relative">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.featured && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-400 text-amber-900 text-xs font-bold shadow-sm">
                      Featured
                    </span>
                  )}
                  {!product.in_stock && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white font-semibold">Out of Stock</span>
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-base font-semibold text-gray-900">{product.name}</h3>
                  <p className="mt-1 text-sm text-gray-500 leading-relaxed line-clamp-2 flex-1">{product.description}</p>
                  {product.supplier && (
                    <p className="mt-2 text-xs text-gray-400">Supplier: {product.supplier === 'sanmar' ? 'SanMar' : 'OneStop'}</p>
                  )}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.in_stock}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                        !product.in_stock
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : addedId === product.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-sky-600 text-white hover:bg-sky-700 shadow-sm'
                      }`}
                    >
                      {addedId === product.id ? (
                        <><Check className="w-4 h-4" /> Added</>
                      ) : (
                        <><ShoppingBag className="w-4 h-4" /> Add</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
