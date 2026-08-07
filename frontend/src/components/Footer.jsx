import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-color)', marginTop: '5rem', padding: '3.5rem 0 2rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '5px',
                background: 'var(--text-main)', color: 'var(--bg-main)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: '0.8rem'
              }}>
                D
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.03em' }}>
                Discovery<span style={{ color: 'var(--accent-ai)' }}>.ai</span>
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '0.85rem' }}>
              Enterprise Product Discovery & Personalization Platform powered by Gemini AI.
            </p>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <span className="badge badge-ai" style={{ fontSize: '0.68rem' }}><Sparkles size={11} /> Gemini 1.5 Flash</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.85rem', color: 'var(--text-main)' }}>
              Catalog Navigation
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <li><Link to="/" style={{ color: 'inherit' }}>Home Page</Link></li>
              <li><Link to="/browse" style={{ color: 'inherit' }}>Browse Catalog</Link></li>
              <li><Link to="/browse?category=laptops" style={{ color: 'inherit' }}>Laptops</Link></li>
              <li><Link to="/browse?category=audio" style={{ color: 'inherit' }}>Audio</Link></li>
              <li><Link to="/browse?category=gaming" style={{ color: 'inherit' }}>Gaming</Link></li>
              <li><Link to="/browse?category=smartphones" style={{ color: 'inherit' }}>Smartphones</Link></li>
            </ul>

          </div>

          {/* Intelligence Capabilities */}
          <div>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.85rem', color: 'var(--text-main)' }}>
              AI Engine
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <li>Intent Classification</li>
              <li>Multi-Factor Recommendation</li>
              <li>Explainable AI Rationale</li>
              <li>Ecosystem Smart Bundling</li>
            </ul>
          </div>

          {/* Admin & Security */}
          <div>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.85rem', color: 'var(--text-main)' }}>
              Administration
            </h4>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <div><Link to="/profile" style={{ color: 'inherit' }}>Customer Activity Profile</Link></div>
              <div>
                <Link to="/admin" style={{ color: 'var(--accent-ai)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Shield size={13} /> Admin Command Portal
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <div>
            © 2026 AI Discovery Engine. Enterprise Product Personalization Platform.
          </div>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <span>Privacy</span>
            <span>Terms</span>
            <span>API Docs</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
