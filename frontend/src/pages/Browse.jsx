import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Sparkles, Check, RotateCcw } from 'lucide-react';
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

  const hasActiveFilters = selectedCategory || selectedBrand || searchTerm || maxPrice !== '500000';

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      {/* Header Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em' }}>Product Discovery Catalog</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Showing {products.length} products {selectedCategory ? `in ${selectedCategory}` : ''} {searchTerm ? `matching "${searchTerm}"` : ''}
          </p>
        </div>

        {/* Sort Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <ArrowUpDown size={16} style={{ color: 'var(--accent-ai)' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '0.55rem 1.1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-surface)',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              fontWeight: 600,
              outline: 'none',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <option value="relevance">✨ AI Relevance & Rating</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem', background: 'var(--bg-surface)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>Active Filters:</span>
          {selectedCategory && (
            <span className="badge badge-ai" style={{ cursor: 'pointer' }} onClick={() => handleCategorySelect('')}>
              Category: {selectedCategory} <X size={12} />
            </span>
          )}
          {selectedBrand && (
            <span className="badge badge-warning" style={{ cursor: 'pointer' }} onClick={() => handleBrandSelect(selectedBrand)}>
              Brand: {selectedBrand} <X size={12} />
            </span>
          )}
          {searchTerm && (
            <span className="badge badge-success" style={{ cursor: 'pointer' }} onClick={() => { setSearchTerm(''); const p = new URLSearchParams(searchParams); p.delete('search'); setSearchParams(p); }}>
              Query: "{searchTerm}" <X size={12} />
            </span>
          )}
          {maxPrice !== '500000' && (
            <span className="badge badge-ai" style={{ cursor: 'pointer' }} onClick={() => setMaxPrice('500000')}>
              Max Budget: ₹{parseInt(maxPrice, 10).toLocaleString('en-IN')} <X size={12} />
            </span>
          )}
          <button onClick={handleResetFilters} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <RotateCcw size={12} /> Reset All
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '270px 1fr', gap: '2rem' }}>
        {/* Sidebar Filters */}
        <aside style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', height: 'fit-content', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontWeight: 900, fontSize: '1rem', color: 'var(--text-main)' }}>
              <Filter size={18} style={{ color: 'var(--accent-ai)' }} /> Filters
            </div>
            <button onClick={handleResetFilters} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
              Reset
            </button>
          </div>

          {/* Search Input */}
          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Keyword Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Title, brand, feature..."
              style={{
                width: '100%',
                padding: '0.55rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-main)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Category Filter */}
          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '0.6rem', color: 'var(--text-main)' }}>Category</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <button
                onClick={() => handleCategorySelect('')}
                style={{
                  textAlign: 'left',
                  background: !selectedCategory ? 'var(--badge-ai-bg)' : 'transparent',
                  color: !selectedCategory ? 'var(--accent-ai)' : 'var(--text-muted)',
                  border: !selectedCategory ? '1px solid var(--badge-ai-border)' : '1px solid transparent',
                  padding: '0.45rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  fontWeight: !selectedCategory ? 800 : 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
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
                      border: isActive ? '1px solid var(--badge-ai-border)' : '1px solid transparent',
                      padding: '0.45rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.85rem',
                      fontWeight: isActive ? 800 : 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              <span>Max Budget:</span>
              <span style={{ color: 'var(--accent-ai)', fontWeight: 900 }}>₹{parseInt(maxPrice, 10).toLocaleString('en-IN')}</span>
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
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '0.6rem', color: 'var(--text-main)' }}>Brand</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '240px', overflowY: 'auto' }}>
              {brandsList.map(b => {
                const isSelected = selectedBrand.toLowerCase() === b.toLowerCase();
                return (
                  <button
                    key={b}
                    onClick={() => handleBrandSelect(b)}
                    style={{
                      textAlign: 'left',
                      background: isSelected ? 'var(--badge-ai-bg)' : 'transparent',
                      color: isSelected ? 'var(--accent-ai)' : 'var(--text-muted)',
                      border: isSelected ? '1px solid var(--badge-ai-border)' : '1px solid transparent',
                      padding: '0.4rem 0.65rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.83rem',
                      fontWeight: isSelected ? 800 : 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>{b}</span>
                    {isSelected && <Check size={14} />}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main Product Grid */}
        <main>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: '340px', borderRadius: 'var(--radius-md)' }} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
              <X size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>No products match your criteria</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
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
