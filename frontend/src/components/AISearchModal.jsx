import React, { useState } from 'react';
import { X, Sparkles, Search, Sliders, ArrowRight, Loader2, CornerDownLeft } from 'lucide-react';
import API from '../services/api';
import ProductCard from './ProductCard';

export default function AISearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const sampleQueries = [
    "Find a gaming laptop under ₹70,000",
    "Best phone for photography",
    "Wireless headphones for travelling",
    "Laptop for coding"
  ];

  const handleSearch = async (searchQuery) => {
    const q = searchQuery || query;
    if (!q.trim()) return;

    try {
      setLoading(true);
      const res = await API.post('/search/smart', { query: q });
      if (res.data.success) {
        setResult(res.data);
      }
    } catch (err) {
      console.error('Smart AI Search Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(9, 9, 11, 0.75)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      zIndex: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.25rem'
    }}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        width: '100%',
        maxWidth: '820px',
        maxHeight: '88vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header Bar */}
        <div style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-surface)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
            <Sparkles size={16} style={{ color: 'var(--accent-ai)' }} />
            <span>AI Search Assistant</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', background: 'var(--bg-main)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              ESC to close
            </span>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Large Perplexity Style Search Bar & Quick Prompts */}
        <div style={{ padding: '1.25rem', background: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)' }}>
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} style={{ display: 'flex', gap: '0.65rem', marginBottom: '1rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                placeholder="Ask naturally: 'Find a gaming laptop under ₹70,000'..."
                style={{
                  width: '100%',
                  padding: '0.75rem 2.5rem 0.75rem 2.6rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--accent-ai)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxShadow: 'var(--shadow-sm)'
                }}
              />
              <Search size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-ai)' }} />
              <CornerDownLeft size={14} style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>

            <button type="submit" disabled={loading} className="btn btn-ai" style={{ padding: '0.75rem 1.4rem' }}>
              {loading ? <Loader2 size={16} className="spin" /> : <><Sparkles size={15} /> Search</>}
            </button>
          </form>

          {/* Quick Prompt Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Suggestions:</span>
            {sampleQueries.map((sq, i) => (
              <button
                key={i}
                onClick={() => { setQuery(sq); handleSearch(sq); }}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.25rem 0.65rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-ai)'; e.currentTarget.style.color = 'var(--accent-ai)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-main)'; }}
              >
                "{sq}"
              </button>
            ))}
          </div>
        </div>

        {/* Search Results & Thinking State Area */}
        <div style={{ padding: '1.25rem', overflowY: 'auto', flex: 1 }}>
          {loading && (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--accent-ai)' }}>
              <Loader2 size={32} className="spin" style={{ marginBottom: '0.85rem' }} />
              <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>Analyzing Intent & Parsing Catalog Specifications...</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Evaluating category affinity, budget limits, and technical requirements
              </p>
            </div>
          )}

          {!loading && result && (
            <div>
              {/* Parsed Intent Summary Header */}
              <div style={{
                background: 'var(--badge-ai-bg)',
                border: '1px solid var(--badge-ai-border)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                marginBottom: '1.25rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--accent-ai)', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                  <Sliders size={14} /> Parsed Intent Breakdown:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.4rem' }}>
                  {result.intent.category && (
                    <span className="badge badge-ai">Category: {result.intent.category}</span>
                  )}
                  {result.intent.maxPrice && (
                    <span className="badge badge-success">Max Budget: ₹{result.intent.maxPrice.toLocaleString('en-IN')}</span>
                  )}
                  {result.intent.brand && (
                    <span className="badge badge-warning">Brand: {result.intent.brand}</span>
                  )}
                  {result.intent.purpose && (
                    <span className="badge badge-ai">Purpose: {result.intent.purpose}</span>
                  )}
                  {result.intent.keywords?.map((kw, i) => (
                    <span key={i} className="badge" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}>
                      #{kw}
                    </span>
                  ))}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {result.intent.intentSummary}
                </div>
              </div>

              {/* Matched Products Grid */}
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-main)' }}>
                Matched Products ({result.count})
              </h3>

              {result.products.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
                  No exact products matched your criteria. Try adjusting budget or keywords.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                  {result.products.map(p => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          )}

          {!loading && !result && (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
              <Sparkles size={40} style={{ color: 'var(--accent-ai)', opacity: 0.6, marginBottom: '0.85rem' }} />
              <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 700, marginBottom: '0.4rem' }}>
                Ask Discovery AI Anything
              </h3>
              <p style={{ maxWidth: '420px', margin: '0 auto', fontSize: '0.82rem', lineHeight: 1.5 }}>
                Enter budget limits, features, or brands naturally to get instant AI-matched recommendations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
