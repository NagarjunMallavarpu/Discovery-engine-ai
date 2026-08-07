import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, ArrowLeft, Check, ShoppingBag, CreditCard, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import API from '../services/api';

export default function CheckoutPage() {
  const { cart, fetchCart, clearCart } = useCart();
  const navigate = useNavigate();


  const [form, setForm] = useState({
    fullName: 'Alex Rivera',
    mobile: '+91 98765 43210',
    address: '42 Tech Park Avenue, Suite 400',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001'
  });

  const [loading, setLoading] = useState(false);

  const cartItems = cart?.items || [];
  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 50000 ? 0 : 490;
  const grandTotal = subtotal + shipping;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!cartItems.length) {
      alert('Your cart is empty.');
      return;
    }

    try {
      setLoading(true);
      const fullShippingAddress = `${form.fullName}, ${form.mobile}, ${form.address}, ${form.city}, ${form.state} - ${form.pincode}`;

      let res;
      const payload = {
        shippingAddress: fullShippingAddress,
        items: cartItems.map(i => ({ productId: i.productId || i.product?.id, quantity: i.quantity }))
      };

      try {
        res = await API.post('/orders/checkout', payload);
      } catch (e1) {
        res = await API.post('/orders', payload);
      }


      if (res.data.success && res.data.order) {
        if (typeof fetchCart === 'function') await fetchCart();
        if (typeof clearCart === 'function') await clearCart();
        navigate(`/order-success/${res.data.order.id}`, { state: { order: res.data.order, deliveryInfo: form } });
      } else {

        alert(res.data.message || 'Failed to place order.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      const errMsg = err.response?.data?.message || err.message || 'Error placing order. Please try again.';
      alert(errMsg);
    } finally {

      setLoading(false);
    }
  };

  if (!cartItems.length) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <ShoppingBag size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Your Cart is Empty</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Add items to your cart before proceeding to checkout.</p>
        <Link to="/browse" className="btn btn-primary">Browse Catalog</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem', maxWidth: '1100px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.88rem', textDecoration: 'none' }}>
          <ArrowLeft size={16} /> Back to Cart
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>
          <Lock size={14} /> Encrypted 256-Bit Express Checkout
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
        {/* Left Column: Delivery Form & Payment Selection */}
        <div>
          {/* Delivery Information Section */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-main)' }}>
              1. Delivery Information
            </h2>

            <form onSubmit={handlePlaceOrder}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={form.fullName}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>Mobile Number</label>
                  <input
                    type="text"
                    name="mobile"
                    required
                    value={form.mobile}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>Delivery Address</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={form.address}
                  onChange={handleChange}
                  placeholder="House / Flat No, Building, Street, Landmark"
                  style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={form.city}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>State</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={form.state}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    value={form.pincode}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.88rem' }}
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Payment Method Section (Cash on Delivery Default) */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-main)' }}>
              2. Payment Method
            </h2>

            <div style={{
              background: 'var(--badge-ai-bg)',
              border: '1.5px solid #10b981',
              borderRadius: 'var(--radius-md)',
              padding: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#10b98115', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Truck size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                    Cash on Delivery (COD)
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Pay with cash or UPI upon delivery at your doorstep
                  </div>
                </div>
              </div>

              <div style={{
                fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.6rem',
                borderRadius: 'var(--radius-full)', background: '#10b981', color: '#fff',
                display: 'flex', alignItems: 'center', gap: '0.2rem'
              }}>
                <Check size={12} /> Default
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Sidebar */}
        <div>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem', position: 'sticky', top: '90px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-main)' }}>
              Order Summary ({cartItems.length})
            </h2>

            {/* Cart Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem', maxHeight: '300px', overflowY: 'auto' }}>
              {cartItems.map(item => {
                const img = item.product.images?.find(i => i.isPrimary)?.url || item.product.images?.[0]?.url;
                return (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                    <img src={img} alt="" style={{ width: '48px', height: '48px', objectFit: 'contain', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', padding: '0.2rem' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-main)' }}>
                        {item.product.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Qty: {item.quantity} × ₹{item.product.price.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Price Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Shipping</span>
                <span style={{ fontWeight: 700, color: shipping === 0 ? '#10b981' : 'var(--text-main)' }}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
            </div>

            {/* Total Price */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>Total Amount</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--accent-ai)' }}>
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Place Order CTA Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.9rem',
                fontSize: '0.95rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {loading ? 'Processing Order...' : <><ShieldCheck size={18} /> Place Order (Cash on Delivery)</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
