import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingBag, Heart, Check, Sparkles, Cpu, ShieldCheck, ArrowRight } from 'lucide-react';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import AIConfidenceMeter from '../components/AIConfidenceMeter';
import FrequentlyBoughtTogether from '../components/FrequentlyBoughtTogether';
import CompleteTheLookBundle from '../components/CompleteTheLookBundle';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [fbtData, setFbtData] = useState(null);
  const [bundleData, setBundleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/products/${id}`);
      if (res.data.success) {
        const prod = res.data.product;
        setProduct(prod);
        const images = prod.images || [];
        setSelectedImage(images[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800');

        // Fetch Similar Products, FBT, & Smart Bundle data
        const [simRes, fbtRes, bundleRes] = await Promise.all([
          API.get(`/recommendations/similar/${prod.id}?limit=6`),
          API.get(`/recommendations/frequently-bought/${prod.id}?limit=3`),
          API.get(`/recommendations/smart-bundle/${prod.id}?limit=4`)
        ]);

        if (simRes.data.success) setSimilarProducts(simRes.data.recommendations);
        if (fbtRes.data.success && fbtRes.data.items?.length > 0) setFbtData(fbtRes.data);
        if (bundleRes.data.success && bundleRes.data.items?.length > 0) setBundleData(bundleRes.data);
      }
    } catch (err) {
      console.error('Fetch product detail error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
          <div className="skeleton" style={{ height: '420px', borderRadius: 'var(--radius-lg)' }} />
          <div>
            <div className="skeleton" style={{ height: '40px', width: '70%', marginBottom: '1rem' }} />
            <div className="skeleton" style={{ height: '24px', width: '40%', marginBottom: '2rem' }} />
            <div className="skeleton" style={{ height: '140px', marginBottom: '2rem' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <Link to="/browse" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Catalog</Link>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);
  const specs = product.specifications ? JSON.parse(product.specifications) : {};

  const handleAddToCart = async () => {
    const res = await addToCart(product.id, quantity);
    if (res?.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } else if (res?.message) {
      alert(res.message);
    }
  };

  return (
    <div style={{ paddingBottom: '6rem' }}>
      <div className="container" style={{ paddingTop: '2.5rem' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          <Link to="/" style={{ color: 'inherit' }}>Home</Link> / <Link to="/browse" style={{ color: 'inherit' }}>Products</Link> / <Link to={`/browse?category=${product.category?.slug}`} style={{ color: 'inherit' }}>{product.category?.name}</Link> / <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{product.title}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3.5rem', alignItems: 'start' }}>
          {/* Left: Product Images Gallery */}
          <div>
            <div style={{ position: 'relative', width: '100%', paddingTop: '80%', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '1.25rem', boxShadow: 'var(--shadow-md)' }}>
              <img
                src={selectedImage}
                alt={product.title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800';
                }}
                style={{
                  position: 'absolute', top: 0, left: 0,
                  width: '100%', height: '100%',
                  objectFit: 'contain', padding: '1.75rem',
                  transition: 'transform 0.35s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
              />
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img.url)}
                    style={{
                      width: '68px',
                      height: '68px',
                      borderRadius: 'var(--radius-md)',
                      border: selectedImage === img.url ? '2px solid var(--accent-ai)' : '1px solid var(--border-color)',
                      background: 'var(--bg-surface)',
                      padding: '0.25rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info & AI Intelligence Box */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="badge" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}>
                {product.brand}
              </span>
              <span className="badge" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                {product.category?.name}
              </span>
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1.2, marginBottom: '0.75rem', color: 'var(--text-main)', letterSpacing: '-0.03em' }}>
              {product.title}
            </h1>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', color: '#f59e0b' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < Math.floor(product.rating || 4.5) ? '#f59e0b' : 'none'} />
                ))}
              </div>
              <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{product.rating || 4.5}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>({product.reviewCount || 12} Verified Reviews)</span>
            </div>

            {/* Price Box */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                <span style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--text-main)' }}>
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.compareAtPrice && (
                  <span style={{ fontSize: '1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                    ₹{product.compareAtPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700, marginTop: '0.25rem' }}>
                <Check size={14} style={{ display: 'inline', marginRight: '4px' }} /> In Stock ({product.stock} units available)
              </div>
            </div>

            {/* DEEP AI INFORMATION SECTION */}
            <div style={{ background: 'var(--badge-ai-bg)', border: '1px solid var(--badge-ai-border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.75rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-ai)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={16} /> Why Recommended & AI Rationale
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.5, marginBottom: '1rem' }}>
                "{product.recommendationReason || `Recommended for you because this item matches your interest in ${product.category?.name || 'this catalog'} and high quality standards.`}"
              </p>

              {/* Multi-Bar AI Confidence Score */}
              <div style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--badge-ai-border)' }}>
                <AIConfidenceMeter
                  confidence={product.matchScore || 88}
                  similarityScore={product.similarityScore || 92}
                  categoryMatchScore={product.categoryMatchScore || 85}
                />
              </div>
            </div>

            {/* Quantity & Actions */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)' }}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: '0.65rem 0.9rem', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 800, color: 'var(--text-main)' }}>-</button>
                <span style={{ padding: '0 0.5rem', fontWeight: 700, color: 'var(--text-main)' }}>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} style={{ padding: '0.65rem 0.9rem', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 800, color: 'var(--text-main)' }}>+</button>
              </div>

              <button
                onClick={handleAddToCart}
                className="btn btn-primary"
                style={{
                  flex: 1,
                  minWidth: '180px',
                  padding: '0.75rem',
                  background: added ? '#10b981' : undefined
                }}
              >
                <ShoppingBag size={17} /> {added ? `Added ${quantity} Item(s) ✓` : 'Add to Cart'}
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className="btn btn-outline"
                style={{ padding: '0.75rem 1rem', borderColor: wishlisted ? '#ef4444' : 'var(--border-color)', color: wishlisted ? '#ef4444' : 'var(--text-main)' }}
              >
                <Heart size={18} fill={wishlisted ? '#ef4444' : 'none'} />
              </button>
            </div>

            {/* Product Overview */}
            <div style={{ marginBottom: '1.75rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.5rem' }}>Product Overview</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{product.description}</p>
            </div>

            {/* Technical Specifications Table */}
            {Object.keys(specs).length > 0 && (
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.5rem' }}>Technical Specifications</h3>
                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  {Object.entries(specs).map(([key, val], idx) => (
                    <div key={key} style={{ display: 'grid', gridTemplateColumns: '150px 1fr', padding: '0.6rem 0.85rem', fontSize: '0.82rem', background: idx % 2 === 0 ? 'transparent' : 'var(--bg-main)' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>{key}</span>
                      <span style={{ color: 'var(--text-main)' }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FREQUENTLY BOUGHT TOGETHER WIDGET */}
        {fbtData && (
          <div style={{ marginTop: '3.5rem' }}>
            <FrequentlyBoughtTogether
              sourceProduct={fbtData.sourceProduct}
              items={fbtData.items}
              pricing={fbtData.pricing}
            />
          </div>
        )}

        {/* COMPLETE THE LOOK / SMART BUNDLE WIDGET */}
        {bundleData && (
          <div style={{ marginTop: '3.5rem' }}>
            <CompleteTheLookBundle
              sourceProduct={bundleData.sourceProduct}
              items={bundleData.items}
              pricing={bundleData.pricing}
            />
          </div>
        )}

        {/* SIMILAR PRODUCTS HORIZONTAL SNAP CAROUSEL */}
        {similarProducts.length > 0 && (
          <section style={{ marginTop: '4rem', borderTop: '1px solid var(--border-color)', paddingTop: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Cpu size={20} style={{ color: 'var(--accent-ai)' }} />
                <h2 style={{ fontSize: '1.4rem', fontWeight: 900 }}>Similar Products</h2>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Scroll horizontally →</span>
            </div>

            {/* Horizontal Snap Scroll Container */}
            <div style={{
              display: 'flex',
              gap: '1.25rem',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              paddingBottom: '1rem'
            }}>
              {similarProducts.map(p => (
                <div key={p.id} style={{ minWidth: '240px', flex: '0 0 240px', scrollSnapAlign: 'start' }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* STICKY ADD TO CART BAR */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-color)',
        padding: '0.75rem 1.5rem',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <img src={selectedImage} alt="" style={{ width: '42px', height: '42px', objectFit: 'contain' }} />
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>{product.title}</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--accent-ai)' }}>₹{product.price.toLocaleString('en-IN')}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button
            onClick={handleAddToCart}
            className="btn btn-primary"
            style={{ padding: '0.6rem 1.5rem', fontSize: '0.88rem', background: added ? '#10b981' : undefined }}
          >
            <ShoppingBag size={16} /> {added ? 'Added ✓' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
