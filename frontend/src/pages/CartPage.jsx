import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import API from '../services/api';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(null);
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };


  if (orderPlaced) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center', maxWidth: '600px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <CheckCircle2 size={36} />
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Order Placed Successfully!</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Order Number: <strong style={{ color: 'var(--accent-ai)' }}>{orderPlaced.orderNumber}</strong>
        </p>
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '2rem', textAlign: 'left' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>Order Summary ({orderPlaced.items.length} items)</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Total Paid: ₹{orderPlaced.totalAmount.toLocaleString('en-IN')}
          </div>
        </div>
        <Link to="/browse" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center', maxWidth: '500px' }}>
        <ShoppingBag size={56} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Your Shopping Cart is Empty</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Explore our smart catalog and find products recommended specifically for you.
        </p>
        <Link to="/browse" className="btn btn-primary">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem' }}>
        Shopping Cart ({cart.itemCount} Items)
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
        {/* Cart Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cart.items.map(item => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
              <img
                src={item.product.images?.[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'}
                alt={item.product.title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200';
                }}
                style={{ width: '80px', height: '80px', objectFit: 'contain', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', padding: '0.5rem' }}
              />

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{item.product.brand}</div>
                <Link to={`/products/${item.product.slug}`} style={{ textDecoration: 'none' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>{item.product.title}</h3>
                </Link>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>
                  ₹{item.product.price.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Quantity Adjuster */}
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', background: 'var(--bg-main)' }}>
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ padding: '0.35rem 0.65rem', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 700 }}>-</button>
                <span style={{ padding: '0 0.5rem', fontSize: '0.85rem', fontWeight: 700 }}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ padding: '0.35rem 0.65rem', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 700 }}>+</button>
              </div>

              {/* Subtotal */}
              <div style={{ minWidth: '100px', textAlign: 'right', fontWeight: 800, fontSize: '1.05rem' }}>
                ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
              </div>

              {/* Delete Button */}
              <button onClick={() => removeFromCart(item.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem' }}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem' }}>Order Summary</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Subtotal ({cart.itemCount} items)</span>
              <span>₹{cart.totalAmount.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Express Shipping</span>
              <span style={{ color: '#10b981', fontWeight: 700 }}>FREE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Tax (GST Included)</span>
              <span>₹0</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 900, marginBottom: '1.5rem' }}>
            <span>Total Payable</span>
            <span style={{ color: 'var(--accent-ai)' }}>₹{cart.totalAmount.toLocaleString('en-IN')}</span>
          </div>

          <button onClick={handleCheckout} disabled={checkingOut} className="btn btn-ai" style={{ width: '100%', padding: '0.85rem' }}>
            {checkingOut ? 'Processing Order...' : <>Proceed to Checkout <ArrowRight size={18} /></>}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
            <ShieldCheck size={14} /> 256-bit Encrypted Checkout Guarantee
          </div>
        </div>
      </div>
    </div>
  );
}
