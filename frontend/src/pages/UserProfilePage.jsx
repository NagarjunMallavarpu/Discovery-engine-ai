import React, { useState, useEffect } from 'react';
import { User, History, Search, ShoppingBag, Sparkles, Clock } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import AIInsightsPanel from '../components/AIInsightsPanel';

export default function UserProfilePage() {
  const { user } = useAuth();
  const [searchHistory, setSearchHistory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [searchRes, orderRes] = await Promise.all([
        API.get('/search/history'),
        API.get('/orders/my-orders')
      ]);

      if (searchRes.data.success) setSearchHistory(searchRes.data.searches);
      if (orderRes.data.success) setOrders(orderRes.data.orders);
    } catch (err) {
      console.error('Fetch profile data error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      {/* Profile Header */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '2rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'}
          alt={user?.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200';
          }}
          style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent-ai)' }}
        />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{user?.name}</h1>
            <span className="badge badge-ai"><Sparkles size={12} /> {user?.role}</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user?.email}</p>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Account ID: <code style={{ background: 'var(--bg-main)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>{user?.id}</code>
          </div>
        </div>
      </div>

      {/* AI Insights Intelligence Panel */}
      <div style={{ marginBottom: '2.5rem' }}>
        <AIInsightsPanel />
      </div>


      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Search Intent Activity Log */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.1rem', marginBottom: '1.25rem' }}>
            <Search size={20} style={{ color: 'var(--accent-ai)' }} /> AI Search & Intent History
          </div>

          {searchHistory.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No search queries logged yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {searchHistory.map(s => (
                <div key={s.id} style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.85rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                    "{s.query}"
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', fontSize: '0.75rem' }}>
                    {s.parsedCategory && <span className="badge badge-ai">Category: {s.parsedCategory}</span>}
                    {s.parsedMaxPrice && <span className="badge badge-success">Budget ≤ ₹{s.parsedMaxPrice}</span>}
                    {s.parsedBrand && <span className="badge badge-warning">Brand: {s.parsedBrand}</span>}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={12} /> {new Date(s.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Past Orders */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.1rem', marginBottom: '1.25rem' }}>
            <ShoppingBag size={20} style={{ color: 'var(--accent-primary)' }} /> Order History
          </div>

          {orders.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No past orders found.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {orders.map(o => (
                <div key={o.id} style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                    <strong style={{ color: 'var(--accent-ai)' }}>{o.orderNumber}</strong>
                    <span className="badge badge-success">{o.status}</span>
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                    Total: ₹{o.totalAmount.toLocaleString('en-IN')} ({o.items?.length} items)
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Placed on: {new Date(o.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
