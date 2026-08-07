import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Sparkles } from 'lucide-react';
import API from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '500000');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'relevance');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  useEffect(() => {
    fetchCategories();
  }, []);

  // Sync state when URL searchParams change
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || '');
    setSelectedBrand(searchParams.get('brand') || '');
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedBrand, maxPrice, sortBy, searchTerm, searchParams]);

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories');
      if (res.data.success) setCategories(res.data.categories);
    } catch (e) {
      console.error('Fetch categories error:', e);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const categoryFilter = searchParams.get('category') || selectedCategory;
      const brandFilter = searchParams.get('brand') || selectedBrand;
      const searchFilter = searchParams.get('search') || searchTerm;

      const params = new URLSearchParams();
      if (categoryFilter && categoryFilter !== 'all') params.append('category', categoryFilter);
      if (brandFilter && brandFilter !== 'all') params.append('brand', brandFilter);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (sortBy) params.append('sort', sortBy);
      if (searchFilter) params.append('search', searchFilter);

      const res = await API.get(`/products?${params.toString()}`);
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (e) {
      console.error('Fetch products error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (catSlug) => {
    setSelectedCategory(catSlug);
    const newParams = new URLSearchParams(searchParams);
    if (catSlug && catSlug !== 'all') {
      newParams.set('category', catSlug);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  const handleBrandSelect = (brandName) => {
    const nextBrand = selectedBrand.toLowerCase() === brandName.toLowerCase() ? '' : brandName;
    setSelectedBrand(nextBrand);
    const newParams = new URLSearchParams(searchParams);
    if (nextBrand) {
      newParams.set('brand', nextBrand);
    } else {
      newParams.delete('brand');
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setMaxPrice('500000');
    setSortBy('relevance');
    setSearchTerm('');
    setSearchParams({});
  };

  const brandsList = ['Apple', 'Asus', 'Sony', 'Samsung', 'Lenovo', 'Razer', 'Philips', 'Dell', 'Logitech', 'Bose', 'Roborock', 'Keychron'];

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
      {/* Header Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Product Discovery Catalog</h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Showing {products.length} items {selectedCategory ? `in ${selectedCategory}` : ''} {searchTerm ? `for "${searchTerm}"` : ''}
          </p>
        </div>

        {/* Sort Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowUpDown size={16} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-surface)',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="relevance">AI Relevance & Rating</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem' }}>
        {/* Sidebar Filters */}
        <aside style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '0.95rem' }}>
              <Filter size={18} /> Catalog Filters
            </div>
            <button onClick={handleResetFilters} style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
              Reset All
            </button>
          </div>

          {/* Search Input */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>Keyword Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Title, brand, tag..."
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-main)',
                color: 'var(--text-main)',
                fontSize: '0.85rem'
              }}
            />
          </div>

          {/* Category Filter */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>Category</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <button
                onClick={() => handleCategorySelect('')}
                style={{
                  textAlign: 'left',
                  background: !selectedCategory ? 'var(--badge-ai-bg)' : 'transparent',
                  color: !selectedCategory ? 'var(--accent-ai)' : 'var(--text-muted)',
                  border: 'none',
                  padding: '0.35rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  fontWeight: !selectedCategory ? 700 : 500,
                  cursor: 'pointer'
                }}
              >
                All Categories
              </button>
              {categories.map(c => {
                const isActive = selectedCategory.toLowerCase() === c.slug.toLowerCase() || selectedCategory.toLowerCase() === c.name.toLowerCase();
                return (
                  <button
                    key={c.id}
                    onClick={() => handleCategorySelect(c.slug)}
                    style={{
                      textAlign: 'left',
                      background: isActive ? 'var(--badge-ai-bg)' : 'transparent',
                      color: isActive ? 'var(--accent-ai)' : 'var(--text-muted)',
                      border: 'none',
                      padding: '0.35rem 0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                      fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer'
                    }}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              <span>Max Budget:</span>
              <span style={{ color: 'var(--accent-ai)' }}>₹{parseInt(maxPrice, 10).toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="5000"
              max="500000"
              step="5000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              style={{ width: '100%', accentColor: 'var(--accent-ai)', cursor: 'pointer' }}
            />
          </div>


          {/* Brand Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>Brand</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {brandsList.map(b => (
                <button
                  key={b}
                  onClick={() => handleBrandSelect(b)}
                  style={{
                    textAlign: 'left',
                    background: selectedBrand.toLowerCase() === b.toLowerCase() ? 'var(--badge-ai-bg)' : 'transparent',
                    color: selectedBrand.toLowerCase() === b.toLowerCase() ? 'var(--accent-ai)' : 'var(--text-muted)',
                    border: 'none',
                    padding: '0.35rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    fontWeight: selectedBrand.toLowerCase() === b.toLowerCase() ? 700 : 500,
                    cursor: 'pointer'
                  }}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Product Grid */}
        <main>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: '320px', borderRadius: 'var(--radius-md)' }} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
              <X size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No products match your criteria</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Try adjusting your price range or clearing category filters.
              </p>
              <button onClick={handleResetFilters} className="btn btn-primary">
                Clear Filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
