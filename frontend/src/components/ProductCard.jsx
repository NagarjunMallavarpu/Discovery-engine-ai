import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product, showReason = true }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const wishlisted = isWishlisted(product.id);
  const primaryImage = product.images?.find(i => i.isPrimary)?.url || product.images?.[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500';

  const handleImageError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800';
  };

  const discountPercent = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : null;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await addToCart(product.id, 1);
    if (res?.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    } else if (res?.message) {
      alert(res.message);
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await toggleWishlist(product.id);
    if (!res?.success && res?.message) {
      alert(res.message);
    }
  };

  return (
    <div
      className="ai-glow-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease'
      }}
    >
      {/* 1. PRODUCT IMAGE VIEWPORT */}
      <div style={{ position: 'relative', paddingTop: '68%', background: 'var(--bg-main)', overflow: 'hidden' }}>
        <Link to={`/products/${product.slug || product.id}`}>
          <img
            src={primaryImage}
            alt={product.title}
            onError={handleImageError}
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%', height: '100%',
              objectFit: 'contain',
              padding: '1rem',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
          />
        </Link>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          style={{
            position: 'absolute', top: '0.5rem', right: '0.5rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '50%',
            width: '30px', height: '30px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: wishlisted ? '#ef4444' : 'var(--text-muted)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.15s'
          }}
        >
          <Heart size={14} fill={wishlisted ? '#ef4444' : 'none'} />
        </button>

        {/* Small Discount Badge */}
        {discountPercent && (
          <div style={{
            position: 'absolute', top: '0.5rem', left: '0.5rem',
            fontSize: '0.68rem', fontWeight: 800, padding: '0.15rem 0.5rem',
            borderRadius: 'var(--radius-full)', background: '#10b98115', color: '#10b981',
            border: '1px solid #10b98130'
          }}>
            -{discountPercent}%
          </div>
        )}
      </div>

      {/* 2. CARD CONTENT AREA */}
      <div style={{ padding: '0.9rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.35rem' }}>
        {/* BRAND & NAME */}
        <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {product.brand}
        </div>

        <Link to={`/products/${product.slug || product.id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{
            fontSize: '0.88rem',
            fontWeight: 700,
            color: 'var(--text-main)',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            height: '2.6em'
          }}>
            {product.title}
          </h3>
        </Link>

        {/* RATING */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.73rem' }}>
          <div style={{ display: 'flex', color: '#f59e0b' }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={11} fill={i < Math.floor(product.rating || 4.5) ? '#f59e0b' : 'none'} />
            ))}
          </div>
          <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>{product.rating || 4.5}</span>
          <span style={{ color: 'var(--text-muted)' }}>({product.reviewCount || 12})</span>
        </div>

        {/* ONE-LINE AI RECOMMENDATION CHIP */}
        {showReason && product.recommendationReason && (
          <div style={{
            fontSize: '0.7rem',
            color: 'var(--accent-ai)',
            background: 'var(--badge-ai-bg)',
            padding: '0.25rem 0.5rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--badge-ai-border)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            marginTop: '0.1rem'
          }}>
            💡 {product.recommendationReason}
          </div>
        )}

        {/* PRICE & ADD TO CART BUTTON */}
        <div style={{ marginTop: 'auto', paddingTop: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.compareAtPrice && (
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: '0.3rem' }}>
                ₹{product.compareAtPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="btn btn-primary"
            style={{
              padding: '0.35rem 0.75rem',
              fontSize: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              background: added ? '#10b981' : undefined,
              transition: 'all 0.2s'
            }}
          >
            <ShoppingBag size={12} /> {added ? 'Added ✓' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
