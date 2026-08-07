import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts = [], onRemove }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.65rem',
      maxWidth: '360px',
      width: '100%'
    }}>
      {toasts.map(t => (
        <div
          key={t.id}
          style={{
            background: 'var(--bg-card)',
            border: `1px solid ${t.type === 'error' ? '#ef4444' : t.type === 'info' ? 'var(--accent-ai)' : '#10b981'}`,
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.65rem',
            fontSize: '0.88rem',
            color: 'var(--text-main)',
            animation: 'fadeIn 0.2s ease-in-out'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {t.type === 'error' ? (
              <AlertCircle size={18} style={{ color: '#ef4444', flexShrink: 0 }} />
            ) : t.type === 'info' ? (
              <Info size={18} style={{ color: 'var(--accent-ai)', flexShrink: 0 }} />
            ) : (
              <CheckCircle size={18} style={{ color: '#10b981', flexShrink: 0 }} />
            )}
            <span>{t.message}</span>
          </div>

          <button
            onClick={() => onRemove(t.id)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
