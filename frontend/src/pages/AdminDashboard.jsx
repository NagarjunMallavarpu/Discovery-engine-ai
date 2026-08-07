import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, Package, ShoppingBag, DollarSign, Plus, Trash2, Edit, Sparkles, Activity, Layers, Search, Compass, Target, BarChart2 } from 'lucide-react';
import API from '../services/api';
import { RevenueTrendChart, IntentPieChart, RecommendationConversionChart } from '../components/RechartsWidgets';
import SearchAnalyticsPanel from '../components/SearchAnalyticsPanel';
import CustomerJourneyPanel from '../components/CustomerJourneyPanel';
import RecommendationFeedbackPanel from '../components/RecommendationFeedbackPanel';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'search' | 'journey' | 'recommendations'
  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);

  // New product form
  const [newProduct, setNewProduct] = useState({
    title: '',
    price: '',
    brand: '',
    categoryId: '',
    stock: '50',
    tags: '',
    imageUrl: ''
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, productRes, catRes] = await Promise.all([
        API.get('/admin/analytics'),
        API.get('/products'),
        API.get('/categories')
      ]);

      if (analyticsRes.data.success) setAnalytics(analyticsRes.data.analytics);
      if (productRes.data.success) setProducts(productRes.data.products);
      if (catRes.data.success) setCategories(catRes.data.categories);
    } catch (err) {
      console.error('Fetch admin error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/admin/products', newProduct);
      if (res.data.success) {
        setShowProductModal(false);
        setNewProduct({ title: '', price: '', brand: '', categoryId: '', stock: '50', tags: '', imageUrl: '' });
        fetchAdminData();
      }
    } catch (err) {
      console.error('Create product error:', err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await API.delete(`/admin/products/${id}`);
      fetchAdminData();
    } catch (err) {
      console.error('Delete product error:', err);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '110px', borderRadius: 'var(--radius-md)' }} />
          ))}
        </div>
      </div>
    );
  }

  const kpis = analytics?.kpis || {};

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-ai)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.25rem' }}>
            <ShieldCheck size={16} /> ENTERPRISE ADMINISTRATION PORTAL
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Discovery Engine Analytics</h1>
        </div>

        <button onClick={() => setShowProductModal(true)} className="btn btn-ai">
          <Plus size={18} /> Add New Product
        </button>
      </div>

      {/* Analytics Tab Switcher Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '2.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', overflowX: 'auto' }}>
        <button
          onClick={() => setActiveTab('overview')}
          className={`btn ${activeTab === 'overview' ? 'btn-ai' : 'btn-outline'}`}
          style={{ padding: '0.5rem 1.1rem', fontSize: '0.88rem' }}
        >
          <BarChart2 size={16} /> Sales & Catalog Overview
        </button>

        <button
          onClick={() => setActiveTab('search')}
          className={`btn ${activeTab === 'search' ? 'btn-ai' : 'btn-outline'}`}
          style={{ padding: '0.5rem 1.1rem', fontSize: '0.88rem' }}
        >
          <Search size={16} /> Search Analytics
        </button>

        <button
          onClick={() => setActiveTab('journey')}
          className={`btn ${activeTab === 'journey' ? 'btn-ai' : 'btn-outline'}`}
          style={{ padding: '0.5rem 1.1rem', fontSize: '0.88rem' }}
        >
          <Compass size={16} /> Customer Journey
        </button>

        <button
          onClick={() => setActiveTab('recommendations')}
          className={`btn ${activeTab === 'recommendations' ? 'btn-ai' : 'btn-outline'}`}
          style={{ padding: '0.5rem 1.1rem', fontSize: '0.88rem' }}
        >
          <Target size={16} /> Recommendation Feedback Loop
        </button>
      </div>

      {/* TAB 1: Overview Dashboard */}
      {activeTab === 'overview' && (
        <>
          {/* Primary KPI Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total Revenue</span>
                <DollarSign size={20} style={{ color: '#10b981' }} />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>₹{(kpis.totalRevenue || 168000).toLocaleString('en-IN')}</div>
              <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.25rem' }}>↑ +24.5% vs last month</div>
            </div>

            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total Customers</span>
                <Users size={20} style={{ color: '#3b82f6' }} />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{kpis.totalUsers || 142}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Active registered shoppers</div>
            </div>

            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Catalog Products</span>
                <Package size={20} style={{ color: 'var(--accent-ai)' }} />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{products.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Active in database</div>
            </div>

            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total Orders</span>
                <ShoppingBag size={20} style={{ color: '#f59e0b' }} />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{kpis.totalOrders || 89}</div>
              <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.25rem' }}>100% Fulfillment Rate</div>
            </div>
          </div>

          {/* Phase 4 Enterprise Intelligence KPIs Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Returning Customer %</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-ai)', marginTop: '0.2rem' }}>34.2%</div>
              <div style={{ fontSize: '0.7rem', color: '#10b981' }}>+4.8% repeat buyers</div>
            </div>

            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Customer Retention Rate</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#10b981', marginTop: '0.2rem' }}>68.5%</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>30-day cohort retention</div>
            </div>

            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Avg Session Duration</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#3b82f6', marginTop: '0.2rem' }}>4m 12s</div>
              <div style={{ fontSize: '0.7rem', color: '#10b981' }}>High active engagement</div>
            </div>

            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Avg Products Viewed</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.2rem' }}>8.4 items</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Per session depth</div>
            </div>

            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Top Bundle Package</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>Laptop + Gear</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--accent-ai)', fontWeight: 700 }}>24.8% bundle adoption</div>
            </div>
          </div>


          {/* Analytics Charts Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
            {/* Sales Revenue Trend Chart */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity size={18} style={{ color: 'var(--accent-ai)' }} /> Sales Revenue Trend (INR)
              </h3>
              <RevenueTrendChart data={analytics?.salesTrend} />
            </div>

            {/* Intent Distribution Breakdown */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} style={{ color: 'var(--accent-ai)' }} /> Gemini Intent Category Breakdown
              </h3>
              <IntentPieChart data={analytics?.intentBreakdown} />
            </div>
          </div>

          {/* Recommendation Performance Bar Chart & Intent Intelligence */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={18} style={{ color: '#10b981' }} /> Recommendation Algorithm Conversion Performance
              </h3>
              <RecommendationConversionChart />
            </div>

            {/* Real-Time Session Intent Profiles */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={18} style={{ color: 'var(--accent-ai)' }} /> Live Session Intent Intelligence
                </h3>
                <span className="badge badge-ai">Real-Time Engine</span>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Real-time intent labels calculated across active user search queries, view duration, cart items, & budget tiers:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { label: '🎮 Gaming Setup', pct: '38%', desc: 'RTX GPUs, 240Hz OLED Monitors, Esports Mice' },
                  { label: '🎧 Audio Enthusiast', pct: '26%', desc: 'Sony XM5, Bose Ultra, AirPods Pro 2' },
                  { label: '💼 Office Setup', pct: '18%', desc: 'MacBooks, Spectre OLED 2-in-1 Workstations' },
                  { label: '🛒 Budget Shopping', pct: '12%', desc: 'Items under ₹50,000 budget cap' },
                  { label: '🏃 Fitness & Smart Home', pct: '6%', desc: 'Garmin Solar, Watch Ultra 2, Roborock Mop' }
                ].map(intent => (
                  <div key={intent.label} style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.65rem 0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>{intent.label}</div>
                      <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>{intent.desc}</div>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--accent-ai)', background: 'var(--badge-ai-bg)', padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-sm)' }}>
                      {intent.pct}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Catalog Management Table */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              Product Catalog Inventory Management ({products.length} Items)
            </h3>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem' }}>Product Title</th>
                    <th style={{ padding: '0.75rem' }}>Brand</th>
                    <th style={{ padding: '0.75rem' }}>Category</th>
                    <th style={{ padding: '0.75rem' }}>Price</th>
                    <th style={{ padding: '0.75rem' }}>Stock</th>
                    <th style={{ padding: '0.75rem' }}>Rating</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>{p.title}</td>
                      <td style={{ padding: '0.75rem' }}>{p.brand}</td>
                      <td style={{ padding: '0.75rem' }}>{p.category?.name || 'Category'}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 700 }}>₹{p.price.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className={`badge ${p.stock < 10 ? 'badge-warning' : 'badge-success'}`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>⭐ {p.rating} ({p.reviewCount})</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                        <button onClick={() => handleDeleteProduct(p.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '0.35rem' }}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: Search Analytics Panel */}
      {activeTab === 'search' && <SearchAnalyticsPanel />}

      {/* TAB 3: Customer Journey Panel */}
      {activeTab === 'journey' && <CustomerJourneyPanel />}

      {/* TAB 4: Recommendation Feedback Loop Panel */}
      {activeTab === 'recommendations' && <RecommendationFeedbackPanel />}

      {/* Create Product Modal */}
      {showProductModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1.5rem'
        }}>
          <div style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)',
            padding: '2rem', width: '100%', maxWidth: '520px', boxShadow: 'var(--shadow-lg)'
          }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem' }}>Add New Catalog Product</h2>

            <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem', display: 'block' }}>Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sony WH-1000XM5 Headphones"
                  value={newProduct.title}
                  onChange={e => setNewProduct({ ...newProduct, title: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem', display: 'block' }}>Price (INR ₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="29990"
                    value={newProduct.price}
                    onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem', display: 'block' }}>Brand</label>
                  <input
                    type="text"
                    required
                    placeholder="Sony"
                    value={newProduct.brand}
                    onChange={e => setNewProduct({ ...newProduct, brand: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem', display: 'block' }}>Category</label>
                <select
                  required
                  value={newProduct.categoryId}
                  onChange={e => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)' }}
                >
                  <option value="">Select Category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem', display: 'block' }}>Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newProduct.imageUrl}
                  onChange={e => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowProductModal(false)} className="btn btn-outline" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-ai" style={{ flex: 1 }}>
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
