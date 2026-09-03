import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, CreditCard, MapPin } from 'lucide-react';
import api from '../services/api';

const CheckoutPage = () => {
  const { cartItems, cartTotal, fetchCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [address, setAddress] = useState('123 Cyberpark Tech Boulevard, Silicon Valley, KA 560100');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card / UPI');
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      addToast('Please enter shipping address', 'error');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/orders/checkout', {
        userId: user.id,
        shippingAddress: address,
        paymentMethod: paymentMethod
      });

      addToast('Order placed successfully! 🎉', 'success');
      fetchCart();
      navigate('/orders');
    } catch (err) {
      addToast(err.response?.data?.message || 'Checkout failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '2rem' }}>Checkout & Payment</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' }}>
        {/* Shipping Form */}
        <form onSubmit={handleCheckout} className="glass-panel" style={{ padding: '2rem', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <MapPin color="#38bdf8" size={20} /> Shipping Address
            </h3>
            <textarea
              rows="3"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter full delivery address..."
              style={{
                width: '100%',
                padding: '0.8rem',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '0.95rem'
              }}
            />
          </div>

          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <CreditCard color="#818cf8" size={20} /> Payment Option
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {['UPI / GPay / PhonePe', 'Credit / Debit Card', 'Net Banking', 'Cash on Delivery'].map((method, idx) => (
                <label
                  key={idx}
                  style={{
                    padding: '0.8rem 1rem',
                    background: paymentMethod === method ? 'rgba(56, 189, 248, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                    border: paymentMethod === method ? '1px solid #38bdf8' : '1px solid var(--border-color)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                  />
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{method}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ padding: '0.9rem', fontSize: '1.05rem', marginTop: '0.5rem' }} disabled={loading}>
            <CheckCircle2 size={20} /> {loading ? 'Processing Order...' : `Place Order (₹${cartTotal.toLocaleString()})`}
          </button>
        </form>

        {/* Order Items Preview */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Order Preview</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '300px', overflowY: 'auto' }}>
            {cartItems.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#cbd5e1' }}>{item.product?.name} (x{item.quantity})</span>
                <span style={{ color: 'white', fontWeight: 600 }}>₹{(item.product?.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
            <span>Total Payable</span>
            <span style={{ color: '#38bdf8' }}>₹{cartTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
