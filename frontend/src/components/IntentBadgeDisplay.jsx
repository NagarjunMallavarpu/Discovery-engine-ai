import React from 'react';
import { Sparkles, Gamepad2, Briefcase, Camera, Activity, Home, Headphones, DollarSign, Crown } from 'lucide-react';

export default function IntentBadgeDisplay({ intentData, compact = false }) {
  if (!intentData || !intentData.primaryIntent) return null;

  const getIcon = (label) => {
    switch (label) {
      case 'Gaming Setup': return <Gamepad2 size={compact ? 12 : 15} />;
      case 'Office Setup': return <Briefcase size={compact ? 12 : 15} />;
      case 'Photography': return <Camera size={compact ? 12 : 15} />;
      case 'Fitness': return <Activity size={compact ? 12 : 15} />;
      case 'Smart Home': return <Home size={compact ? 12 : 15} />;
      case 'Audio Enthusiast': return <Headphones size={compact ? 12 : 15} />;
      case 'Budget Shopping': return <DollarSign size={compact ? 12 : 15} />;
      case 'Premium Buyer': return <Crown size={compact ? 12 : 15} />;
      default: return <Sparkles size={compact ? 12 : 15} />;
    }
  };

  const primary = intentData.primaryIntent;
  const secondary = intentData.secondaryIntent;
  const confidence = intentData.confidence || 85;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
      <div
        className="badge badge-ai pulse-ai"
        style={{
          fontSize: compact ? '0.7rem' : '0.8rem',
          padding: compact ? '0.2rem 0.55rem' : '0.35rem 0.75rem',
          boxShadow: 'var(--shadow-ai)'
        }}
      >
        {getIcon(primary)}
        <span>Detected Intent: <strong>{primary}</strong></span>
        <span style={{ opacity: 0.85, marginLeft: '0.2rem' }}>({confidence}% match)</span>
      </div>

      {secondary && !compact && (
        <div className="badge badge-warning" style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}>
          {getIcon(secondary)}
          <span>{secondary}</span>
        </div>
      )}
    </div>
  );
}
