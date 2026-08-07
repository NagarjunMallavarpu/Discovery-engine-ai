import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Cpu, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, KeyRound, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [searchParams] = useSearchParams();
  const initialPortal = searchParams.get('portal') === 'admin' ? 'admin' : 'customer';
  
  const [portal, setPortal] = useState(initialPortal);
  const [email, setEmail] = useState(initialPortal === 'admin' ? 'admin@discovery.ai' : 'user@discovery.ai');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (portal === 'admin') {
      setEmail('admin@discovery.ai');
      setPassword('password123');
    } else {
      setEmail('user@discovery.ai');
      setPassword('password123');
    }
  }, [portal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      const res = await login(email, password);
      if (res?.user?.role === 'ADMIN' || portal === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const isAdminPortal = portal === 'admin';

  return (
    <div style={{ minHeight: '82vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 1.5rem' }}>
      <div
        style={{
          background: isAdminPortal ? 'var(--bg-surface)' : 'var(--bg-card)',
          border: isAdminPortal ? '2px solid var(--accent-ai)' : '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: isAdminPortal ? 'var(--shadow-ai)' : 'var(--shadow-lg)',
          width: '100%',
          maxWidth: '460px',
          padding: '2.5rem 2rem',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Portal Selection Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            background: 'var(--bg-main)',
            padding: '0.35rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            marginBottom: '2rem'
          }}
        >
          <button
            type="button"
            onClick={() => setPortal('customer')}
            style={{
              padding: '0.6rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: !isAdminPortal ? 'var(--bg-surface)' : 'transparent',
              color: !isAdminPortal ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontWeight: !isAdminPortal ? 700 : 500,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
              boxShadow: !isAdminPortal ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <UserCheck size={16} /> Customer Portal
          </button>

          <button
            type="button"
            onClick={() => setPortal('admin')}
            style={{
              padding: '0.6rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: isAdminPortal ? 'var(--accent-ai-gradient)' : 'transparent',
              color: isAdminPortal ? '#ffffff' : 'var(--text-muted)',
              fontWeight: isAdminPortal ? 700 : 500,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
              boxShadow: isAdminPortal ? 'var(--shadow-ai)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <ShieldCheck size={16} /> Admin Command
          </button>
        </div>

        {/* Portal Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: isAdminPortal ? 'var(--accent-ai-gradient)' : 'rgba(37, 99, 235, 0.12)',
              color: isAdminPortal ? '#ffffff' : 'var(--accent-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              boxShadow: isAdminPortal ? 'var(--shadow-ai)' : 'none'
            }}
          >
            {isAdminPortal ? <ShieldCheck size={28} /> : <Cpu size={28} />}
          </div>

          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '0.35rem' }}>
            {isAdminPortal ? 'Admin Command Center' : 'Customer Account Login'}
          </h1>
          
          <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            {isAdminPortal
              ? 'Restricted security clearance. Manage products, view intent engine analytics, & operational KPIs.'
              : 'Sign in to access personalized Gemini recommendations & your saved wishlist.'}
          </p>
        </div>

        {/* Admin Security Clearance Badge */}
        {isAdminPortal && (
          <div
            style={{
              background: 'var(--badge-ai-bg)',
              border: '1px solid var(--badge-ai-border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            <KeyRound size={22} style={{ color: 'var(--accent-ai)', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-ai)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Level 4 Security Clearance
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Demo Admin: <code style={{ color: 'var(--text-main)', fontWeight: 700 }}>admin@discovery.ai</code>
              </div>
            </div>
          </div>
        )}

        {/* Customer Demo Quick Login Indicator */}
        {!isAdminPortal && (
          <div
            style={{
              background: 'rgba(37, 99, 235, 0.08)',
              border: '1px solid rgba(37, 99, 235, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            <Sparkles size={20} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                Demo Customer Account
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Email: <code style={{ color: 'var(--text-main)', fontWeight: 700 }}>user@discovery.ai</code>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              marginBottom: '1.25rem'
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              {isAdminPortal ? 'Admin Email Address' : 'Email Address'}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isAdminPortal ? 'admin@discovery.ai' : 'user@discovery.ai'}
                style={{
                  width: '100%',
                  padding: '0.7rem 1rem 0.7rem 2.6rem',
                  borderRadius: 'var(--radius-md)',
                  border: isAdminPortal ? '1px solid var(--badge-ai-border)' : '1px solid var(--border-color)',
                  background: 'var(--bg-main)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem'
                }}
              />
              <Mail size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: isAdminPortal ? 'var(--accent-ai)' : 'var(--text-muted)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '0.7rem 1rem 0.7rem 2.6rem',
                  borderRadius: 'var(--radius-md)',
                  border: isAdminPortal ? '1px solid var(--badge-ai-border)' : '1px solid var(--border-color)',
                  background: 'var(--bg-main)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem'
                }}
              />
              <Lock size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: isAdminPortal ? 'var(--accent-ai)' : 'var(--text-muted)' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={isAdminPortal ? 'btn btn-ai' : 'btn btn-primary'}
            style={{ padding: '0.85rem', marginTop: '0.5rem', fontWeight: 700 }}
          >
            {loading ? (
              'Authenticating Credentials...'
            ) : (
              <>
                {isAdminPortal ? 'Enter Admin Command Center' : 'Sign In To Account'} <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Need a new customer account?{' '}
          <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
