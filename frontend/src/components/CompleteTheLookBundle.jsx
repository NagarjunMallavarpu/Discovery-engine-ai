import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShoppingBag, Check, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600';

/**
 * CompleteTheLookBundle – Curated 4-piece ecosystem bundle widget.
 * Displays items in a premium showcase grid with a 10% bundle savings pill
 * and a 1-click "Get Complete Bundle" button.
 */
export default function CompleteTheLookBundle({ sourceProduct, items = [], pricing }) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [done, setDone] = useState(false);

  if (!sourceProduct || items.length === 0) return null;

  const handleGetBundle = async () => {
    setAdding(true);
    // Add all bundle items (source product may already be in cart, but let's include add for completeness)
    await Promise.all(items.map(item => addToCart(item.id, 1)));
    setAdding(false);
    setDone(true);
    setTimeout(() => setDone(false), 2500);
  };

  const getPrimaryImage = (product) =>
    product.images?.find(i => i.isPrimary)?.url || product.images?.[0]?.url || FALLBACK_IMG;

  const savings = pricing?.savings || 0;
  const bundlePrice = pricing?.bundlePrice || 0;
  const totalOriginal = pricing?.totalOriginal || 0;

  return (
    <div style={{
      marginTop: '2.5rem',
      background: 'linear-gradient(135deg, rgba(124,58,237,0.06) 0%, rgba(59,130,246,0.06) 100%)',
      border: '1px solid var(--badge-ai-border)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.75rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative glow */}
      <div style={{
        position: 'absolute', top: '-60px', right: '-60px',
        width: '180px', height: '180px',
        background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '40px', height: '40px',
            background: 'linear-gradient(135deg, var(--accent-ai), #3b82f6)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Sparkles size={20} color="white" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Complete The Look
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              AI-curated ecosystem bundle for your {sourceProduct.category?.name || 'product'}
            </p>
          </div>
        </div>

        {savings > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #10b98120, #059669 20%)',
            border: '1px solid #10b98140',
            borderRadius: '999px',
            padding: '0.3rem 0.9rem',
            fontSize: '0.8rem',
            fontWeight: 800,
            color: '#10b981',
            display: 'flex', alignItems: 'center', gap: '0.3rem'
          }}>
            <Zap size={13} /> Save ₹{savings.toLocaleString('en-IN')} on Bundle
          </div>
        )}
      </div>

      {/* Bundle Items Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.min(items.length, 4)}, 1fr)`,
        gap: '0.85rem',
        marginBottom: '1.5rem'
      }}>
        {items.map(item => (
          <BundleItemCard
            key={item.id}
            item={item}
            getPrimaryImage={getPrimaryImage}
          />
        ))}
      </div>

      {/* Bundle Pricing & CTA */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '1rem 1.25rem',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)'
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
            Complete bundle ({items.length} add-on items):
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
              ₹{bundlePrice.toLocaleString('en-IN')}
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
              ₹{totalOriginal.toLocaleString('en-IN')}
            </span>
            <span style={{
              background: '#7c3aed20', color: 'var(--accent-ai)',
              border: '1px solid var(--badge-ai-border)',
              borderRadius: '999px', padding: '0.1rem 0.55rem',
              fontSize: '0.7rem', fontWeight: 700
            }}>
              {pricing?.discountPercent || 10}% Bundle Discount
            </span>
          </div>
        </div>

        <button
          onClick={handleGetBundle}
          disabled={adding}
          className="btn btn-ai"
          style={{
            padding: '0.7rem 1.5rem',
            fontSize: '0.9rem',
            background: done ? '#10b981' : undefined,
            borderColor: done ? '#10b981' : undefined,
            minWidth: '220px',
            transition: 'all 0.2s'
          }}
        >
          {done
            ? <><Check size={16} /> Bundle Added to Cart!</>
            : adding
              ? 'Adding bundle…'
              : <><Sparkles size={16} /> Get Complete Bundle</>
          }
        </button>
      </div>
    </div>
  );
}

/** Single bundle item card */
function BundleItemCard({ item, getPrimaryImage }) {
  const img = getPrimaryImage(item);

  return (
    <Link
      to={`/products/${item.slug || item.id}`}
      style={{ textDecoration: 'none' }}
    >
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
          cursor: 'pointer'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'var(--accent-ai)';
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-ai)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--border-color)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <img
          src={img}
          alt={item.title}
          onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG; }}
          style={{ width: '64px', height: '64px', objectFit: 'contain' }}
        />
        <div style={{
          fontSize: '0.72rem',
          fontWeight: 600,
          color: 'var(--text-main)',
          textAlign: 'center',
          lineHeight: 1.3,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          height: '2.6em'
        }}>
          {item.title}
        </div>

        {item.bundleReason && (
          <div style={{
            fontSize: '0.62rem', color: 'var(--accent-ai)',
            background: 'var(--badge-ai-bg)',
            padding: '0.15rem 0.4rem',
            borderRadius: 'var(--radius-sm)',
            textAlign: 'center',
            lineHeight: 1.2
          }}>
            {item.bundleReason}
          </div>
        )}

        <div style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--text-main)' }}>
          ₹{item.price.toLocaleString('en-IN')}
        </div>

        {item.pairScore && (
          <div style={{
            fontSize: '0.6rem', fontWeight: 700,
            color: item.pairScore >= 85 ? '#10b981' : 'var(--accent-ai)',
            background: item.pairScore >= 85 ? '#10b98115' : 'var(--badge-ai-bg)',
            padding: '0.1rem 0.35rem',
            borderRadius: '999px',
            border: `1px solid ${item.pairScore >= 85 ? '#10b98140' : 'var(--badge-ai-border)'}`
          }}>
            {item.pairScore}% match
          </div>
        )}
      </div>
    </Link>
  );
}
