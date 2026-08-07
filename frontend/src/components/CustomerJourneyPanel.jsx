import React, { useState, useEffect } from 'react';
import { Compass, Clock, ArrowRight, TrendingDown, Users, CheckCircle2 } from 'lucide-react';
import API from '../services/api';
import { CustomerFunnelChart } from './RechartsWidgets';

export default function CustomerJourneyPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJourneyAnalytics();
  }, []);

  const fetchJourneyAnalytics = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/analytics/journey');
      if (res.data.success) {
        setData(res.data.journeyAnalytics);
      }
    } catch (err) {
      console.error('Fetch journey analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="skeleton" style={{ height: '300px', borderRadius: 'var(--radius-md)' }} />;
  }

  if (!data) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Journey KPI Header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Overall Funnel Conversion</span>
            <CheckCircle2 size={18} style={{ color: '#10b981' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{data.overallConversionRate}%</div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.25rem' }}>Home Visit → Checkout Purchase</div>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Avg Session Duration</span>
            <Clock size={18} style={{ color: '#3b82f6' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>
            {Math.floor(data.avgSessionDurationSec / 60)}m {data.avgSessionDurationSec % 60}s
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Active engagement time</div>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Tracked Unique Shoppers</span>
            <Users size={18} style={{ color: 'var(--accent-ai)' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{data.totalUsers}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>User journey sessions</div>
        </div>
      </div>

      {/* Customer Journey Conversion Funnel */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Compass size={18} style={{ color: 'var(--accent-ai)' }} /> Full Shopping Journey Conversion Funnel
        </h3>
        <CustomerFunnelChart data={data.funnelSteps} />
      </div>

      {/* Detailed Funnel Drop-off Table */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1.25rem' }}>
          Funnel Step Analysis & Drop-Off Percentages
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
          {data.funnelSteps.map((step, idx) => (
            <div key={idx} style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{step.icon}</div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{step.step}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-ai)' }}>{step.users}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {step.percentage}% of Traffic
              </div>
              {step.dropOff > 0 && (
                <div style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 700, marginTop: '0.35rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                  <TrendingDown size={12} /> {step.dropOff}% drop-off
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Most Common Customer Journey Paths */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem' }}>
          Most Common Customer Paths
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {data.commonPaths.map((pathItem, idx) => (
            <div key={idx} style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', fontWeight: 600 }}>
                <span style={{ color: 'var(--accent-ai)', fontWeight: 800 }}>#{idx + 1}</span>
                <span>{pathItem.path}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{pathItem.sessions} Sessions</span>
                <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>{pathItem.conversionRate} Conversion</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
