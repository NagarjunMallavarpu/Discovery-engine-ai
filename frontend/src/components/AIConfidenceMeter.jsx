import React from 'react';

/**
 * AIConfidenceMeter – Visual confidence score display component.
 * Renders a glowing animated progress bar alongside a percentage label,
 * plus optional similarity and category match scores.
 */
export default function AIConfidenceMeter({
  confidence = 85,
  similarityScore = null,
  categoryMatchScore = null,
  compact = false
}) {
  const getColor = (pct) => {
    if (pct >= 90) return '#10b981'; // green
    if (pct >= 75) return '#7c3aed'; // ai purple
    if (pct >= 60) return '#3b82f6'; // blue
    return '#f59e0b';                 // amber
  };

  const primaryColor = getColor(confidence);

  if (compact) {
    // Compact inline version: just the percentage pill
    return (
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        background: 'var(--badge-ai-bg)',
        border: '1px solid var(--badge-ai-border)',
        borderRadius: '999px',
        padding: '0.15rem 0.5rem',
        fontSize: '0.7rem',
        fontWeight: 800,
        color: primaryColor
      }}>
        <svg width="10" height="10" viewBox="0 0 10 10">
          <circle cx="5" cy="5" r="4.5" fill="none" stroke={primaryColor} strokeWidth="1" opacity="0.3" />
          <circle
            cx="5" cy="5" r="4.5"
            fill="none"
            stroke={primaryColor}
            strokeWidth="1.5"
            strokeDasharray={`${(confidence / 100) * 28.3} 28.3`}
            transform="rotate(-90 5 5)"
          />
        </svg>
        {confidence}%
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Primary Confidence Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>AI Confidence</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: primaryColor }}>{confidence}%</span>
      </div>
      <div style={{
        height: '5px',
        background: 'var(--bg-surface-hover)',
        borderRadius: '999px',
        overflow: 'hidden',
        marginBottom: '0.45rem'
      }}>
        <div style={{
          height: '100%',
          width: `${confidence}%`,
          background: `linear-gradient(90deg, ${primaryColor}aa, ${primaryColor})`,
          borderRadius: '999px',
          boxShadow: `0 0 6px ${primaryColor}66`,
          transition: 'width 0.6s ease'
        }} />
      </div>

      {/* Secondary metrics row */}
      {(similarityScore !== null || categoryMatchScore !== null) && (
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {similarityScore !== null && (
            <div style={{ flex: 1, minWidth: '80px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Similarity</span>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#3b82f6' }}>{similarityScore}%</span>
              </div>
              <div style={{ height: '3px', background: 'var(--bg-surface-hover)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${similarityScore}%`, background: '#3b82f6', borderRadius: '999px' }} />
              </div>
            </div>
          )}
          {categoryMatchScore !== null && (
            <div style={{ flex: 1, minWidth: '80px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Category</span>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#f59e0b' }}>{categoryMatchScore}%</span>
              </div>
              <div style={{ height: '3px', background: 'var(--bg-surface-hover)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${categoryMatchScore}%`, background: '#f59e0b', borderRadius: '999px' }} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
