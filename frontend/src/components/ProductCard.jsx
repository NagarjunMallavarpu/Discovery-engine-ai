import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingBag, Sparkles } from 'lucide-react';
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
        transition: 'all 0.25s ease'
      }}
    >
      {/* 1. PRODUCT IMAGE VIEWPORT */}
      <div style={{ position: 'relative', paddingTop: '72%', background: 'var(--bg-main)', overflow: 'hidden' }}>
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
              padding: '1.25rem',
              transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
          />
        </Link>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          style={{
            position: 'absolute', top: '0.6rem', right: '0.6rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '50%',
            width: '32px', height: '32px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: wishlisted ? '#ef4444' : 'var(--text-muted)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.2s ease',
            zIndex: 2
          }}
          title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart size={15} fill={wishlisted ? '#ef4444' : 'none'} />
        </button>

        {/* Small Discount Badge */}
        {discountPercent && (
          <div style={{
            position: 'absolute', top: '0.6rem', left: '0.6rem',
            fontSize: '0.68rem', fontWeight: 800, padding: '0.2rem 0.55rem',
            borderRadius: 'var(--radius-full)', background: 'rgba(16, 185, 129, 0.12)', color: '#10b981',
            border: '1px solid rgba(16, 185, 129, 0.28)',
            zIndex: 2
          }}>
            -{discountPercent}%
          </div>
        )}
      </div>

      {/* 2. CARD CONTENT AREA */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.4rem' }}>
        {/* BRAND & CATEGORY */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {product.brand}
          </span>

          {product.confidenceScore && (
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--accent-ai)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <Sparkles size={10} /> {Math.round(product.confidenceScore * 100)}% Match
            </span>
          )}
        </div>

        <Link to={`/products/${product.slug || product.id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{
            fontSize: '0.9rem',
            fontWeight: 800,
            color: 'var(--text-main)',
            lineHeight: 1.35,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            height: '2.7em'
          }}>
            {product.title}
          </h3>
        </Link>

        {/* RATING */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem' }}>
          <div style={{ display: 'flex', color: '#f59e0b' }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} fill={i < Math.floor(product.rating || 4.5) ? '#f59e0b' : 'none'} stroke="#f59e0b" />
            ))}
          </div>
          <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>{product.rating || 4.5}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>({product.reviewCount || 12})</span>
        </div>

        {/* EXPLAINABLE AI REASON CHIP */}
        {showReason && product.recommendationReason && (
          <div style={{
            fontSize: '0.72rem',
            color: 'var(--accent-ai)',
            background: 'var(--badge-ai-bg)',
            padding: '0.3rem 0.6rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--badge-ai-border)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            marginTop: '0.15rem',
            fontWeight: 600
          }}>
            💡 {product.recommendationReason}
          </div>
        )}

        {/* PRICE & ADD TO CART BUTTON */}
        <div style={{ marginTop: 'auto', paddingTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-main)' }}>
              ₹{product.price.toLocaleString('en-IN')}
            </div>
            {product.compareAtPrice && (
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                ₹{product.compareAtPrice.toLocaleString('en-IN')}
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="btn btn-primary"
            style={{
              padding: '0.45rem 0.85rem',
              fontSize: '0.78rem',
              borderRadius: 'var(--radius-md)',
              background: added ? '#10b981' : undefined,
              color: added ? '#ffffff' : undefined,
              transition: 'all 0.2s ease'
            }}
          >
            <ShoppingBag size={13} /> {added ? 'Added ✓' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
