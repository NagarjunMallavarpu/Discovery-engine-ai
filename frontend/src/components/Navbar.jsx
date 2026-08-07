import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Sparkles, Search, ShoppingBag, Heart, User, Sun, Moon, LogOut, ShieldCheck } from 'lucide-react';
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/browse?search=${encodeURIComponent(keyword.trim())}`);
    }
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'var(--bg-surface)',
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
        {/* 1. Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: '26px', height: '26px', borderRadius: '6px',
            background: 'var(--text-main)', color: 'var(--bg-main)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '0.85rem'
          }}>
            D
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.03em', color: 'var(--text-main)' }}>
            Discovery<span style={{ color: 'var(--accent-ai)' }}>.ai</span>
          </span>
        </Link>

        {/* 2. Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.1rem', fontSize: '0.85rem', fontWeight: 600, flexShrink: 0 }}>
          <Link to="/" style={{ color: location.pathname === '/' ? 'var(--accent-ai)' : 'var(--text-muted)' }}>
            Home
          </Link>
          <Link to="/browse" style={{ color: location.pathname === '/browse' && !currentCategory ? 'var(--text-main)' : 'var(--text-muted)' }}>
            All Catalog
          </Link>
          <Link to="/browse?category=laptops" style={{ color: currentCategory === 'laptops' ? 'var(--text-main)' : 'var(--text-muted)' }}>Laptops</Link>
          <Link to="/browse?category=smartphones" style={{ color: currentCategory === 'smartphones' ? 'var(--text-main)' : 'var(--text-muted)' }}>Phones</Link>
          <Link to="/browse?category=gaming" style={{ color: currentCategory === 'gaming' ? 'var(--text-main)' : 'var(--text-muted)' }}>Gaming</Link>
          <Link to="/browse?category=audio" style={{ color: currentCategory === 'audio' ? 'var(--text-main)' : 'var(--text-muted)' }}>Audio</Link>
        </nav>


        {/* 3. Large Search Bar (Primary Focus) */}
        <div style={{ flex: 1, maxWidth: '520px', position: 'relative' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search products or ask AI assistant..."
                style={{
                  width: '100%',
                  padding: '0.55rem 6.5rem 0.55rem 2.4rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-main)',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem',
                  outline: 'none',
                  transition: 'border-color 0.15s'
                }}
              />
              <Search size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />

              <button
                type="button"
                onClick={onOpenAISearch}
                style={{
                  position: 'absolute',
                  right: '0.3rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  padding: '0.3rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  background: 'var(--accent-ai)',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  cursor: 'pointer'
                }}
              >
                <Sparkles size={13} />
                Ask AI
              </button>
            </div>
          </form>
        </div>

        {/* 4. Wishlist, 5. Cart, 6. Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem', flexShrink: 0 }}>
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            style={{ background: 'transparent', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', cursor: 'pointer' }}
          >
            {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
          </button>

          {/* 4. Wishlist */}
          <Link to="/wishlist" style={{ position: 'relative', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px' }}>
            <Heart size={20} />
            {wishlist.length > 0 && (
              <span style={{ position: 'absolute', top: '-1px', right: '-1px', background: '#ef4444', color: '#fff', fontSize: '0.62rem', fontWeight: 800, width: '15px', height: '15px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* 5. Cart */}
          <Link to="/cart" style={{ position: 'relative', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px' }}>
            <ShoppingBag size={20} />
            {cart.itemCount > 0 && (
              <span style={{ position: 'absolute', top: '-1px', right: '-1px', background: 'var(--text-main)', color: 'var(--bg-main)', fontSize: '0.62rem', fontWeight: 800, width: '15px', height: '15px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {cart.itemCount}
              </span>
            )}
          </Link>

          {/* 6. Profile */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: 'transparent',
                  border: '1px solid var(--border-color)',
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  color: 'var(--text-main)'
                }}
              >
                <img src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} alt={user.name} style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{user.name.split(' ')[0]}</span>
              </button>

              {dropdownOpen && (
                <div style={{ position: 'absolute', right: 0, top: '120%', width: '190px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', padding: '0.4rem', zIndex: 100 }}>
                  <div style={{ padding: '0.4rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.4rem' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{user.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{user.email}</div>
                  </div>

                  {isAdmin && (
                    <Link to="/admin" onClick={() => setDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem', borderRadius: 'var(--radius-sm)', color: 'var(--accent-ai)', fontWeight: 700, fontSize: '0.8rem', textDecoration: 'none' }}>
                      <ShieldCheck size={15} /> Admin Dashboard
                    </Link>
                  )}

                  <Link to="/profile" onClick={() => setDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '0.8rem', textDecoration: 'none' }}>
                    <User size={15} /> Profile & Insights
                  </Link>

                  <button
                    onClick={() => { logout(); setDropdownOpen(false); }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem', borderRadius: 'var(--radius-sm)', border: 'none', background: 'transparent', color: '#ef4444', fontSize: '0.8rem', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
