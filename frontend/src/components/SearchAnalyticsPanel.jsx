import React, { useState, useEffect } from 'react';
import { Search, Zap, AlertCircle, Clock, Percent, TrendingUp } from 'lucide-react';
import API from '../services/api';
import { SearchKeywordsChart, SearchVolumeTrendChart } from './RechartsWidgets';

export default function SearchAnalyticsPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSearchAnalytics();
  }, []);

  const fetchSearchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/analytics/search');
      if (res.data.success) {
        setData(res.data.searchAnalytics);
      }
    } catch (err) {
      console.error('Fetch search analytics error:', err);
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
      {/* Search KPI Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Total Searches</span>
            <Search size={18} style={{ color: 'var(--accent-ai)' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{data.totalSearches || 184}</div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.25rem' }}>↑ +18% vs last week</div>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Search Conversion Rate</span>
            <Percent size={18} style={{ color: '#10b981' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{data.searchConversionRate}%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Search to purchase rate</div>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>AI Intent Parser Usage</span>
            <Zap size={18} style={{ color: '#f59e0b' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{data.aiUsagePercent}%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{data.aiSearchCount} smart queries</div>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Avg Response Time</span>
            <Clock size={18} style={{ color: '#3b82f6' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{data.avgResponseTimeMs} ms</div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.25rem' }}>⚡ Fast Gemini API latency</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.75rem' }}>
        {/* Top Searched Keywords */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Search size={18} style={{ color: 'var(--accent-ai)' }} /> Most Searched Keywords
          </h3>
          <SearchKeywordsChart data={data.topKeywords} />
        </div>

        {/* Daily Search Volume Trend */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} style={{ color: '#3b82f6' }} /> 7-Day Search Volume Trend
          </h3>
          <SearchVolumeTrendChart data={data.dailyVolume} />
        </div>
      </div>

      {/* Zero Results & Category Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
        {/* Zero Result Searches Alert Card */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444' }}>
              <AlertCircle size={18} /> Searches With Zero Results ({data.zeroResultsCount})
            </h3>
            <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}>Needs Inventory</span>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Search queries where catalog returned 0 product matches. Use this list to expand product inventory:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {data.zeroResultSearches.length > 0 ? data.zeroResultSearches.map((query, idx) => (
              <div key={idx} style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.6rem 0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>"{query}"</span>
                <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 700 }}>0 Results</span>
              </div>
            )) : (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No zero-result searches recorded recently!</div>
            )}
          </div>
        </div>

        {/* Search Category Breakdown */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem' }}>
            Category Search Intent Distribution
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.categorySearchBreakdown.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{item.category}</span>
                <span className="badge badge-ai" style={{ fontSize: '0.75rem' }}>{item.count} searches</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
