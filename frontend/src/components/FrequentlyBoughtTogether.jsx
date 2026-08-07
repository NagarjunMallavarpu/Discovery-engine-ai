import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Plus, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600';

/**
 * FrequentlyBoughtTogether – Amazon-style FBT widget.
 * Shows checkboxes for each complementary product with a combined price
 * and a 1-click "Add All Selected to Cart" button.
 */
export default function FrequentlyBoughtTogether({ sourceProduct, items = [], pricing }) {
  const { addToCart } = useCart();
  const [selected, setSelected] = useState(() => new Set(items.map(i => i.id)));
  const [adding, setAdding] = useState(false);
  const [done, setDone] = useState(false);

  if (!sourceProduct || items.length === 0) return null;

  const toggleItem = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectedItems = items.filter(i => selected.has(i.id));
  const selectedTotal = selectedItems.reduce((sum, i) => sum + i.price, 0) + sourceProduct.price;
  const selectedSavings = Math.round(selectedTotal * 0.10);
  const selectedBundlePrice = selectedTotal - selectedSavings;

  const handleAddAll = async () => {
    setAdding(true);
    const toAdd = [sourceProduct.id, ...selectedItems.map(i => i.id)];
    await Promise.all(toAdd.map(id => addToCart(id, 1)));
    setAdding(false);
    setDone(true);
    setTimeout(() => setDone(false), 2500);
  };

  const getPrimaryImage = (product) =>
    product.images?.find(i => i.isPrimary)?.url || product.images?.[0]?.url || FALLBACK_IMG;

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.75rem',
      marginTop: '2.5rem'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
        <div style={{
          width: '36px', height: '36px',
          background: 'linear-gradient(135deg, #f59e0b22, #ef444422)',
          borderRadius: 'var(--radius-sm)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.2rem'
        }}>🛒</div>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Frequently Bought Together
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Customers who bought this also bought these items
          </p>
        </div>
      </div>

      {/* Product Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {/* Source Product (always included, no checkbox) */}
        <FBTProductChip product={sourceProduct} fixed={true} getPrimaryImage={getPrimaryImage} />

        {items.map((item, idx) => (
          <React.Fragment key={item.id}>
            <span style={{ fontSize: '1.4rem', color: 'var(--text-muted)', fontWeight: 800, flexShrink: 0 }}>+</span>
            <FBTProductChip
              product={item}
              selected={selected.has(item.id)}
              onToggle={() => toggleItem(item.id)}
              getPrimaryImage={getPrimaryImage}
            />
          </React.Fragment>
        ))}
      </div>

      {/* Pricing Summary + Add Button */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '1rem 1.25rem',
        background: 'var(--bg-main)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)'
      }}>
        <div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
            Bundle Price ({1 + selectedItems.length} items):
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
              ₹{selectedBundlePrice.toLocaleString('en-IN')}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
              ₹{selectedTotal.toLocaleString('en-IN')}
            </span>
            <span style={{
              background: '#10b98120',
              color: '#10b981',
              border: '1px solid #10b98140',
              borderRadius: '999px',
              padding: '0.15rem 0.55rem',
              fontSize: '0.72rem',
              fontWeight: 700
            }}>
              Save ₹{selectedSavings.toLocaleString('en-IN')} (10% OFF)
            </span>
          </div>
        </div>

        <button
          onClick={handleAddAll}
          disabled={adding || selectedItems.length === 0}
          className="btn btn-primary"
          style={{
            padding: '0.65rem 1.4rem',
            fontSize: '0.9rem',
            background: done ? '#10b981' : undefined,
            opacity: selectedItems.length === 0 ? 0.5 : 1,
            transition: 'all 0.2s',
            minWidth: '200px'
          }}
        >
          {done
            ? <><Check size={16} /> Added to Cart!</>
            : adding
              ? 'Adding…'
              : <><ShoppingBag size={16} /> Add {1 + selectedItems.length} Items to Cart</>
          }
        </button>
      </div>
    </div>
  );
}

/** Individual FBT product chip with checkbox */
function FBTProductChip({ product, selected, onToggle, fixed = false, getPrimaryImage }) {
  const img = getPrimaryImage(product);
  return (
    <div
      onClick={!fixed ? onToggle : undefined}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.4rem',
        width: '110px',
        cursor: fixed ? 'default' : 'pointer',
        userSelect: 'none'
      }}
    >
      <div style={{
        position: 'relative',
        width: '88px', height: '88px',
        background: 'var(--bg-card)',
        border: `2px solid ${fixed ? 'var(--accent-ai)' : selected ? 'var(--accent-ai)' : 'var(--border-color)'}`,
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxShadow: (selected || fixed) ? 'var(--shadow-ai)' : 'none'
      }}>
        <img
          src={img}
          alt={product.title}
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG; }}
          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '0.4rem' }}
        />
        {!fixed && (
          <div style={{
            position: 'absolute',
            top: '4px', left: '4px',
            width: '18px', height: '18px',
            background: selected ? 'var(--accent-ai)' : 'var(--bg-surface)',
            border: `2px solid ${selected ? 'var(--accent-ai)' : 'var(--border-color)'}`,
            borderRadius: '4px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {selected && <Check size={11} color="white" strokeWidth={3} />}
          </div>
        )}
        {fixed && (
          <div style={{
            position: 'absolute', top: '4px', left: '4px',
            background: 'var(--accent-ai)', borderRadius: '4px',
            padding: '1px 5px', fontSize: '0.6rem', fontWeight: 700, color: '#fff'
          }}>
            This
          </div>
        )}
      </div>
      <div style={{
        fontSize: '0.68rem',
        color: 'var(--text-main)',
        textAlign: 'center',
        lineHeight: 1.3,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        height: '2.6em',
        fontWeight: 600
      }}>
        {product.title}
      </div>
      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-main)' }}>
        ₹{product.price.toLocaleString('en-IN')}
      </div>
    </div>
  );
}
