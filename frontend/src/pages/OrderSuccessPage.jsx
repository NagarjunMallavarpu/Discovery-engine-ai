import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Truck, ShoppingBag, Calendar, Sparkles, ArrowRight } from 'lucide-react';
import API from '../services/api';
import ProductCard from '../components/ProductCard';

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(!location.state?.order);

  useEffect(() => {
    fetchOrderDetails();
    fetchRecommendations();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    if (order) return;
    try {
      setLoading(true);
      const res = await API.get('/orders/my-orders');
      if (res.data.success && res.data.orders) {
        const found = res.data.orders.find(o => o.id === orderId || o.orderNumber === orderId);
        if (found) setOrder(found);
      }
    } catch (err) {
      console.error('Fetch order detail error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const res = await API.get('/recommendations/personalized?limit=4');
      if (res.data.success) {
        setRecommendations(res.data.recommendations);
      }
    } catch (err) {
      console.error('Fetch recommendations error:', err);
    }
  };

  // Generate estimated delivery date (3 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  const formattedDelivery = deliveryDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div className="skeleton" style={{ height: '60px', width: '60px', borderRadius: '50%', margin: '0 auto 1rem' }} />
        <div className="skeleton" style={{ height: '28px', width: '250px', margin: '0 auto' }} />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 6rem', maxWidth: '900px' }}>
      {/* 1. SUCCESS HERO HEADER */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '3rem 2rem',
        textAlign: 'center',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '2.5rem'
      }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          background: '#10b98115', color: '#10b981',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.25rem'
        }}>
          <CheckCircle2 size={44} />
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
          Order Successfully Placed!
        </h1>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Thank you for shopping with Discovery Engine. Your order is confirmed.
        </p>

        {/* Info Badges */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1.25rem', textAlign: 'left' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>ORDER NUMBER</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {order?.orderNumber || `ORD-${orderId?.slice(0, 8)}`}
            </div>
          </div>

          <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1.25rem', textAlign: 'left' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>ESTIMATED DELIVERY</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Calendar size={15} /> {formattedDelivery}
            </div>
          </div>

          <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1.25rem', textAlign: 'left' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>PAYMENT METHOD</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Truck size={15} /> Cash on Delivery
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <Link to="/browse" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '0.92rem' }}>
          <ShoppingBag size={18} /> Continue Shopping
        </Link>
      </div>

      {/* 2. ORDERED ITEMS SUMMARY */}
      {order && order.items && order.items.length > 0 && (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-main)' }}>
            Purchased Items ({order.items.length})
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {order.items.map((item, idx) => {
              const prod = item.product || {};
              const img = prod.images?.find(i => i.isPrimary)?.url || prod.images?.[0]?.url;
              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: idx < order.items.length - 1 ? '1px solid var(--border-color)' : 'none', paddingBottom: '0.75rem' }}>
                  <img src={img} alt="" style={{ width: '54px', height: '54px', objectFit: 'contain', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', padding: '0.2rem' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>{prod.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Quantity: {item.quantity}</div>
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. CONTINUE EXPLORING / RECOMMENDATIONS SECTION */}
      {recommendations.length > 0 && (
        <section style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} style={{ color: 'var(--accent-ai)' }} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>Recommended For You</h2>
            </div>
            <Link to="/browse" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-ai)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              Explore All <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem' }}>
            {recommendations.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
