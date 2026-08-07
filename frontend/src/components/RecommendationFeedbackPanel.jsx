import React, { useState, useEffect } from 'react';
import { Sparkles, MousePointer, ShoppingBag, CheckCircle, EyeOff, Target, Award } from 'lucide-react';
import API from '../services/api';
import { RecFeedbackFunnelChart, RecTypePerformanceChart } from './RechartsWidgets';

export default function RecommendationFeedbackPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbackAnalytics();
  }, []);

  const fetchFeedbackAnalytics = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/analytics/recommendations');
      if (res.data.success) {
        setData(res.data.recommendationAnalytics);
      }
    } catch (err) {
      console.error('Fetch recommendation feedback analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="skeleton" style={{ height: '300px', borderRadius: 'var(--radius-md)' }} />;
  }

  if (!data || !data.summary) return null;

  const s = data.summary;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Feedback Metric Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Recommendation CTR</span>
            <MousePointer size={18} style={{ color: 'var(--accent-ai)' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{s.ctr}%</div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.25rem' }}>{s.clicked} total clicks</div>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Recommendation Conv. Rate</span>
            <ShoppingBag size={18} style={{ color: '#10b981' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{s.conversionRate}%</div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.25rem' }}>{s.purchased} purchases converted</div>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Recommendation Accuracy</span>
            <Target size={18} style={{ color: '#f59e0b' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{s.recommendationAccuracy}%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Precision match score</div>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Ignored Impressions</span>
            <EyeOff size={18} style={{ color: '#ef4444' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{s.ignored}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Unclicked feed items</div>
        </div>
      </div>

      {/* Feedback Event Pipeline & Engine Performance Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.75rem' }}>
        {/* Recommendation Engagement Pipeline */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} style={{ color: 'var(--accent-ai)' }} /> Recommendation Engagement Pipeline
          </h3>
          <RecFeedbackFunnelChart data={data.feedbackFunnel} />
        </div>

        {/* Algorithm Performance CTR by Engine Type */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={18} style={{ color: '#f59e0b' }} /> CTR Performance by Engine Feed Type
          </h3>
          <RecTypePerformanceChart data={data.performanceByType} />
        </div>
      </div>

      {/* Best Performing Categories Table */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1.25rem' }}>
          Best Performing Categories (Recommendation Revenue Driven)
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem' }}>Category</th>
                <th style={{ padding: '0.75rem' }}>Recommendation CTR</th>
                <th style={{ padding: '0.75rem' }}>Revenue Driven</th>
                <th style={{ padding: '0.75rem' }}>Performance Status</th>
              </tr>
            </thead>
            <tbody>
              {data.topCategories.map((cat, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 700 }}>{cat.category}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{ fontWeight: 800, color: 'var(--accent-ai)' }}>{cat.ctr}%</span>
                  </td>
                  <td style={{ padding: '0.75rem', fontWeight: 800 }}>
                    ₹{cat.revenue.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>Top Performer</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
