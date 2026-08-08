import React, { useState, useEffect } from 'react';
import { X, Sparkles, Search, Sliders, ArrowRight, Loader2, CornerDownLeft, Command, ShieldCheck, Tag, DollarSign, Target } from 'lucide-react';
import API from '../services/api';
import ProductCard from './ProductCard';

export default function AISearchModal({ isOpen, initialQuery = '', onClose }) {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (isOpen && initialQuery) {
      setQuery(initialQuery);
      handleSearch(initialQuery);
    }
  }, [isOpen, initialQuery]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sampleQueries = [
    "Find a gaming laptop under ₹1,50,000",
    "Best flagship smartphone for camera and titanium build",
    "Audiophile noise canceling wireless headphones",
    "Curved OLED ultrawide monitor for coding & gaming"
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
      background: 'rgba(6, 8, 16, 0.78)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      zIndex: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.25rem'
    }}>
      <div className="glass-panel" style={{
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 40px var(--accent-ai-glow)',
        width: '100%',
        maxWidth: '860px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid var(--badge-ai-border)'
      }}>
        {/* Header Bar */}
        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-surface)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)' }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: 'var(--accent-ai-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Sparkles size={14} className="pulse-ai" />
            </div>
            <span>Discovery Engine <span className="text-gradient-brand">Smart Command Palette</span></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', background: 'var(--bg-main)', padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              ESC to exit
            </span>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Search Bar & Quick Suggestions */}
        <div style={{ padding: '1.25rem 1.5rem', background: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)' }}>
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                placeholder="Ask natural questions: 'Gaming laptop under ₹1.5L with high refresh rate'..."
                style={{
                  width: '100%',
                  padding: '0.85rem 2.8rem 0.85rem 2.8rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--accent-ai)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  fontSize: '0.98rem',
                  fontWeight: 600,
                  outline: 'none',
                  boxShadow: '0 0 20px var(--accent-ai-glow)'
                }}
              />
              <Search size={20} style={{ position: 'absolute', left: '0.95rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-ai)' }} />
              <CornerDownLeft size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>

            <button type="submit" disabled={loading} className="btn btn-ai" style={{ padding: '0.85rem 1.5rem', fontSize: '0.9rem' }}>
              {loading ? <Loader2 size={18} className="spin" /> : <><Sparkles size={16} /> Parse & Search</>}
            </button>
          </form>

          {/* Quick Prompt Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Popular Prompts:</span>
            {sampleQueries.map((sq, i) => (
              <button
                key={i}
                onClick={() => { setQuery(sq); handleSearch(sq); }}
                className="prompt-chip"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
              >
                {sq}
              </button>
            ))}
          </div>
        </div>

        {/* Content & Results */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          {loading && (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--accent-ai)' }}>
              <Loader2 size={36} className="spin" style={{ marginBottom: '1rem' }} />
              <p style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>Parsing Natural Language Intent with Gemini 1.5 Flash...</p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Calculating vector similarity, category affinity score, and price constraints
              </p>
            </div>
          )}

          {!loading && result && (
            <div>
              {/* Parsed Intent Summary Card */}
              <div style={{
                background: 'var(--badge-ai-bg)',
                border: '1px solid var(--badge-ai-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.25rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: 'var(--accent-ai)', fontSize: '0.85rem', marginBottom: '0.6rem' }}>
                  <Sliders size={16} /> Extracted Search Parameters & Entity Parsing:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.6rem' }}>
                  {result.intent.category && (
                    <span className="badge badge-ai"><Tag size={12} /> Category: {result.intent.category}</span>
                  )}
                  {result.intent.maxPrice && (
                    <span className="badge badge-success"><DollarSign size={12} /> Max Budget: ₹{result.intent.maxPrice.toLocaleString('en-IN')}</span>
                  )}
                  {result.intent.brand && (
                    <span className="badge badge-warning"><Target size={12} /> Brand: {result.intent.brand}</span>
                  )}
                  {result.intent.purpose && (
                    <span className="badge badge-ai">Use Case: {result.intent.purpose}</span>
                  )}
                  {result.intent.keywords?.map((kw, i) => (
                    <span key={i} className="badge" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}>
                      #{kw}
                    </span>
                  ))}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.4 }}>
                  {result.intent.intentSummary}
                </div>
              </div>

              {/* Matched Products Grid */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-main)' }}>
                  Matched Products ({result.count})
                </h3>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-ai)' }}>
                  Scored in &lt;15ms
                </span>
              </div>

              {result.products.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  No exact products matched your search parameters. Try broadening budget or keyword criteria.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '1.2rem' }}>
                  {result.products.map(p => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          )}

          {!loading && !result && (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--badge-ai-bg)', color: 'var(--accent-ai)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <Sparkles size={30} className="pulse-ai" />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 800, marginBottom: '0.5rem' }}>
                Ask Discovery Engine AI Anything
              </h3>
              <p style={{ maxWidth: '460px', margin: '0 auto', fontSize: '0.88rem', lineHeight: 1.5, color: 'var(--text-muted)' }}>
                Describe what you are looking for in natural plain language. Gemini 1.5 Flash parses budget limits, specs, and brand affinities instantly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
