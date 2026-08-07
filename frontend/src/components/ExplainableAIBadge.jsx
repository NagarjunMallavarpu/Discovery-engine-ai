import React, { useState } from 'react';
import { Sparkles, Info } from 'lucide-react';

export default function ExplainableAIBadge({ reason, matchScore }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        className="badge badge-ai"
        style={{ cursor: 'pointer', userSelect: 'none' }}
      >
        <Sparkles size={12} className="pulse-ai" />
        <span>{matchScore ? `${matchScore}% AI Match` : 'AI Recommended'}</span>
        <Info size={11} style={{ opacity: 0.7 }} />
      </div>

      {showTooltip && (
        <div style={{
          position: 'absolute',
          bottom: '125%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '260px',
          padding: '0.75rem',
          background: 'var(--bg-card)',
          color: 'var(--text-main)',
          border: '1px solid var(--badge-ai-border)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-ai)',
          fontSize: '0.78rem',
          zIndex: 60,
          pointerEvents: 'none'
        }}>
          <div style={{ fontWeight: 700, color: 'var(--accent-ai)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Sparkles size={13} /> Why this is recommended:
          </div>
          <div style={{ lineHeight: 1.4, color: 'var(--text-main)' }}>
            {reason || 'Matched based on your search intent, viewed categories, and product popularity.'}
          </div>
        </div>
      )}
    </div>
  );
}
