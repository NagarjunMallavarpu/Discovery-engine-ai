import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, CheckCircle2, RefreshCw, Zap, Lightbulb } from 'lucide-react';
import API from '../services/api';

export default function AIInsightsPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAIInsights();
  }, []);

  const fetchAIInsights = async () => {
    try {
      setLoading(true);
      const res = await API.get('/recommendations/ai-insights');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Fetch AI Insights error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="skeleton" style={{ height: '220px', borderRadius: 'var(--radius-lg)' }} />
    );
  }

  if (!data) return null;

  const intent = data.intent || {};
  const insights = data.aiInsights || {};
  const confidence = intent.confidence || 88;

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)',
      border: '1px solid var(--badge-ai-border)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.75rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background ambient glow */}
      <div style={{
        position: 'absolute', top: '-40px', right: '-40px',
        width: '160px', height: '160px',
        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Panel Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '38px', height: '38px',
            background: 'linear-gradient(135deg, var(--accent-ai), #3b82f6)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Brain size={20} color="white" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Real-Time AI Shopping Intelligence Panel
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Powered by Gemini 2.5 Flash Intent Engine & Behavioral Rationale
            </p>
          </div>
        </div>

        <button
          onClick={fetchAIInsights}
          className="btn btn-outline"
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
        >
          <RefreshCw size={13} /> Re-evaluate Intent
        </button>
      </div>

      {/* Main Insights Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
        {/* Intent & Confidence Card */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>
            Detected Intent Profile
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={18} style={{ color: 'var(--accent-ai)' }} /> {intent.primaryIntent || 'Gaming Setup'}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', marginTop: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Confidence Rating:</span>
            <span style={{ fontWeight: 800, color: '#10b981', background: '#10b98115', padding: '0.15rem 0.5rem', borderRadius: '999px', border: '1px solid #10b98140' }}>
              {confidence}% match
            </span>
          </div>

          {intent.secondaryIntent && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              Secondary Intent: <strong>{intent.secondaryIntent}</strong>
            </div>
          )}
        </div>

        {/* Gemini AI Recommendation Summary */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-ai)', fontWeight: 700, marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Lightbulb size={14} /> AI Recommendation Rationale & Shift
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5, fontStyle: 'italic' }}>
            "{insights.summary}"
          </p>
        </div>
      </div>

      {/* User Preference Summary Points */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.1rem' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
          Key Behavioral Preference Signals:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.65rem' }}>
          {insights.preferenceBreakdown?.map((point, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-main)' }}>
              <CheckCircle2 size={15} style={{ color: 'var(--accent-ai)', flexShrink: 0 }} />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
