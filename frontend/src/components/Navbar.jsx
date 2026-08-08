import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Sparkles, Search, ShoppingBag, Heart, User, Sun, Moon, LogOut, ShieldCheck, Command } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function Navbar({ onOpenAISearch }) {
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const currentCategory = new URLSearchParams(location.search).get('category') || '';
  const [keyword, setKeyword] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Global Ctrl + K / Cmd + K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenAISearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenAISearch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/browse?search=${encodeURIComponent(keyword.trim())}`);
    }
  };

  const navItemStyle = (isActive) => ({
    color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
    fontWeight: isActive ? 700 : 500,
    position: 'relative',
    padding: '0.4rem 0.2rem',
    transition: 'color 0.2s ease',
    textDecoration: 'none'
  });

  return (
    <header className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      borderBottom: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1.5rem',
        gap: '1.5rem'
      }}>
        {/* 1. Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: '30px', height: '30px', borderRadius: '8px',
            background: 'var(--accent-ai-gradient)', color: '#ffffff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: '0.95rem',
            boxShadow: '0 4px 12px var(--accent-ai-glow)'
          }}>
            D
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.25rem', letterSpacing: '-0.04em', color: 'var(--text-main)' }}>
            Discovery<span className="text-gradient-brand">.ai</span>
          </span>
        </Link>

        {/* 2. Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', fontSize: '0.85rem', flexShrink: 0 }}>
          <Link to="/" style={navItemStyle(location.pathname === '/')}>
            Home
            {location.pathname === '/' && <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'var(--accent-ai)', borderRadius: '2px' }} />}
          </Link>
          <Link to="/browse" style={navItemStyle(location.pathname === '/browse' && !currentCategory)}>
            All Catalog
            {location.pathname === '/browse' && !currentCategory && <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'var(--accent-ai)', borderRadius: '2px' }} />}
          </Link>
          <Link to="/browse?category=laptops" style={navItemStyle(currentCategory === 'laptops')}>Laptops</Link>
          <Link to="/browse?category=smartphones" style={navItemStyle(currentCategory === 'smartphones')}>Phones</Link>
          <Link to="/browse?category=gaming" style={navItemStyle(currentCategory === 'gaming')}>Gaming</Link>
          <Link to="/browse?category=audio" style={navItemStyle(currentCategory === 'audio')}>Audio</Link>
        </nav>

        {/* 3. Search Bar with Ctrl+K shortcut badge */}
        <div style={{ flex: 1, maxWidth: '500px', position: 'relative' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search products or ask AI assistant..."
                style={{
                  width: '100%',
                  padding: '0.55rem 8rem 0.55rem 2.4rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-main)',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
              />
              <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />

              <div style={{ position: 'absolute', right: '0.35rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span
                  onClick={onOpenAISearch}
                  style={{
                    padding: '0.15rem 0.45rem',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    borderRadius: '4px',
                    background: 'var(--bg-surface-hover)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem'
                  }}
                  title="Press Ctrl+K to open AI search"
                >
                  <Command size={10} /> K
                </span>

                <button
                  type="button"
                  onClick={onOpenAISearch}
                  className="btn-ai"
                  style={{
                    padding: '0.35rem 0.8rem',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    cursor: 'pointer'
                  }}
                >
                  <Sparkles size={13} className="pulse-ai" />
                  Ask AI
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* 4. Controls: Theme, Wishlist, Cart, Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            style={{
              background: 'var(--bg-main)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-full)',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-main)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} style={{ color: '#f59e0b' }} />}
          </button>

          {/* Wishlist */}
          <Link to="/wishlist" style={{ position: 'relative', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: 'var(--radius-full)', background: 'var(--bg-main)', border: '1px solid var(--border-color)' }}>
            <Heart size={18} />
            {wishlist.length > 0 && (
              <span style={{ position: 'absolute', top: '-2px', right: '-2px', background: '#ef4444', color: '#fff', fontSize: '0.62rem', fontWeight: 800, width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)' }}>
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/cart" style={{ position: 'relative', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: 'var(--radius-full)', background: 'var(--bg-main)', border: '1px solid var(--border-color)' }}>
            <ShoppingBag size={18} />
            {cart.itemCount > 0 && (
              <span style={{ position: 'absolute', top: '-2px', right: '-2px', background: 'var(--accent-ai)', color: '#ffffff', fontSize: '0.62rem', fontWeight: 800, width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px var(--accent-ai-glow)' }}>
                {cart.itemCount}
              </span>
            )}
          </Link>

          {/* Profile Dropdown */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  padding: '0.3rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  color: 'var(--text-main)',
                  transition: 'all 0.2s ease'
                }}
              >
                <img src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} alt={user.name} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>{user.name.split(' ')[0]}</span>
              </button>

              {dropdownOpen && (
                <div className="glass-panel" style={{
                  position: 'absolute',
                  right: 0,
                  top: '125%',
                  width: '210px',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '0.5rem',
                  zIndex: 100
                }}>
                  <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.4rem' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>{user.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{user.email}</div>
                  </div>

                  {isAdmin && (
                    <Link to="/admin" onClick={() => setDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: 'var(--radius-sm)', color: 'var(--accent-ai)', fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none' }}>
                      <ShieldCheck size={16} /> Admin Dashboard
                    </Link>
                  )}

                  <Link to="/profile" onClick={() => setDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '0.82rem', textDecoration: 'none' }}>
                    <User size={16} /> Profile & Affinity
                  </Link>

                  <button
                    onClick={() => { logout(); setDropdownOpen(false); }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: 'none', background: 'transparent', color: '#ef4444', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.82rem' }}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
