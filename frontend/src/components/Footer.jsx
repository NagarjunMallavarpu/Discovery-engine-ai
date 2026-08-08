import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Activity, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-color)', marginTop: '6rem', padding: '4rem 0 2rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '7px',
                background: 'var(--accent-ai-gradient)', color: '#ffffff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: '0.9rem',
                boxShadow: '0 4px 12px var(--accent-ai-glow)'
              }}>
                D
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.15rem', letterSpacing: '-0.03em', color: 'var(--text-main)' }}>
                Discovery<span className="text-gradient-brand">.ai</span>
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: '1rem' }}>
              Next-generation E-Commerce Product Discovery & Personalization Platform powered by Gemini AI.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-ai" style={{ fontSize: '0.72rem' }}><Sparkles size={12} className="pulse-ai" /> Gemini 1.5 Flash</span>
              <span className="badge badge-success" style={{ fontSize: '0.72rem' }}><Activity size={12} /> Operational</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-main)' }}>
              Catalog Navigation
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              <li><Link to="/" style={{ color: 'inherit' }}>Home Page</Link></li>
              <li><Link to="/browse" style={{ color: 'inherit' }}>Browse Catalog</Link></li>
              <li><Link to="/browse?category=laptops" style={{ color: 'inherit' }}>Laptops & Workstations</Link></li>
              <li><Link to="/browse?category=audio" style={{ color: 'inherit' }}>Audiophile Audio</Link></li>
              <li><Link to="/browse?category=gaming" style={{ color: 'inherit' }}>Gaming Ecosystems</Link></li>
              <li><Link to="/browse?category=smartphones" style={{ color: 'inherit' }}>Flagship Smartphones</Link></li>
            </ul>
          </div>

          {/* Intelligence Capabilities */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-main)' }}>
              AI Capabilities
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              <li>Real-Time Intent Parsing</li>
              <li>Multi-Factor Confidence Scoring</li>
              <li>Explainable AI Rationales</li>
              <li>Ecosystem Smart Bundling</li>
              <li>Feedback Loop Optimization</li>
            </ul>
          </div>

          {/* Admin & Security */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-main)' }}>
              Administration
            </h4>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div><Link to="/profile" style={{ color: 'inherit' }}>Customer Activity & Preferences</Link></div>
              <div>
                <Link to="/admin" style={{ color: 'var(--accent-ai)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Shield size={14} /> Admin Command Portal
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <div>
            © 2026 Discovery Engine AI. Built with Vite, React & Express.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', fontWeight: 500 }}>
            <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
            <span style={{ cursor: 'pointer' }}>Terms of Service</span>
            <span style={{ cursor: 'pointer' }}>API Specification</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
