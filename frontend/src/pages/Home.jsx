import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Search, ArrowRight, Zap, Cpu, ShieldCheck, Flame, Layers, Activity, CheckCircle2, PackageCheck, Smartphone, Laptop, Gamepad2, Headphones, Monitor, Compass } from 'lucide-react';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import CompleteTheLookBundle from '../components/CompleteTheLookBundle';

export default function Home({ onOpenAISearch }) {
  const [personalizedRecs, setPersonalizedRecs] = useState([]);
  const [trendingRecs, setTrendingRecs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [bundleData, setBundleData] = useState(null);
  const [loading, setLoading] = useState(true);

  const samplePrompts = [
    { label: '⚡ Gaming Laptop under ₹1.5L', query: 'gaming laptop under 150000 with RTX graphics' },
    { label: '🎧 Audiophile ANC Headphones', query: 'noise canceling wireless headphones for travel' },
    { label: '📱 Flagship Titanium Smartphone', query: 'flagship camera smartphone titanium build' },
    { label: '🖥️ Curved OLED Desk Setup', query: 'ultrawide curved OLED gaming monitor' }
  ];

  useEffect(() => {
    fetchHomeData();
  }, [selectedCategory]);

  const fetchHomeData = async () => {
    try {
      setLoading(true);

      // 1. Fetch Categories
      try {
        const catRes = await API.get('/categories');
        if (catRes.data?.success) setCategories(catRes.data.categories);
      } catch (e) {
        console.error('Categories fetch error:', e);
      }

      // 2. Fetch Personalized or Category Popular Recommendations
      try {
        const persRes = selectedCategory === 'all'
          ? await API.get('/recommendations/personalized?limit=8')
          : await API.get(`/recommendations/category-popular/${selectedCategory}?limit=8`);
        if (persRes.data?.success) setPersonalizedRecs(persRes.data.recommendations);
      } catch (e) {
        console.error('Personalized recs fetch error:', e);
      }

      // 3. Fetch Trending Items
      try {
        const trendRes = await API.get('/recommendations/trending?limit=4');
        if (trendRes.data?.success) setTrendingRecs(trendRes.data.recommendations);
      } catch (e) {
        console.error('Trending recs fetch error:', e);
      }

      // 4. Fetch Smart Bundle dynamically from active product catalog
      try {
        const prodRes = await API.get('/products?limit=1');
        if (prodRes.data?.success && prodRes.data.products.length > 0) {
          const firstProdId = prodRes.data.products[0].id;
          const bundleRes = await API.get(`/recommendations/smart-bundle/${firstProdId}?limit=4`);
          if (bundleRes.data?.success && bundleRes.data.items?.length > 0) {
            setBundleData(bundleRes.data);
          }
        }
      } catch (e) {
        console.error('Smart bundle fetch error:', e);
      }
    } catch (err) {
      console.error('Fetch home data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (slug) => {
    switch (slug) {
      case 'laptops': return <Laptop size={15} />;
      case 'smartphones': return <Smartphone size={15} />;
      case 'gaming': return <Gamepad2 size={15} />;
      case 'audio': return <Headphones size={15} />;
      case 'smart-home': return <Monitor size={15} />;
      default: return <Compass size={15} />;
    }
  };

  return (
    <div style={{ position: 'relative', overflowX: 'hidden' }}>
      {/* 1. HERO SECTION - APPLE / VERCEL / FRAMER AESTHETIC */}
      <section style={{
        position: 'relative',
        paddingTop: '3.5rem',
        paddingBottom: '5rem',
        borderBottom: '1px solid var(--border-color)',
        background: 'var(--bg-main)'
      }}>
        {/* Ambient Radial Mesh Lighting Backdrop */}
        <div className="hero-mesh-glow" />
        <div className="bg-blob-indigo" />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center'
          }}>
            {/* Left Column: Hero Copy & Actions */}
            <div>
              {/* AI Badge */}
              <div className="badge badge-ai pulse-ai" style={{ marginBottom: '1.25rem', padding: '0.35rem 0.85rem', fontSize: '0.78rem' }}>
                <Sparkles size={14} /> Powered by Gemini 1.5 Flash & Intent Detector
              </div>

              {/* Huge Headline */}
              <h1 style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
                fontWeight: 900,
                lineHeight: 1.08,
                letterSpacing: '-0.04em',
                marginBottom: '1.25rem'
              }}>
                Discover the <span className="text-gradient-brand">right product</span>, not just more products.
              </h1>

              {/* Subtitle */}
              <p style={{
                fontSize: '1.08rem',
                color: 'var(--text-muted)',
                lineHeight: 1.55,
                maxWidth: '520px',
                marginBottom: '1.75rem'
              }}>
                AI that understands what you actually need. Real-time natural language intent parsing, multi-factor confidence scoring, and automated ecosystem bundling.
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
                <button onClick={() => onOpenAISearch()} className="btn btn-ai" style={{ padding: '0.85rem 1.6rem', fontSize: '0.95rem' }}>
                  <Sparkles size={18} className="pulse-ai" /> Start AI Search
                </button>
                <Link to="/browse" className="btn btn-outline" style={{ padding: '0.85rem 1.6rem', fontSize: '0.95rem' }}>
                  Browse Catalog <ArrowRight size={16} />
                </Link>
              </div>

              {/* Quick AI Prompt Shortcut Chips */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Try asking AI:
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {samplePrompts.map((p, idx) => (
                    <button
                      key={idx}
                      className="prompt-chip"
                      onClick={() => onOpenAISearch(p.query)}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Animated Live Stats */}
              <div style={{ display: 'flex', gap: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)' }}>24+</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Flagship Tech Items</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent-ai)' }}>99.4%</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Intent Precision</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#10b981' }}>&lt;15ms</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Scoring Latency</div>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Interactive Glass Preview Stage */}
            <div style={{ position: 'relative' }}>
              {/* Main Stage Glass Background */}
              <div className="glass-panel glow-border-animated" style={{
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem',
                boxShadow: 'var(--shadow-lg)',
                position: 'relative'
              }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Activity size={14} style={{ color: 'var(--accent-ai)' }} /> Live Intelligence Engine
                  </span>
                  <span className="badge badge-success">ACTIVE</span>
                </div>

                {/* Floating AI Recommendation Card 1 */}
                <div className="animate-float-slow" style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--badge-ai-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.1rem',
                  boxShadow: 'var(--shadow-ai)',
                  marginBottom: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-ai)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Sparkles size={13} /> 98% Match Score
                    </span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>Real-Time Vector Match</span>
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                    Apple iPhone 15 Pro Max (256GB - Natural Titanium)
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                    "Matched for high camera affinity, A17 Pro gaming, and titanium build"
                  </div>
                  <div style={{ background: 'var(--bg-surface-hover)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '98%', height: '100%', background: 'var(--accent-ai-gradient)', borderRadius: '3px' }} />
                  </div>
                </div>

                {/* Floating Smart Bundle Pill Card 2 */}
                <div className="animate-float-delay" style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.95rem 1.1rem',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <PackageCheck size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>Complete The Look Bundle</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>4-Piece Ecosystem Package (Saves 10%)</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#10b981' }}>-₹35,379</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BENTO FEATURE SHOWCASE (APPLE / VERCEL STYLE) */}
      <section style={{ padding: '4.5rem 0', background: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem' }}>
            <span className="badge badge-ai" style={{ marginBottom: '0.75rem' }}>Architected for Discovery</span>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 900, marginBottom: '0.75rem' }}>
              Built for shoppers who know what they need.
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Traditional search relies on rigid keywords. Discovery Engine parses natural language intent and scores product ecosystems in milliseconds.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {/* Bento Card 1 */}
            <div className="ai-glow-card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--badge-ai-bg)', color: 'var(--accent-ai)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.1rem' }}>
                <Search size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem' }}>Natural Language Intent Search</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                Type queries like "gaming laptop under ₹70,000" and Gemini automatically extracts category, budget caps, and brand requirements.
              </p>
            </div>

            {/* Bento Card 2 */}
            <div className="ai-glow-card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--badge-ai-bg)', color: 'var(--accent-ai)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.1rem' }}>
                <Cpu size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem' }}>Multi-Metric Explainable AI</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                Every recommendation displays transparent Confidence %, Similarity %, and Category Match % scores so you know why an item was chosen.
              </p>
            </div>

            {/* Bento Card 3 */}
            <div className="ai-glow-card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--badge-ai-bg)', color: 'var(--accent-ai)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.1rem' }}>
                <Layers size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem' }}>Cross-Category Smart Bundles</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                Automated Frequently Bought Together and Complete The Look bundles pair your primary device with compatible ecosystem accessories.
              </p>
            </div>

            {/* Bento Card 4 */}
            <div className="ai-glow-card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--badge-ai-bg)', color: 'var(--accent-ai)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.1rem' }}>
                <Activity size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem' }}>Enterprise Analytics & Funnels</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                Full customer journey funnel tracking, zero-inventory demand alerts, and recommendation feedback loop metrics for admins.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY SELECTOR & RECOMMENDATIONS GRID */}
      <section style={{ padding: '4rem 0 5rem' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Recommended For You</h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                Multi-factor recommendation feed tailored to your session signals
              </p>
            </div>

            <Link to="/browse" style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-ai)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              Explore All Catalog <ArrowRight size={16} />
            </Link>
          </div>

          {/* Horizontal Category Pills with Icons */}
          <div style={{ display: 'flex', gap: '0.65rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '2rem' }}>
            <button
              onClick={() => setSelectedCategory('all')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: selectedCategory === 'all' ? 'var(--accent-ai-gradient)' : 'var(--bg-surface)',
                color: selectedCategory === 'all' ? '#ffffff' : 'var(--text-muted)',
                border: selectedCategory === 'all' ? 'none' : '1px solid var(--border-color)',
                borderRadius: 'var(--radius-full)',
                padding: '0.45rem 1.1rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: selectedCategory === 'all' ? '0 4px 14px var(--accent-ai-glow)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Compass size={15} /> All Feeds
            </button>

            {categories.map(c => {
              const isSelected = selectedCategory === c.slug;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.slug)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: isSelected ? 'var(--accent-ai-gradient)' : 'var(--bg-surface)',
                    color: isSelected ? '#ffffff' : 'var(--text-muted)',
                    border: isSelected ? 'none' : '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-full)',
                    padding: '0.45rem 1.1rem',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: isSelected ? '0 4px 14px var(--accent-ai-glow)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {getCategoryIcon(c.slug)}
                  {c.name}
                </button>
              );
            })}
          </div>

          {/* Product Grid */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.35rem' }}>
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: '340px', borderRadius: 'var(--radius-md)' }} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.35rem' }}>
              {personalizedRecs.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. TRENDING NOW SECTION */}
      {trendingRecs.length > 0 && (
        <section style={{ padding: '4rem 0', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <Flame size={22} style={{ color: '#ef4444' }} />
              <h2 style={{ fontSize: '1.6rem', fontWeight: 900 }}>Trending Now Across Catalog</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.35rem' }}>
              {trendingRecs.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. COMPLETE THE LOOK SMART BUNDLE SHOWCASE */}
      {bundleData && (
        <section style={{ padding: '4.5rem 0' }}>
          <div className="container">
            <CompleteTheLookBundle
              sourceProduct={bundleData.sourceProduct}
              items={bundleData.items}
              pricing={bundleData.pricing}
            />
          </div>
        </section>
      )}
    </div>
  );
}
